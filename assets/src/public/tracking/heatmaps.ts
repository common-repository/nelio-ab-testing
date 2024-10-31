/**
 * External dependencies
 */
import type { ClickEvent, Maybe, ScrollEvent } from '@nab/types';

/**
 * Internal dependencies
 */
import { xPath } from './xpath';
import { track } from './sync';
import type { Session } from '../types';

import { domReady, getDocumentHeight } from '../utils/helpers';

const ROW_HEIGHT_FOR_SHOW_TIME_TRACKING = 50;
const SHOW_TIME_UPDATE_INTERVAL_IN_MS = 500;
const SHOW_TIME_UPDATE_MAX_DURATION_IN_MS = 2 * 60 * 1000; // 2 minutes

export function initHeatmapTracking( session: Session ): void {
	domReady( () => doInitHeatmapTracking( session ) );
} //end initHeatmapTracking()

// =======
// HELPERS
// =======

function doInitHeatmapTracking( session: Session ) {
	const experiments = [
		...session.experiments.filter( ( e ) => e.active && e.heatmapTracking ),
		...session.heatmaps,
	];
	if ( ! experiments.length ) {
		return;
	} //end if

	const startTime = new Date().getTime();
	const trackClick = ( ev: MouseEvent ) => {
		if ( ev.button !== 0 && ev.button !== 1 ) {
			return;
		} //end if

		const event = createClickEventWithoutExperimentInfo(
			ev,
			startTime,
			session
		);

		if ( ! event ) {
			return;
		} //end if

		const events = experiments.map( ( e ) => ( {
			experiment: e.id,
			alternative: 'alternative' in e ? e.alternative : 0,
			...event,
		} ) );
		track( events, session );
	};
	document.addEventListener( 'click', trackClick );
	document.addEventListener( 'auxclick', trackClick );

	let maxScroll = window.scrollY + window.innerHeight;
	document.addEventListener( 'scroll', () => {
		const bottom = window.scrollY + window.innerHeight;
		if ( bottom > maxScroll ) {
			maxScroll = bottom;
		} //end if
	} );

	const showTimes = new Array(
		Math.ceil( getDocumentHeight() / ROW_HEIGHT_FOR_SHOW_TIME_TRACKING )
	).fill( 0 ) as number[];
	let numOfShowTimeUpdates = 0;
	const maxNumOfShowTimeUpdates = Math.ceil(
		SHOW_TIME_UPDATE_MAX_DURATION_IN_MS / SHOW_TIME_UPDATE_INTERVAL_IN_MS
	);
	function updateShowTimes() {
		const top = window.scrollY;
		const bottom = top + window.innerHeight;

		const firstVisibleRow = Math.ceil(
			top / ROW_HEIGHT_FOR_SHOW_TIME_TRACKING
		);
		const lastVisibleRow = Math.min(
			Math.floor( bottom / ROW_HEIGHT_FOR_SHOW_TIME_TRACKING ),
			showTimes.length
		);

		for ( let row = firstVisibleRow; row <= lastVisibleRow; ++row ) {
			showTimes[ row ] = ( showTimes[ row ] ?? 0 ) + 1;
		} //end for

		++numOfShowTimeUpdates;
		if ( numOfShowTimeUpdates < maxNumOfShowTimeUpdates ) {
			setTimeout( updateShowTimes, SHOW_TIME_UPDATE_INTERVAL_IN_MS );
		} //end if
	} //end updateShowTimes()
	setTimeout( updateShowTimes, SHOW_TIME_UPDATE_INTERVAL_IN_MS );

	window.addEventListener( 'beforeunload', () => {
		const event: Omit< ScrollEvent, 'experiment' | 'alternative' > = {
			...createPartialScrollEvent(),
			sweetSpot: findSweetSpot( showTimes ),
			maxScroll,
		};
		const events = experiments.map(
			( e ): ScrollEvent => ( {
				experiment: e.id,
				alternative: 'alternative' in e ? e.alternative : 0,
				...event,
			} )
		);

		if ( ! events.length ) {
			return;
		} //end if
		track( events, session );
	} );
} //end doInitHeatmapTracking()

function createClickEventWithoutExperimentInfo(
	ev: MouseEvent,
	start: number,
	session: Session
): Maybe< Omit< ClickEvent, 'experiment' | 'alternative' > > {
	const target = ev.target as HTMLElement | null;
	if ( ! target ) {
		return;
	} //end if

	const rect = target.getBoundingClientRect();
	if ( ! rect || ! rect.width || ! rect.height ) {
		return;
	} //end if

	const x = ( ev.clientX - rect.left ) / rect.width;
	const y = ( ev.clientY - rect.top ) / rect.height;

	return {
		kind: 'click',
		timeToClick: Math.round( ( new Date().getTime() - start ) / 1000 ),
		windowWidth: document.body.offsetWidth || 0,
		xpath: xPath( target, session.optimizeXPath ),
		x,
		y,
	};
} //end createClickEventWithoutExperimentInfo()

function createPartialScrollEvent(): Omit<
	ScrollEvent,
	'experiment' | 'alternative' | 'maxScroll' | 'sweetSpot'
> {
	return {
		kind: 'scroll',
		windowWidth: document.body.offsetWidth || 0,
		firstFold: window.innerHeight,
		documentHeight: getDocumentHeight(),
	};
} //end createPartialScrollEvent()

function findSweetSpot( showTimes: ReadonlyArray< number > ) {
	const collapsedShowTimes = collapseShowTimes( showTimes );

	const sweetSpotValue = collapsedShowTimes.reduce(
		( maxValue, { value } ) => Math.max( maxValue, value ),
		0
	);
	const sweetSpots = collapsedShowTimes.filter(
		( { value } ) => value === sweetSpotValue
	);

	const maxSweetSpotAreaSize = sweetSpots.reduce(
		( maxSize, { size } ) => Math.max( size, maxSize ),
		0
	);
	const largestSweetSpots = sweetSpots.filter(
		( { size } ) => size === maxSweetSpotAreaSize
	);

	const sweetSpot = pickRandom( largestSweetSpots );
	if ( ! sweetSpot ) {
		return 0;
	} //end if

	return (
		ROW_HEIGHT_FOR_SHOW_TIME_TRACKING *
		( sweetSpot.start + Math.floor( sweetSpot.size / 2 ) )
	);
} //end findSweetSpot()

function collapseShowTimes( showTimes: ReadonlyArray< number > ) {
	type ScrollRowCount = {
		start: number;
		value: number;
		size: number;
	};

	return showTimes.reduce( ( result, value, index ) => {
		const last = result[ result.length - 1 ];

		if ( last?.value === value ) {
			++last.size;
		} else {
			result.push( { start: index, value, size: 1 } );
		} //end if

		return result;
	}, [] as ScrollRowCount[] );
} //end collapseShowTimes()

function pickRandom< T >( list: ReadonlyArray< T > ): Maybe< T > {
	const index = Math.round( Math.random() * ( list.length - 1 ) );
	return list[ index ];
} //end pickRandom()
