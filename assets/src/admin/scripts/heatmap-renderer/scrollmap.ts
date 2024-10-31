/**
 * External dependencies
 */
import throttle from 'lodash/throttle';
import * as StackBlur from 'stackblur-canvas';
import type { Dict, HeatmapFrameAction } from '@nab/types';

/**
 * Internal dependencies
 */
import {
	SCROLLMAP_COLORS,
	SCROLLMAP_ROW_HEIGHT,
	STATS_REFRESH_DELAY,
} from './internal/constants';
import {
	areRawResults,
	getIFrameLabels,
	getOpacity,
	getScrollSummary,
	processResults,
} from './internal/store';
import { createOverlayElement, maximizeElement } from './internal/utils';

const scrollmap: Partial< {
	averageFold: HTMLElement;
	canvas: HTMLCanvasElement;
	image: HTMLCanvasElement;
	stats: HTMLElement;
	statsTracker: HTMLElement;
} > = {};

export function reactToParentMessages( action: HeatmapFrameAction ): true {
	if ( 'scrollmap' !== action.mode ) {
		removeScrollmapFromBody();
		return true;
	} //end if

	if ( ! areRawResults( [ 'still-loading', 'canceling', 'ready' ] ) ) {
		return true;
	} //end if

	switch ( action.type ) {
		case 'process-results':
			processResults();
			return true;

		case 'render-results':
			renderResults();
			return true;

		case 'update-opacity':
			setOverlayOpacity( action.value );
			return true;
	} //end if
} //end reactToParentMessages()

// =======
// HELPERS
// =======

function renderResults() {
	if ( ! scrollmap.canvas ) {
		initScrollmap();
	} //end if

	setOverlayOpacity( getOpacity() );
	appendScrollmapInBody();
	renderScrollmap();
} //end renderResults()

function setOverlayOpacity( opacity: number ) {
	if ( ! scrollmap.canvas || undefined === opacity ) {
		return;
	} //end if
	scrollmap.canvas.style.opacity = `${ opacity / 100 }`;
} //end setOverlayOpacity()

function removeScrollmapFromBody() {
	if ( document.body === scrollmap.canvas?.parentNode ) {
		document.body.removeChild( scrollmap.canvas );
	} //end if

	if ( document.body === scrollmap.stats?.parentNode ) {
		document.body.removeChild( scrollmap.stats );
	} //end if

	if ( document.body === scrollmap.averageFold?.parentNode ) {
		document.body.removeChild( scrollmap.averageFold );
	} //end if

	if ( document.body === scrollmap.statsTracker?.parentNode ) {
		document.body.removeChild( scrollmap.statsTracker );
	} //end if
} //end removeScrollmapFromBody()

function appendScrollmapInBody() {
	if (
		! scrollmap.averageFold ||
		! scrollmap.stats ||
		! scrollmap.canvas ||
		! scrollmap.statsTracker
	) {
		return;
	} //end if

	scrollmap.averageFold.style.width = `${ document.body.clientWidth }px`;
	scrollmap.stats.style.width = `${ document.body.clientWidth }px`;
	maximizeElement( scrollmap.canvas );
	maximizeElement( scrollmap.statsTracker );

	if ( document.body === scrollmap.canvas.parentNode ) {
		return;
	} //end if

	document.body.appendChild( scrollmap.canvas );
	document.body.appendChild( scrollmap.averageFold );
	document.body.appendChild( scrollmap.stats );
	document.body.appendChild( scrollmap.statsTracker );
} //end appendScrollmapInBody()

function initScrollmap() {
	// Canvas.
	scrollmap.canvas = createOverlayElement< HTMLCanvasElement >( 'canvas' );
	scrollmap.canvas.style.opacity = '0.75';

	// Average Fold.
	scrollmap.averageFold = createOverlayElement( 'div' );
	scrollmap.averageFold.style.display = 'none';
	scrollmap.averageFold.style.height = 'auto';
	scrollmap.averageFold.style.borderBottom = '2px dashed #262b2d';
	scrollmap.averageFold.style.textAlign = 'center';

	const averageFoldContainer = createElement( 'span', {
		style: {
			fontSize: '13px',
			margin: '0 auto',
			borderRadius: '4px',
			fontWeight: '600',
			fontFamily:
				'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
			background: '#262b2d',
			pointerEvents: 'none',
			color: '#eee',
			display: 'inline-block',
			transform: 'translate(-50%, -50%)',
			position: 'absolute',
			whiteSpace: 'nowrap',
		},
	} );

	scrollmap.averageFold.appendChild( averageFoldContainer );
	const scrollmapSpan = createElement( 'span', {
		className: 'nab-data-block',
		style: { padding: '0 1em' },
	} );
	const scrollmapSpanIcon = createElement( 'span', {
		className: 'dashicons dashicons-image-flip-vertical',
		style: {
			verticalAlign: 'text-top',
			marginRight: '5px',
		},
	} );
	const scrollmapLabel = document.createTextNode(
		getIFrameLabels().averageFold + ' '
	);
	const scrollmapValue = createElement( 'output', {
		id: 'nab-average-fold',
	} );
	scrollmapValue.style.color = 'inherit';
	scrollmapValue.style.display = 'inline';
	scrollmapValue.style.fontSize = 'inherit';
	scrollmapValue.style.lineHeight = 'inherit';
	scrollmapValue.style.margin = '0';
	scrollmapValue.style.padding = '0';

	averageFoldContainer.appendChild( scrollmapSpan );
	scrollmapSpan.appendChild( scrollmapSpanIcon );
	scrollmapSpan.appendChild( scrollmapLabel );
	scrollmapSpan.appendChild( scrollmapValue );

	// Stats.
	scrollmap.stats = createOverlayElement( 'div' );
	scrollmap.stats.style.height = 'auto';
	scrollmap.stats.style.borderBottom = '2px dashed #262b2d';
	scrollmap.stats.style.opacity = '0';
	scrollmap.stats.style.transition = 'opacity 200ms ease-in-out';

	const scrollStatsContainer = createElement( 'span', {
		style: {
			fontSize: '13px',
			left: '1em',
			borderRadius: '4px',
			fontWeight: '600',
			fontFamily:
				'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
			background: '#262b2d',
			pointerEvents: 'none',
			color: '#eee',
			display: 'inline-block',
			position: 'absolute',
			transform: 'translate(0, -50%)',
			whiteSpace: 'nowrap',
		},
	} );

	const statsPopularity = createElement( 'span', {
		className: 'nab-data-block',
		style: { padding: '0 1em' },
	} );
	const statsPopularityLabel = document.createTextNode(
		getIFrameLabels().popularity + ' '
	);
	const statsPopularityValue = createElement( 'output', {
		id: 'nab-popularity',
	} );
	scrollStatsContainer.appendChild( statsPopularity );
	statsPopularity.appendChild( statsPopularityLabel );
	statsPopularity.appendChild( statsPopularityValue );

	// Stats tracker.
	scrollmap.statsTracker = createOverlayElement( 'div' );

	// Event listeners.
	scrollmap.stats.appendChild( scrollStatsContainer );

	scrollmap.statsTracker.addEventListener( 'mouseenter', () => {
		if ( scrollmap.stats ) {
			scrollmap.stats.style.opacity = '1';
		} //end if
	} );

	scrollmap.statsTracker.addEventListener( 'mouseleave', () => {
		if ( scrollmap.stats ) {
			scrollmap.stats.style.opacity = '0';
		} //end if
	} );

	// Update position.
	scrollmap.statsTracker.addEventListener( 'mousemove', ( event ) => {
		if ( ! scrollmap.stats ) {
			return;
		} //end if
		scrollmap.stats.style.top = `${ Math.max( event.pageY, 0 ) }px`;
	} );

	// Update count.
	scrollmap.statsTracker.addEventListener(
		'mousemove',
		throttle( ( event: MouseEvent ) => {
			const popularityEl = document.getElementById( 'nab-popularity' );
			if ( ! popularityEl ) {
				return;
			} //end if
			const { rows, maxHits } = getScrollSummary();
			const rowIndex = Math.floor( event.pageY / SCROLLMAP_ROW_HEIGHT );
			const intensity = rows[ rowIndex ] || 0;
			const popularity = Math.round( ( 100 * intensity ) / maxHits ) || 0;
			popularityEl.textContent = `${ popularity.toLocaleString() }%`;
		}, STATS_REFRESH_DELAY )
	);
} //end initScrollmap()

function renderScrollmap(): void {
	generateScrollmapImage();

	if ( ! scrollmap.canvas ) {
		return;
	} //end if

	const image = scrollmap.image;
	const ctx = scrollmap.canvas.getContext( '2d' );
	if ( image && ctx ) {
		scrollmap.canvas.width = image.width;
		scrollmap.canvas.height = image.height;
		ctx.clearRect( 0, 0, scrollmap.canvas.width, scrollmap.canvas.height );
		ctx.drawImage( image, 0, 0 );
	} //end if

	renderAverageFold();
} //end renderScrollmap()

function renderAverageFold() {
	const avgFoldEl = document.getElementById( 'nab-average-fold' );
	if ( ! avgFoldEl || ! scrollmap.averageFold ) {
		return;
	} //end if

	const data = getScrollSummary();
	const { averageFold } = data;
	if ( averageFold ) {
		avgFoldEl.textContent = `${ averageFold.toLocaleString() }px`;
		scrollmap.averageFold.style.top = `${ averageFold }px`;
		scrollmap.averageFold.style.display = 'block';
	} else {
		avgFoldEl.textContent = `–`;
		scrollmap.averageFold.style.display = 'none';
	} //end if
} //end renderAverageFold()

function generateScrollmapImage() {
	const { rows, maxHits } = getScrollSummary();
	const narrowCanvas = createElement< HTMLCanvasElement >( 'canvas' );
	narrowCanvas.width = 1;
	narrowCanvas.height = rows.length;
	const narrowCtx = narrowCanvas.getContext( '2d' );

	const colorIndexes = rows.map( ( hits ) =>
		Math.floor( ( hits / maxHits ) * ( SCROLLMAP_COLORS.length - 1 ) )
	);
	smoothColorIndexTransition( colorIndexes ).forEach(
		( colorIndex, rowNumber ) => {
			if ( ! narrowCtx || ! scrollmap.canvas ) {
				return;
			} //end if
			narrowCtx.fillStyle = SCROLLMAP_COLORS[ colorIndex ] ?? '';
			narrowCtx.fillRect( 0, rowNumber, scrollmap.canvas.width, 1 );
		}
	);

	StackBlur.canvasRGB(
		narrowCanvas,
		0,
		0,
		narrowCanvas.width,
		narrowCanvas.height,
		100 / SCROLLMAP_ROW_HEIGHT
	);
	scrollmap.image = narrowCanvas;
} //end generateScrollmapImage()

function smoothColorIndexTransition( values: ReadonlyArray< number > ) {
	let result = values;
	for ( let i = 0; i < 5; ++i ) {
		result = smooth( result );
	} //end for
	return result;
} //end smoothColorIndexTransition()

function smooth( values: ReadonlyArray< number > ) {
	if ( ! values.length ) {
		return values;
	} //end if

	const weighted = average( values );
	const originalMin = min( values );
	const originalMax = max( values );
	const originalSize = originalMax - originalMin;

	const numOfItems = values.length;
	const padding = 10;
	const firstValue = values[ 0 ] || 0;
	const lastValue = values[ values.length - 1 ] || 0;
	values = [
		...( new Array( padding ).fill( firstValue ) as number[] ),
		...values,
		...( new Array( padding ).fill( lastValue ) as number[] ),
	];

	let smoothed: number[] = [];
	for ( let i = 1; i < values.length - 1; ++i ) {
		const curr = values[ i ];
		const prev = smoothed[ i - 1 ] || values[ i - 1 ];
		const next = values[ i + 1 ];
		const improved = average(
			[ weighted, prev, curr, next ].filter( isDefined )
		);
		smoothed.push( improved );
	} //end for
	smoothed = smoothed.splice( padding - 1, numOfItems );

	const smoothedMin = min( smoothed );
	const smoothedMax = max( smoothed );
	const smoothedSize = smoothedMax - smoothedMin;
	const normalized = smoothed.map(
		( value ) => ( value - smoothedMin ) / smoothedSize
	);

	return normalized.map(
		( value ) => Math.round( value * originalSize ) + originalMin
	);
} //end smooth()

function isDefined< T >( v: T | undefined ): v is T {
	return undefined !== v;
} //end isDefined()

function average( values: ReadonlyArray< number > ) {
	const sum = values.reduce( ( res, val ) => res + val, 0 );
	const avg = sum / values.length;
	return avg;
} //end average()

function min( values: ReadonlyArray< number > ) {
	return values.reduce(
		( memo, value ) => Math.min( memo, value ),
		Number.POSITIVE_INFINITY
	);
} //end if

function max( values: ReadonlyArray< number > ) {
	return values.reduce(
		( memo, value ) => Math.max( memo, value ),
		Number.NEGATIVE_INFINITY
	);
} //end if

function createElement< T extends HTMLElement = HTMLElement >(
	type: string,
	options: Dict & { style?: Dict< string > } = {}
): T {
	const el = document.createElement( type );

	const { id, className, style, ...props } = options;
	if ( 'string' === typeof id ) {
		el.id = id;
	} //end if

	if ( 'string' === typeof className ) {
		el.className = className;
	} //end if

	if ( 'object' === typeof style ) {
		Object.keys( style ).forEach( ( k ) => {
			( el as unknown as { style: Dict< string > } ).style[ k ] =
				style[ k ] ?? '';
		} );
	} //end if

	Object.keys( props ).forEach( ( p ) => {
		( el as unknown as Dict )[ p ] = props[ p ];
	} );

	return el as T;
} //end createElement()
