/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { select, dispatch } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { first, last } from 'lodash';
import { isDefined } from '@nab/utils';
import type {
	AlternativeIndex,
	BoundingBox,
	Click,
	ClicksPerSquare,
	Dims,
	Experiment,
	HeatmapResolution,
	Maybe,
	RawHeatmapResults,
	Scroll,
	ScrollSummary,
	Url,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { store as NAB_HEATMAP } from '../../store';
import {
	HEATMAP_POINT_SIZE,
	SCROLLMAP_ROW_HEIGHT,
} from '../../../../scripts/heatmap-renderer/internal/constants';

// ============
// HELPER TYPES
// ============

type HeatmapDataInfo = {
	readonly more: boolean;
	readonly url: Maybe< Url >;
};

const MIN_HOURS_TO_ESTIMATE_PROGRESS = 10;
const STUCK_ATTEMPT_COUNT = 5;
const DELAY_IN_MS_BETWEEN_CONSECUTIVE_PULLS = 5000;

const HOUR_IN_MILLIS = 3_600_000;
const RESOLUTIONS: Record< HeatmapResolution, Dims > = {
	desktop: {
		width: 1600,
		height: 900,
	},
	tablet: {
		width: 1024,
		height: 576,
	},
	smartphone: {
		width: 460,
		height: 818,
	},
};

export async function loadResults(
	experiment: Experiment,
	alternative: AlternativeIndex
): Promise< void > {
	const status = select( NAB_HEATMAP ).getRawResultStatus( alternative ).mode;
	if ( 'missing' !== status ) {
		return;
	} //end if

	const { setRawResultStatus } = dispatch( NAB_HEATMAP );
	await setRawResultStatus( alternative, { mode: 'loading' } );

	try {
		await loadResultsInBackground(
			'clicks-and-scrolls',
			experiment,
			alternative
		);
	} catch ( e ) {
		const errorCode = getErrorCode( e );
		const clicks = select( NAB_HEATMAP ).getRawClicks( alternative );

		switch ( errorCode ) {
			case 'fetch_error':
			case 'fetch-error':
				await setRawResultStatus( alternative, {
					mode: 'error',
					rationale: 'unreachable-servers',
				} );
				return;

			case 'stuck-attempt-count':
				await setRawResultStatus(
					alternative,
					! clicks.length
						? {
								mode: 'error',
								rationale: 'stuck-empty-results',
						  }
						: {
								mode: 'ready',
								partialError: 'stuck-results',
						  }
				);
				return;

			default:
				await setRawResultStatus(
					alternative,
					! clicks.length
						? {
								mode: 'error',
								rationale: 'unknown',
						  }
						: {
								mode: 'ready',
								partialError: 'unknown',
						  }
				);
		} //end switch
	} //end try
} //end loadResults()

export async function processResults(
	alternative: AlternativeIndex,
	resolution: HeatmapResolution
): Promise< void > {
	const canRawDataBeProcessed =
		select( NAB_HEATMAP ).canRawDataBeProcessed( alternative );
	if ( ! canRawDataBeProcessed ) {
		return;
	} //end if

	const boxes = select( NAB_HEATMAP ).getBoundingBoxes(
		alternative,
		resolution
	);
	if ( ! boxes ) {
		return;
	} //end if

	const isAlreadyProcessing =
		'processing' ===
		select( NAB_HEATMAP ).getProcessedResultStatus(
			alternative,
			resolution
		);
	if ( isAlreadyProcessing ) {
		return;
	} //end if
	await dispatch( NAB_HEATMAP ).markResultsAsProcessing(
		alternative,
		resolution
	);

	const start = new Date().getTime();
	const isInitializing = ! select( NAB_HEATMAP ).hasProcessedResults(
		alternative,
		resolution
	);

	const clicks = select( NAB_HEATMAP )
		.getRawClicks( alternative )
		.filter( isClickInResolution( resolution ) )
		.map( addRealCoordinates( boxes ) )
		.filter( isDefined );

	const scrolls = select( NAB_HEATMAP )
		.getRawScrolls( alternative )
		.filter( isScrollInResolution( resolution ) );

	const clicksPerSquare = computeClicksPerSquare(
		alternative,
		resolution,
		clicks
	);

	const scrollSummary = computeScrollSummary(
		alternative,
		resolution,
		scrolls
	);

	if ( isInitializing ) {
		const ellapsedTime = new Date().getTime() - start;
		const atLeastOneSecond = Math.max( 0, 1000 - ellapsedTime );
		await new Promise< void >( ( r ) => setTimeout( r, atLeastOneSecond ) );
	} //end if

	await dispatch( NAB_HEATMAP ).setProcessedResults(
		alternative,
		resolution,
		{ clicks, scrolls, scrollSummary, clicksPerSquare }
	);
} //end processResults()

// =======
// HELPERS
// =======

const isClickInResolution = ( resolution: HeatmapResolution ) => {
	const { min, max } = getMinMaxWidthInResolution( resolution );
	return ( { windowWidthInPx: w }: Click ): boolean => min <= w && w <= max;
};

const isScrollInResolution = ( resolution: HeatmapResolution ) => {
	const { min, max } = getMinMaxWidthInResolution( resolution );
	return ( { windowWidth: w }: Scroll ): boolean => min <= w && w <= max;
};

type Selector = string;
const addRealCoordinates =
	( boxes: Record< Selector, BoundingBox > ) =>
	( click: Click ): Maybe< Click > => {
		const { x, y } = click;
		const box = boxes[ click.xpath || click.cssPath ];
		if ( ! box ) {
			return undefined;
		} //end if

		return {
			...click,
			realCoordinates: {
				...click.realCoordinates,
				x: box.left + x * box.width,
				y: box.top + y * box.height,
			},
		};
	};

async function loadResultsInBackground(
	kind: 'clicks' | 'scrolls' | 'clicks-and-scrolls' | 'none',
	experiment: Experiment,
	alternative: AlternativeIndex
): Promise< void > {
	if ( 'none' === kind ) {
		return;
	} //end if

	if ( experiment.id === 0 ) {
		await dispatch( NAB_HEATMAP ).setRawResultStatus( alternative, {
			mode: 'ready',
		} );
		return;
	} //end if

	const loadClicks = kind.includes( 'clicks' );
	const loadScrolls = kind.includes( 'scrolls' );
	const [ newClicks, newScrolls ] = await Promise.all( [
		loadClicks && doLoadResults( 'clicks', experiment, alternative ),
		loadScrolls && doLoadResults( 'scrolls', experiment, alternative ),
	] );

	await dispatch( NAB_HEATMAP ).updateLoadAttempts(
		alternative,
		newClicks ? newClicks : undefined,
		newScrolls ? newScrolls : undefined
	);

	const prevClicks = select( NAB_HEATMAP ).getRawClicks( alternative );
	const prevScrolls = select( NAB_HEATMAP ).getRawScrolls( alternative );

	const results = {
		clicks:
			newClicks && newClicks.data.length !== prevClicks.length
				? beautifyClicks( newClicks.data )
				: prevClicks,
		scrolls:
			newScrolls && newScrolls.data.length !== prevScrolls.length
				? newScrolls.data
				: prevScrolls,
	};

	const loadAttempts = select( NAB_HEATMAP ).getLoadAttempts( alternative );
	if (
		loadAttempts.clicks.count >= STUCK_ATTEMPT_COUNT ||
		loadAttempts.scrolls.count >= STUCK_ATTEMPT_COUNT
	) {
		throw new Error( 'stuck-attempt-count' );
	} //end if

	const areClicksReady = ! newClicks || ! newClicks.more;
	const areScrollsReady = ! newScrolls || ! newScrolls.more;
	const isAllDataReady = areClicksReady && areScrollsReady;
	const getStatusMode = () => {
		if ( isAllDataReady ) {
			return 'ready' as const;
		} //end if
		return ! results.clicks.length
			? ( 'loading' as const )
			: ( 'still-loading' as const );
	};

	await dispatch( NAB_HEATMAP ).receiveRawResults( alternative, {
		results,
		status: { mode: getStatusMode() },
		progress: isAllDataReady
			? 100
			: getProgressEstimate( experiment, alternative, results.clicks ),
	} );

	return new Promise( ( resolve, reject ) => {
		const next = () => {
			if ( ! areClicksReady && ! areScrollsReady ) {
				return 'clicks-and-scrolls';
			} else if ( ! areClicksReady ) {
				return 'clicks';
			} else if ( ! areScrollsReady ) {
				return 'scrolls';
			} //end if
			return 'none';
		};
		setTimeout( () => {
			loadResultsInBackground( next(), experiment, alternative )
				.then( resolve )
				.catch( reject );
		}, DELAY_IN_MS_BETWEEN_CONSECUTIVE_PULLS );
	} );
} //end loadResultsInBackground()

async function doLoadResults(
	kind: 'clicks',
	experiment: Experiment,
	alternative: AlternativeIndex
): Promise< RawHeatmapResults< Click > >;
async function doLoadResults(
	kind: 'scrolls',
	experiment: Experiment,
	alternative: AlternativeIndex
): Promise< RawHeatmapResults< Scroll > >;
async function doLoadResults(
	kind: 'clicks' | 'scrolls',
	experiment: Experiment,
	alternative: AlternativeIndex
): Promise< RawHeatmapResults >;
async function doLoadResults(
	kind: 'clicks' | 'scrolls',
	experiment: Experiment,
	alternative: AlternativeIndex
): Promise< RawHeatmapResults > {
	const path = sprintf(
		'/nab/v1/experiment/%1$s/heatmap/%2$s/%3$d',
		experiment.id,
		kind,
		alternative
	);
	const info = await apiFetch< HeatmapDataInfo >( { path } );

	if ( ! info.url ) {
		return { more: info.more, data: [] };
	} //end if

	const response = await fetch( info.url );
	const jsonl = await response.text();
	const lines = jsonl.replaceAll( '}{', '}\n{' ).split( '\n' );

	const items = Array.from( new Set( lines ) )
		.filter( ( x ) => !! x )
		.map( toJSON )
		.filter( ( x ): x is Click | Scroll => !! x );

	return { more: info.more, data: items };
} //end doLoadResults()

function beautifyClicks(
	clicks: ReadonlyArray< Click >
): ReadonlyArray< Click > {
	const UNKNOWN = _x( 'Unknown', 'text', 'nelio-ab-testing' );
	return clicks.map( ( click ) => ( {
		...click,
		browser: click.browser || UNKNOWN,
		country: click.country || UNKNOWN,
		dayOfWeek: getDayOfWeekCategory( click.dayOfWeek ),
		device: click.device || UNKNOWN,
		hourOfDay: getHourOfDayCategory( click.hourOfDay ),
		intensity: click.intensity || 1,
		os: click.os || UNKNOWN,
		timeToClick: getTimeToClickCategory( click.timeToClick ),
		windowWidth: getWindowWidthCategory( click.windowWidth ),
		windowWidthInPx:
			'number' === typeof click.windowWidth
				? click.windowWidth
				: Number.parseInt( click.windowWidth ) || 0,
		realCoordinates: { x: -1, y: -1 },
	} ) );
} //end beautifyClicks()

function getProgressEstimate(
	experiment: Experiment,
	alternative: AlternativeIndex,
	clicks: ReadonlyArray< Click >
): number {
	const now = new Date().toISOString();
	const totalHoursRunning = getHours(
		experiment.startDate,
		'finished' === experiment.status ? experiment.endDate || now : now
	);
	if ( totalHoursRunning < MIN_HOURS_TO_ESTIMATE_PROGRESS ) {
		return 100;
	} //end if

	const firstClick = first( clicks );
	const lastClick = last( clicks );
	if ( ! firstClick?.timestamp || ! lastClick?.timestamp ) {
		return 0;
	} //end if

	const clickHours = getHours( firstClick.timestamp, lastClick.timestamp );
	const actualProgress = ( 100 * clickHours ) / totalHoursRunning;
	const progress = Math.max( 1, Math.floor( actualProgress ) );

	const prevProgress =
		select( NAB_HEATMAP ).getRawResultProgress( alternative );
	return Math.max( progress, prevProgress );
} //end getProgressEstimate()

function getHourOfDayCategory( hourOfDay: string | number ): string {
	if ( 'string' === typeof hourOfDay ) {
		hourOfDay = Number.parseInt( hourOfDay );
		if ( isNaN( hourOfDay ) ) {
			hourOfDay = 0;
		} //end if
	} //end if
	return `${ Math.floor( hourOfDay / 2 ) }`;
} //end getHourOfDayCategory()

function getDayOfWeekCategory( dayOfWeek: string | number ): string {
	return `${ dayOfWeek }`;
} //end getDayOfWeekCategory()

function getTimeToClickCategory( timeToClick: string | number ): string {
	if ( 'string' === typeof timeToClick ) {
		timeToClick = Number.parseInt( timeToClick );
	} //end if

	const cuts = [ 2, 3, 4, 5, 10, 15, 20, 25, 30, 60, 120, 180, 300 ] as const;
	for ( let i = 0; i < cuts.length; ++i ) {
		const cut = cuts[ i ];
		if ( cut && timeToClick <= cut ) {
			return `${ i }`;
		} //end if
	} //end for

	return `${ cuts.length }`;
} //end getTimeToClickCategory()

function getWindowWidthCategory( windowWidth: string | number ): string {
	if ( 'string' === typeof windowWidth ) {
		windowWidth = Number.parseInt( windowWidth );
	} //end if

	const cuts = [ 300, 600, 900, 1200, 1500, 1800, 2100 ];
	for ( let i = 0; i < cuts.length; ++i ) {
		const cut = cuts[ i ];
		if ( cut && windowWidth < cut ) {
			return `${ i }`;
		} //end if
	} //end for

	return `${ cuts.length }`;
} //end getWindowWidthCategory()

function toJSON< T = unknown >( x: string ): T | false {
	try {
		return JSON.parse( x ) as T;
	} catch ( _ ) {
		return false;
	} //end try
} //end toJSON()

function getErrorCode( e: unknown ): string {
	if ( !! e && 'object' === typeof e ) {
		if ( 'code' in e && 'string' === typeof e.code && !! e.code ) {
			return e.code;
		} //end if
		if ( 'message' in e && 'string' === typeof e.message && !! e.message ) {
			return e.message;
		} //end if
	} //end if;

	if ( 'string' === typeof e ) {
		return e;
	} //end if;

	return 'unknown';
} //end getErrorCode()

const getHours = ( d1: string, d2: string ): number =>
	Math.ceil(
		Math.abs( new Date( d1 ).getTime() - new Date( d2 ).getTime() ) /
			HOUR_IN_MILLIS
	);

function getMinMaxWidthInResolution( resolution: HeatmapResolution ): {
	readonly min: number;
	readonly max: number;
} {
	const expectedWidth = RESOLUTIONS[ resolution ].width;
	const cuts = Object.values( RESOLUTIONS ).map( ( { width } ) => width );

	const minWidth = cuts.reduce(
		( memo, width ) =>
			width < expectedWidth ? Math.max( width, memo ) : memo,
		-1
	);

	let maxWidth = cuts.reduce(
		( memo, width ) =>
			expectedWidth < width ? Math.min( width, memo ) : memo,
		Number.POSITIVE_INFINITY
	);
	if ( Number.POSITIVE_INFINITY !== maxWidth ) {
		maxWidth = expectedWidth;
	} //end if

	return { min: minWidth + 1, max: maxWidth };
} //end getMinMaxWidthInResolution()

function computeClicksPerSquare(
	alternative: AlternativeIndex,
	resolution: HeatmapResolution,
	clicks: ReadonlyArray< Click >
): ClicksPerSquare {
	const dimensions = select( NAB_HEATMAP ).getPageDimensions(
		alternative,
		resolution
	);

	if ( ! dimensions ) {
		return {
			columns: 1,
			value: [ clicks.length ],
			max: clicks.length,
			rows: 1,
		};
	} //end if

	const { width, bodyHeight: height } = dimensions;
	const NUM_OF_COLS = Math.ceil( width / HEATMAP_POINT_SIZE );
	const NUM_OF_ROWS = Math.ceil( height / HEATMAP_POINT_SIZE );

	const data = new Array( NUM_OF_ROWS * NUM_OF_COLS )
		.fill( 0 )
		.map( () => 0 );
	clicks.forEach( ( click ) => {
		const { x, y } = click.realCoordinates;
		const col = Math.floor( x / HEATMAP_POINT_SIZE );
		const row = Math.floor( y / HEATMAP_POINT_SIZE );

		const index = row * NUM_OF_COLS + col;
		if ( index < 0 && data.length <= index ) {
			return;
		} //end if
		data[ index ] = ( data[ index ] || 0 ) + click.intensity;
	} );

	return {
		columns: NUM_OF_COLS,
		value: data,
		max: Math.max(
			1,
			data.reduce( ( max, value ) => Math.max( max, value || 0 ) )
		),
		rows: NUM_OF_ROWS,
	};
} //end computeClicksPerSquare()

function computeScrollSummary(
	alternative: AlternativeIndex,
	resolution: HeatmapResolution,
	scrolls: ReadonlyArray< Scroll >
): ScrollSummary {
	const page = select( NAB_HEATMAP ).getPageDimensions(
		alternative,
		resolution
	);
	if ( ! page ) {
		return {
			rows: [ 0 ],
			maxHits: 0,
			averageFold: 250,
		};
	} //end if

	const { bodyHeight, iframeHeight } = page;
	const numOfRows = Math.ceil( iframeHeight / SCROLLMAP_ROW_HEIGHT );
	const rows = new Array( numOfRows ).fill( 0 ) as number[];

	let heightFromTop = 0;
	scrolls.forEach(
		( { firstFold, maxScroll, sweetSpot, documentHeight } ) => {
			// Accumulate first fold heights.
			heightFromTop += firstFold;

			maxScroll = Math.round(
				( maxScroll / documentHeight ) * bodyHeight
			);
			sweetSpot = Math.round(
				( sweetSpot / documentHeight ) * bodyHeight
			);

			const maxScrollRow = Math.ceil( maxScroll / SCROLLMAP_ROW_HEIGHT );

			// Add max scrolling relevance.
			const lastScrollRow = Math.min( maxScrollRow, numOfRows - 1 );
			for ( let i = 0; i <= lastScrollRow; ++i ) {
				rows[ i ] = 1 + ( rows[ i ] ?? 0 );
			} //end for

			// Add sweetspot relevance.
			const sweetSpotMinRow = Math.floor(
				( sweetSpot - firstFold / 2 ) / SCROLLMAP_ROW_HEIGHT
			);
			const sweetSpotMaxRow = Math.ceil(
				( sweetSpot + firstFold / 2 ) / SCROLLMAP_ROW_HEIGHT
			);
			const lastSweetSpotRow = Math.min( sweetSpotMaxRow, numOfRows - 1 );
			for (
				let i = Math.max( 0, sweetSpotMinRow );
				i <= lastSweetSpotRow;
				++i
			) {
				rows[ i ] = 1 + ( rows[ i ] ?? 0 );
			} //end for
		}
	);

	return {
		rows,
		maxHits: rows.reduce( ( m, i ) => ( m > i ? m : i ), 0 ),
		averageFold: !! scrolls.length
			? Math.ceil( heightFromTop / scrolls.length )
			: false,
	};
} //end computeScrollSummary()
