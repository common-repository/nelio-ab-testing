/**
 * External dependencies
 */
import md5 from 'md5';
import type { ExperimentId, Maybe } from '@nab/types';

/**
 * Internal dependencies
 */
import { log } from './log';
import { canVisitorParticipate } from './internal/can-visitor-participate';
import { getSettings } from './internal/get-settings';

import { getCookie, removeCookie, setCookie } from '../cookies';
import {
	updateSegmentationSettings,
	getAllActiveSegments,
} from '../segmentation';
import { getQueryArg, removeTestingArgs } from '../url';
import {
	getExperimentsWithPageViews,
	getUniqueViews as doGetUniqueViews,
} from '../tracking';
import type { AlternativeIndex, Session, Settings } from '../../types';
import type { Uuid } from 'uuid';

export const getSession = async (): Promise< Maybe< Session > > => {
	const settings = getSettings();
	if ( ! canVisitorParticipate( settings ) ) {
		return;
	} //end if

	await updateSegmentationSettings( settings );
	const alternative = updateAlternativeCookie( settings );
	if ( 'none' === alternative ) {
		log( 'No alternative assigned' );
		return;
	} //end if

	const session = {
		...settings,
		alternative,
		currentUrl: window.location.href,
		isStagingSite: settings.isStagingSite || isStagingSimulated(),
		experiments: settings.experiments.map( ( e ) => ( {
			...e,
			alternative: alternative % e.alternatives.length,
		} ) ),
		untestedUrl: removeTestingArgs( window.location.href ),
	};
	await updateECommerceSession( session );

	return session;
};

// =======
// HELPERS
// =======

function isStagingSimulated() {
	if ( undefined !== getQueryArg( window.location.href, 'nabstaging' ) ) {
		setCookie( 'nabSimulateStaging', 'true' );
	} //end if
	return 'true' === getCookie( 'nabSimulateStaging' );
} //end isStagingSimulated()

const updateAlternativeCookie = ( settings: Settings ) => {
	const { maxCombinations } = settings;
	let alternative = getAlternativeFromCookie( settings );

	if ( false === alternative ) {
		alternative =
			random( 100 ) <= settings.participationChance
				? random( maxCombinations - 1 )
				: 'none';
		resetCookies( alternative );
	} //end if

	const newAlternative = shouldAlternativeBeOverwritten(
		settings,
		alternative
	);
	if ( false !== newAlternative ) {
		alternative = newAlternative % settings.maxCombinations;
		resetCookies( alternative );
	} //end if

	resetCookieExpirations();
	return alternative;
};

function getAlternativeFromCookie(
	settings: Settings
): false | number | 'none' {
	const nabAlt = getCookie( 'nabAlternative' ) ?? '';
	if ( 'none' === nabAlt ) {
		return 'none';
	} //end if

	const value = Number.parseInt( nabAlt );
	if ( isNaN( value ) ) {
		return false;
	} //end if

	if ( value < 0 ) {
		return false;
	} //end if

	if ( value >= settings.maxCombinations ) {
		return false;
	} //end if

	return value;
} //end getAlternativeFromCookie()

const updateECommerceSession = async ( session: Session ) => {
	if ( ! session.ajaxUrl ) {
		return;
	} //end if

	const oldChecksum = getCookie( 'nabSessionChecksum' );
	const checksum = getSessionChecksum( session.alternative );
	if ( ! session.forceECommerceSessionSync && oldChecksum === checksum ) {
		return;
	} //end if

	try {
		const body = new FormData();
		body.append( 'action', 'nab_sync_ecommerce_session' );
		body.append( 'alternative', `${ session.alternative }` );
		body.append(
			'expsWithView',
			JSON.stringify( getViewedAlternatives( session ) )
		);
		body.append( 'expSegments', JSON.stringify( getSegments( session ) ) );
		body.append(
			'uniqueViews',
			JSON.stringify( getUniqueViews( session ) )
		);

		await fetch( session.ajaxUrl, {
			method: 'POST',
			credentials: 'same-origin',
			body,
		} );
	} catch ( _ ) {}

	setCookie( 'nabSessionChecksum', checksum );
};

const random = ( max: number ) =>
	Math.min( Math.floor( Math.random() * ( max + 1 ) ), max );

const getViewedAlternatives = (
	session: Session
): Partial< Record< ExperimentId, AlternativeIndex > > =>
	Object.keys( getExperimentsWithPageViews() ).reduce(
		( res, key ) => {
			const id = ( Number.parseInt( key ) || 0 ) as ExperimentId;
			const exp = session.experiments.find( ( e ) => e.id === id );
			if ( exp ) {
				res[ id ] = exp.alternative;
			} //end if
			return res;
		},
		{} as Partial< Record< ExperimentId, AlternativeIndex > >
	);

const getSegments = (
	session: Session
): Partial< Record< ExperimentId, ReadonlyArray< number > > > => {
	const allSegments = getAllActiveSegments();
	return Object.keys( allSegments ).reduce(
		( res, key ) => {
			const id = ( Number.parseInt( key ) || 0 ) as ExperimentId;
			const exp = session.experiments.find( ( e ) => e.id === id );
			if ( exp ) {
				res[ id ] = allSegments[ id ] ?? [ 0 ];
			} //end if
			return res;
		},
		{} as Partial< Record< ExperimentId, ReadonlyArray< number > > >
	);
};

const getUniqueViews = (
	session: Session
): Partial< Record< ExperimentId, Uuid > > => {
	const uniqueViews = doGetUniqueViews();
	return session.experiments.reduce(
		( res, experiment ) => {
			const id = experiment.id;
			const viewUuid = uniqueViews[ id ];
			if ( viewUuid ) {
				res[ id ] = viewUuid;
			} //end if
			return res;
		},
		{} as Record< ExperimentId, Uuid >
	);
};

const getSessionChecksum = ( alternative: number ): string => {
	const epv = getExperimentsWithPageViews();
	const expIds = Object.keys( epv ).sort();
	const tenMinutesTimestamp =
		new Date( Object.values( epv ).sort().reverse()[ 0 ] || 0 )
			.toISOString()
			.substring( 0, 15 ) + '0';
	return md5( [ alternative, ...expIds, tenMinutesTimestamp ].join( ':' ) );
};

function shouldAlternativeBeOverwritten(
	settings: Settings,
	assignedAlternative: 'none' | number
): number | false {
	const search = document.location.search;
	const queryAlternative =
		/\bnab\b=[0-9]+/.test( search ) && /\bnabforce\b/.test( search )
			? Number.parseInt(
					search.replace( /^.*\bnab\b=([0-9]+).*$/, '$1' )
			  ) || 0
			: false;

	if ( false !== queryAlternative ) {
		return assignedAlternative !== queryAlternative
			? queryAlternative
			: false;
	} //end if

	const cookieAlternative = settings.cookieTesting;
	if ( false !== cookieAlternative ) {
		return assignedAlternative !== cookieAlternative
			? cookieAlternative
			: false;
	} //end if

	return false;
} //end shouldAlternativeBeOverwritten()

function resetCookies( alternative: number | 'none' ): void {
	setCookie( 'nabAlternative', alternative, { expires: 120 } );
	removeCookie( 'nabExperimentsWithPageViews' );
	removeCookie( 'nabUniqueViews' );
} //end resetCookies()

function resetCookieExpirations(): void {
	(
		[
			'nabAlternative',
			'nabExperimentsWithPageViews',
			'nabUniqueViews',
		] as const
	 )
		.map( ( n ) => [ n, getCookie( n ) ?? '' ] as const )
		.filter( ( [ _, v ] ) => !! v )
		.forEach( ( [ n, v ] ) => setCookie( n, v, { expires: 120 } ) );
} //end resetCookieExpirations()
