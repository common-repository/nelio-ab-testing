/**
 * External dependencies
 */
import { v4 as uuid } from 'uuid';
import type {
	ConversionEvent,
	ExperimentId,
	Maybe,
	TrackEvent,
	UniqueConversionEvent,
	UniqueVisitEvent,
	VisitEvent,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { getApiUrl } from '../utils/helpers';
import { getActiveSegments } from '../utils/segmentation';
import {
	canSynchEvent,
	getUniqueViews,
	updateExperimentsWithPageViews,
	updateUniqueViews,
} from '../utils/tracking';

import type {
	ConvertingGoal,
	GoalIndex,
	HeatmapSummary,
	Session,
} from '../types';

export function sendViews(
	expIds: ExperimentId | ReadonlyArray< ExperimentId >,
	session: Session
): void {
	const events = ( isArray( expIds ) ? expIds : [ expIds ] )
		.map( ( id ) => generatePageViewEvent( id, session ) )
		.filter( isVisitEvent );

	track( events, session );
} //end trackPageViews()

export function sendConversions(
	convGoals: ConvertingGoal | ReadonlyArray< ConvertingGoal >,
	session: Session
): void {
	const { experiments } = session;
	const isConvEvent = ( e?: ConversionEvent ): e is ConversionEvent => !! e;
	const events = ( isArray( convGoals ) ? convGoals : [ convGoals ] )
		.map( ( { experiment, goal } ) =>
			generateConversionEvent( experiment, goal, experiments )
		)
		.filter( isConvEvent );

	track( events, session );
} //end sendConversions()

export function track(
	events: ReadonlyArray< TrackEvent >,
	session: Session
): void {
	events = events.filter( ( ev ) => canSynchEvent( ev, session ) );
	updateExperimentsWithPageViews( events.filter( isVisitEvent ), session );
	events = events.flatMap( addUniqueEvents );
	updateUniqueViews( events.filter( isUniqueVisitEvent ) );
	if ( ! events.length ) {
		return;
	} //end if

	if ( session.isStagingSite ) {
		events.forEach( ( event ) => console.info( '[Staging] Event', event ) ); // eslint-disable-line
		return;
	} //end if

	const { api, site, timezone } = session;
	const timestamp = new Date().toISOString();
	events = events.map( ( event ) => ( {
		id: uuid(),
		...event,
		timezone,
		timestamp,
	} ) );

	events.forEach( ( event ) =>
		window.postMessage( {
			plugin: 'nelio-ab-testing',
			type: 'testing-event',
			value: event,
		} )
	);

	const url = getApiUrl( api, `/site/${ site }/event`, {
		e: window.btoa( JSON.stringify( events ) ),
		a: site,
	} );

	/* eslint-disable */
	const beaconSent =
		!! session.useSendBeacon &&
		'function' === typeof window.navigator.sendBeacon &&
		!! window.Blob &&
		window.navigator.sendBeacon(
			url,
			new Blob( [], { 'Content-Type': 'text/plain' } as any )
		);
	/* eslint-enable */

	if ( ! beaconSent ) {
		const image = document.createElement( 'img' );
		image.setAttribute( 'src', url );
	} //end if
} //end track()

// =======
// HELPERS
// =======

const isArray = < T >( a: T | ReadonlyArray< T > ): a is ReadonlyArray< T > =>
	Array.isArray( a );

function generatePageViewEvent(
	experimentId: ExperimentId,
	session: Session
): Maybe< VisitEvent > {
	const { experiments, heatmaps } = session;

	const experiment = experiments.find( ( e ) => e.id === experimentId );
	if ( ! experiment ) {
		return maybeGeneratePageViewEventForHeatmap( experimentId, heatmaps );
	} //end if

	const segments = getActiveSegments( experiment );
	if ( ! segments.length ) {
		return;
	} //end if

	const type = getVisitType( experimentId, session.experiments );
	if ( ! type ) {
		return;
	} //end if

	const alternative = experiment.alternative;

	return {
		kind: 'visit',
		experiment: experimentId,
		type,
		alternative,
		segments,
	};
} //end generatePageViewEvent()

function getVisitType(
	experimentId: ExperimentId,
	experiments: Session[ 'experiments' ]
): Maybe< VisitEvent[ 'type' ] > {
	const experiment = experiments.find( ( e ) => e.id === experimentId );
	if ( ! experiment ) {
		return;
	} //end if

	switch ( experiment.type ) {
		case 'nab/wc-bulk-sale':
		case 'nab/wc-product':
			return 'woocommerce';

		case 'nab/css':
		case 'nab/headline':
		case 'nab/menu':
		case 'nab/template':
		case 'nab/theme':
		case 'nab/widget':
			return 'global';

		default:
			return 'regular';
	} //end switch
} //end getVisitType()

function maybeGeneratePageViewEventForHeatmap(
	experimentId: ExperimentId,
	heatmaps: ReadonlyArray< HeatmapSummary >
): Maybe< VisitEvent > {
	const ids = heatmaps.map( ( { id } ) => id );
	if ( ! ids.includes( experimentId ) ) {
		return;
	} //end if

	return {
		kind: 'visit',
		experiment: experimentId,
		type: 'regular',
		alternative: 0,
		segments: [],
	};
} //end maybeGeneratePageViewEventForHeatmap()

function generateConversionEvent(
	experimentId: ExperimentId,
	goalIndex: GoalIndex,
	experiments: Session[ 'experiments' ]
): Maybe< ConversionEvent > {
	const experiment = experiments.find( ( e ) => e.id === experimentId );
	if ( ! experiment ) {
		return;
	} //end if

	if ( experiment.goals.length <= goalIndex ) {
		return;
	} //end if

	const segments = getActiveSegments( experiment );
	if ( ! segments.length ) {
		return;
	} //end if

	const alternative = experiment.alternative;
	return {
		kind: 'conversion',
		experiment: experimentId,
		alternative,
		goal: goalIndex,
		segments,
	};
} //end generateConversionEvent()

function isVisitEvent( e?: TrackEvent ): e is VisitEvent {
	return !! e && e.kind === 'visit';
} //end isVisitEvent()

function isUniqueVisitEvent( e?: TrackEvent ): e is UniqueVisitEvent {
	return !! e && e.kind === 'uvisit';
} //end isUniqueVisitEvent()

function addUniqueEvents(
	event: TrackEvent
): [ TrackEvent ] | [ TrackEvent, TrackEvent ] {
	if ( event.kind === 'visit' ) {
		return maybeAddUniqueViewEvent( event );
	} //end if

	if ( event.kind === 'conversion' ) {
		return maybeAddUniqueConversionEvent( event );
	} //end if

	return [ event ];
} //end addUniqueEvents()

function maybeAddUniqueViewEvent(
	visit: VisitEvent
): [ VisitEvent ] | [ VisitEvent, UniqueVisitEvent ] {
	const uniqueViews = getUniqueViews();
	return uniqueViews[ visit.experiment ]
		? [ visit ]
		: [ visit, { ...visit, kind: 'uvisit', id: uuid() } ];
} //end maybeAddUniqueViewEvent()

function maybeAddUniqueConversionEvent(
	conversion: ConversionEvent
): [ ConversionEvent ] | [ ConversionEvent, UniqueConversionEvent ] {
	const uniqueViews = getUniqueViews();
	const uniqueViewId = uniqueViews[ conversion.experiment ];
	return ! uniqueViewId
		? [ conversion ]
		: [
				conversion,
				{
					...conversion,
					kind: 'uconversion',
					id: `${ uniqueViewId }-${ conversion.goal }`,
				},
		  ];
} //end maybeAddUniqueConversionEvent()

// TODO. “canMonitorEvents” is deprecated. Remove eventually.
/* eslint-disable */
const canMonitorEvents = (
	win: unknown
): win is {
	nabMonitorTrackingEvents: ( events: ReadonlyArray< TrackEvent > ) => void;
} => !! win && typeof win === 'object' && 'nabMonitorTrackingEvents' in win;
window.addEventListener( 'message', ( ev ) => {
	if (
		ev.data?.plugin !== 'nelio-ab-testing' ||
		ev.data?.type !== 'testing-event' ||
		! ev.data?.value
	) {
		return;
	} //end if
	if ( canMonitorEvents( window ) ) {
		console.groupCollapsed( 'Deprecation Warning!' );
		console.log(
			'Nelio A/B Testing deprecated “nabMonitorTrackingEvents”.'
		);
		console.log(
			"Use “window.addEventListener( 'message', callback )” instead and check if the callback’s “event.plugin” and “event.type” are “nelio-ab-testing” and “testing-event” respectively."
		);
		console.groupEnd();
		window.nabMonitorTrackingEvents( [ ev.data.value ] );
	} //end if
} );
/* eslint-enable */
