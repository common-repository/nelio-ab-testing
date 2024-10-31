/**
 * External dependencies
 */
import throttle from 'lodash/throttle';
import type {
	Click,
	ConfettiOption,
	ConfettiType,
	Dict,
	HeatmapFrameAction,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { STATS_REFRESH_DELAY } from './internal/constants';
import {
	areRawResults,
	getActiveConfettiFilter,
	getConfettiFilterOptions,
	getConfettiClicks,
	getIFrameLabels,
	getOpacity,
	processResults,
} from './internal/store';
import { createOverlayElement, maximizeElement } from './internal/utils';

const confetti: {
	canvas?: HTMLCanvasElement;
	overlay?: HTMLElement;
	stats?: HTMLElement;
	statsTracker?: HTMLElement;
} = {};

export function reactToParentMessages( action: HeatmapFrameAction ): true {
	if ( 'confetti' !== action.mode ) {
		removeConfettiFromBody();
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
	if ( ! confetti.canvas ) {
		initConfetti();
	} //end if

	setOverlayOpacity( getOpacity() );
	appendConfettiInBody();
	renderConfetti();
} //end renderResults()

function setOverlayOpacity( opacity?: number ) {
	if ( ! confetti.overlay || undefined === opacity ) {
		return;
	} //end if
	confetti.overlay.style.opacity = `${ opacity / 100 }`;
} //end setOverlayOpacity()

function removeConfettiFromBody() {
	if ( document.body === confetti.canvas?.parentNode ) {
		document.body.removeChild( confetti.canvas );
	} //end if

	if ( document.body === confetti.overlay?.parentNode ) {
		document.body.removeChild( confetti.overlay );
	} //end if

	if ( document.body === confetti.stats?.parentNode ) {
		document.body.removeChild( confetti.stats );
	} //end if

	if ( document.body === confetti.statsTracker?.parentNode ) {
		document.body.removeChild( confetti.statsTracker );
	} //end if
} //end removeConfettiFromBody()

function appendConfettiInBody() {
	if (
		! confetti.overlay ||
		! confetti.canvas ||
		! confetti.stats ||
		! confetti.statsTracker
	) {
		return;
	} //end if

	maximizeElement( confetti.overlay );
	maximizeElement( confetti.canvas );

	if ( document.body === confetti.canvas.parentNode ) {
		return;
	} //end if

	document.body.appendChild( confetti.overlay );
	document.body.appendChild( confetti.canvas );
	document.body.appendChild( confetti.stats );
	document.body.appendChild( confetti.statsTracker );
} //end appendConfettiInBody()

function initConfetti() {
	confetti.overlay = createOverlayElement( 'div' );
	confetti.overlay.style.background = '#000';
	confetti.canvas = createOverlayElement< HTMLCanvasElement >( 'canvas' );
	// Stats.

	confetti.stats = createOverlayElement( 'div' );
	confetti.stats.style.height = 'auto';
	confetti.stats.style.borderBottom = '2px dashed #262b2d';
	confetti.stats.style.opacity = '0';
	confetti.stats.style.transition = 'opacity 200ms ease-in-out';

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
		getIFrameLabels().clicksAbove + ' '
	);
	const statsPopularityValue = createElement( 'output', {
		id: 'nab-clicks-above',
	} );
	statsPopularityValue.style.color = 'inherit';
	statsPopularityValue.style.display = 'inline';
	statsPopularityValue.style.fontSize = 'inherit';
	statsPopularityValue.style.lineHeight = 'inherit';
	statsPopularityValue.style.margin = '0';
	statsPopularityValue.style.padding = '0';

	scrollStatsContainer.appendChild( statsPopularity );
	statsPopularity.appendChild( statsPopularityLabel );
	statsPopularity.appendChild( statsPopularityValue );

	// Stats tracker.
	confetti.statsTracker = createOverlayElement( 'div' );

	// Event listeners.
	confetti.stats.appendChild( scrollStatsContainer );

	confetti.statsTracker.addEventListener( 'mouseenter', () => {
		if ( confetti.stats ) {
			confetti.stats.style.opacity = '1';
		} //end if
	} );

	confetti.statsTracker.addEventListener( 'mouseleave', () => {
		if ( confetti.stats ) {
			confetti.stats.style.opacity = '0';
		} //end if
	} );

	// Update positon.
	confetti.statsTracker.addEventListener( 'mousemove', ( event ) => {
		if ( ! confetti.stats ) {
			return;
		} //end if
		confetti.stats.style.top = `${ Math.max( event.pageY, 0 ) }px`;
	} );

	// Update count.
	confetti.statsTracker.addEventListener(
		'mousemove',
		throttle( ( event: MouseEvent ) => {
			const clicksEl = document.getElementById( 'nab-clicks-above' );
			if ( ! clicksEl ) {
				return;
			} //end if
			const clicks = getConfettiClicks().filter(
				( click ) =>
					( click.realCoordinates.y || Number.POSITIVE_INFINITY ) <=
					event.pageY
			);
			clicksEl.textContent = `${ clicks.length }`;
		}, STATS_REFRESH_DELAY )
	);
} //end initConfetti()

function renderConfetti() {
	if ( ! confetti.canvas ) {
		return;
	} //end if

	const ctx = confetti.canvas.getContext( '2d' );
	if ( ! ctx ) {
		return;
	} //end if

	ctx.clearRect( 0, 0, confetti.canvas.width, confetti.canvas.height );
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#000';

	const activeFilter = getActiveConfettiFilter();
	const options = getConfettiFilterOptions();
	getConfettiClicks().forEach( ( c ) =>
		renderClick( ctx, activeFilter, options, c )
	);
} //end renderConfetti()

function renderClick(
	ctx: CanvasRenderingContext2D,
	activeFilter: ConfettiType,
	filterOptions: Partial< Record< ConfettiType, Dict< ConfettiOption > > >,
	click: Click
) {
	const { x, y } = click.realCoordinates;
	const activeOptions = filterOptions[ activeFilter ] ?? {};

	ctx.fillStyle = activeOptions[ click[ activeFilter ] ]?.color || '#ec82b6';
	ctx.beginPath();
	ctx.arc( x, y, 6, 0, 2 * Math.PI, true );
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
} //end renderClick()

// TODO. This is duplicated from Scrollmap. Refactor?
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
			( el as unknown as { style: Dict } ).style[ k ] = style[ k ];
		} );
	} //end if

	Object.keys( props ).forEach( ( p ) => {
		( el as unknown as Dict )[ p ] = props[ p ];
	} );

	return el as T;
} //end createElement()
