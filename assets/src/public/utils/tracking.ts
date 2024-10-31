/**
 * External dependencies
 */
import pick from 'lodash/pick';
import type { Uuid } from 'uuid';
import type {
	ExperimentId,
	Maybe,
	TrackEvent,
	UniqueVisitEvent,
	VisitEvent,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { getCookie, removeCookie, setCookie } from './cookies';
import {
	areHeatmapConditionsValid,
	doesExperimentHaveValidSegments,
} from './segmentation';
import type { GoalIndex, HeatmapSummary, Session } from '../types';

type ExpsWithViews = Partial< Record< ExperimentId, Timestamp > >;
type Timestamp = number;

const TEN_DAYS_IN_MILLIS = 14400 * 60000;

export function updateExperimentsWithPageViews(
	events: ReadonlyArray< VisitEvent >,
	session: Session
): void {
	removeOldExperimentsFromCookie( session );
	if ( ! events.length ) {
		return;
	} //end if

	const now = new Date().getTime();
	setExperimentsWithPageViewsCookie( {
		...getExperimentsWithPageViews(),
		...events.reduce( ( result, event ) => {
			result[ event.experiment ] = now;
			return result;
		}, {} as ExpsWithViews ),
	} );
} //end updateExperimentsWithPageViews()

export function getUniqueViews(): Partial< Record< ExperimentId, Uuid > > {
	try {
		const value = getCookie( 'nabUniqueViews' ) ?? '';
		return JSON.parse( value ) as Partial< Record< ExperimentId, Uuid > >;
	} catch ( _ ) {
		return {};
	} //end try
} //end getUniqueViews()

export function updateUniqueViews(
	value: ReadonlyArray< UniqueVisitEvent >
): void {
	const allUniqueViews = {
		...getUniqueViews(),
		...value.reduce( ( r, v ) => ( { ...r, [ v.experiment ]: v.id } ), {} ),
	};

	const views = getExperimentsWithPageViews();
	const uniqueViews = pick( allUniqueViews, Object.keys( views ) );
	if ( 0 === Object.keys( uniqueViews ).length ) {
		removeCookie( 'nabUniqueViews' );
		return;
	} //end if

	setCookie( 'nabUniqueViews', JSON.stringify( uniqueViews ), {
		expires: 120,
	} );
} //end updateUniqueViews()

export function canSynchEvent( event: TrackEvent, session: Session ): boolean {
	const heatmap = getHeatmap( event.experiment, session );
	if ( heatmap ) {
		return areHeatmapConditionsValid( heatmap );
	} //end if

	if ( ! doesExperimentHaveValidSegments( event.experiment ) ) {
		return false;
	} //end if

	const experimentsWithPageViews = getExperimentsWithPageViews();
	const timestamp = experimentsWithPageViews[ event.experiment ];
	if ( ! timestamp ) {
		return 'visit' === event.kind;
	} //end if

	if ( 'visit' === event.kind ) {
		if ( 'regular' === event.type ) {
			return true;
		} //end if
		const wait = session.throttle[ event.type ];
		const now = new Date().getTime();
		return timestamp + wait * 60000 < now;
	} //end if

	return (
		'conversion' !== event.kind ||
		canSynchConversion( event.experiment, event.goal )
	);
} //end canSynchEvent()

export function getExperimentsWithPageViews(): ExpsWithViews {
	try {
		const value = getCookie( 'nabExperimentsWithPageViews' ) ?? '';
		return JSON.parse( value ) as ExpsWithViews;
	} catch ( _ ) {
		return {};
	} //end try
} //end getExperimentsWithPageViews()

// =======
// HELPERS
// =======

let synchedGoals: ReadonlyArray< string > = [];
function canSynchConversion(
	experimentId: ExperimentId,
	goalIndex: GoalIndex
): boolean {
	if ( synchedGoals.includes( `${ experimentId }-${ goalIndex }` ) ) {
		return false;
	} //end if

	synchedGoals = [ ...synchedGoals, `${ experimentId }-${ goalIndex }` ];
	return true;
} //end canSynchConversion()

function setExperimentsWithPageViewsCookie( value: ExpsWithViews ): void {
	if ( 0 === Object.keys( value ).length ) {
		removeCookie( 'nabExperimentsWithPageViews' );
		return;
	} //end if
	setCookie( 'nabExperimentsWithPageViews', JSON.stringify( value ), {
		expires: 120,
	} );
} //end setExperimentsWithPageViewsCookie()

let wasCookieCleaned = false;
function removeOldExperimentsFromCookie( session: Session ): void {
	if ( wasCookieCleaned ) {
		return;
	} //end if
	wasCookieCleaned = true;

	const { experiments } = session;
	const experimentsWithPageViews = getExperimentsWithPageViews();
	const experimentIds = experiments.map( ( e ) => e.id );
	const experimentIdsWithPageViews = Object.keys(
		experimentsWithPageViews
	).map( toExperimentId );

	const { global: g, woocommerce: w } = session.throttle;
	const now = new Date().getTime();
	const validationTimestamp = now - ( Math.max( g, w ) + 5 ) * 60000;

	const isInvalid = ( id: ExperimentId ): boolean =>
		! experimentIds.includes( id );
	const wasValidTenDaysAgo = ( id: ExperimentId ): boolean => {
		const timestamp = experimentsWithPageViews[ id ];
		return (
			!! timestamp && Math.abs( now - timestamp ) <= TEN_DAYS_IN_MILLIS
		);
	};

	const newExperimentsWithPageViews = experimentIdsWithPageViews.reduce(
		( result, id ) => {
			const timestamp = experimentsWithPageViews[ id ];

			if ( isInvalid( id ) || ! timestamp ) {
				return !! timestamp && wasValidTenDaysAgo( id )
					? { ...result, [ id ]: timestamp }
					: result;
			} //end if

			return {
				...result,
				[ id ]: Math.max( timestamp, validationTimestamp ),
			};
		},
		{} as ExpsWithViews
	);

	setExperimentsWithPageViewsCookie( newExperimentsWithPageViews );
} //end removeOldExperimentsFromCookie()

const toExperimentId = ( x: string ) =>
	( Number.parseInt( x ) || 0 ) as ExperimentId;

const getHeatmap = (
	id: ExperimentId,
	session: Session
): Maybe< HeatmapSummary > => session.heatmaps.find( ( hm ) => hm.id === id );
