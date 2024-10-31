/**
 * External dependencies
 */
import type { Click, HeatmapFrameAction } from '@nab/types';

/**
 * Internal dependencies
 */
import { domReady } from '../../../public/utils/helpers';
import {
	HEATMAP_GL_CANVAS_SCALE,
	HEATMAP_POINT_SIZE,
	HEATMAP_MAX_SIZE_MULTIPLIER,
	HEATMAP_MIN_INTENSITY,
	HEATMAP_INTENSITY_RANGE,
} from './internal/constants';
import {
	areRawResults,
	getClicksPerSquare,
	getHeatmapClicks,
	getIntensity,
	getOpacity,
	processResults,
} from './internal/store';
import {
	createOverlayElement,
	getDocumentHeight,
	maximizeElement,
} from './internal/utils';
import { WebGLHeatmap, createWebGLHeatmap } from './lib/webgl-heatmap';

type Heatmap = {
	canvas: HTMLCanvasElement;
	instance: WebGLHeatmap;
	overlay: HTMLElement;
};

const heatmap: Heatmap = initWebGLHeatmap();

// Add overlay on startup.
domReady( appendHeatmapInBody );

export function reactToParentMessages( action: HeatmapFrameAction ): true {
	if ( 'heatmap' !== action.mode ) {
		removeHeatmapFromBody();
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
			refreshHeatmap();
			return true;

		case 'update-intensity':
			updateIntensity();
			return true;

		case 'update-opacity':
			setOverlayOpacity( action.value );
			return true;
	} //end if
} //end reactToParentMessages()

export function refreshHeatmap(): void {
	resetHeatmap();
	renderHeatmap();
} //end refreshHeatmap();

// =======
// HELPERS
// =======

const updateIntensity = renderHeatmap;

function resetHeatmap() {
	const { canvas, instance } = initWebGLHeatmap();
	removeHeatmapFromBody();
	heatmap.canvas = canvas;
	heatmap.instance = instance;
	appendHeatmapInBody();
} //end resetHeatmap()

function setOverlayOpacity( opacity: number ) {
	if ( ! heatmap.overlay || undefined === opacity ) {
		return;
	} //end if
	heatmap.overlay.style.opacity = `${ opacity / 100 }`;
} //end setOverlayOpacity()

function removeHeatmapFromBody() {
	if ( document.body === heatmap.canvas?.parentNode ) {
		document.body.removeChild( heatmap.canvas );
	} //end if

	if ( document.body === heatmap.overlay?.parentNode ) {
		document.body.removeChild( heatmap.overlay );
	} //end if
} //end removeHeatmapFromBody()

function appendHeatmapInBody() {
	if ( ! heatmap.canvas || ! heatmap.overlay ) {
		return;
	} //end if

	if ( document.body === heatmap.canvas.parentNode ) {
		maximizeHeatmap();
		return;
	} //end if

	document.body.appendChild( heatmap.overlay );
	document.body.appendChild( heatmap.canvas );
	maximizeHeatmap();
} //end appendHeatmapInBody()

function maximizeHeatmap() {
	if ( ! heatmap.canvas || ! heatmap.instance || ! heatmap.overlay ) {
		return;
	} //end if

	maximizeElement( heatmap.overlay );

	const width = document.body.clientWidth * HEATMAP_GL_CANVAS_SCALE;
	const height = getDocumentHeight() * HEATMAP_GL_CANVAS_SCALE;
	heatmap.canvas.style.width = `${ width }px`;
	heatmap.canvas.style.height = `${ height }px`;
	heatmap.instance.adjustSize( width, height );
} //end maximizeHeatmap()

function initWebGLHeatmap(): Heatmap {
	const overlay = createOverlayElement( 'div' );
	overlay.style.background = '#000';
	overlay.style.opacity = '0.8';

	const canvas = createOverlayElement< HTMLCanvasElement >( 'canvas' );
	canvas.style.mixBlendMode = 'screen';
	canvas.style.transform = `scale(${ ( 1 / HEATMAP_GL_CANVAS_SCALE ).toFixed(
		3
	) })`;
	canvas.style.transformOrigin = '0 0';

	const instance = createWebGLHeatmap( {
		canvas,
	} );
	return { overlay, canvas, instance };
} //end initWebGLHeatmap()

function renderHeatmap() {
	if ( ! heatmap.instance ) {
		return;
	} //end if

	removeHeatmapFromBody();
	setOverlayOpacity( getOpacity() );
	appendHeatmapInBody();

	const clicks = getHeatmapClicks();
	const cps = getClicksPerSquare();

	const maxClicksInSquare = cps.max;
	const intensity = getIntensity() / 100;

	heatmap.instance.clear();
	clicks.forEach( ( click ) => renderClick( click, maxClicksInSquare ) );
	heatmap.instance.update();
	heatmap.instance.multiply( intensity );
	heatmap.instance.update();
	heatmap.instance.display();
} //end renderHeatmap()

function renderClick( click: Click, maxClicksInSquare: number ) {
	if ( ! heatmap.instance ) {
		return;
	} //end if

	const { x, y } = click.realCoordinates;
	const clicksInSquare = getClicksInSquare( click );
	const normalizedSquareIntensity =
		( clicksInSquare / maxClicksInSquare ) * HEATMAP_INTENSITY_RANGE +
		HEATMAP_MIN_INTENSITY;
	const clickIntensity = normalizedSquareIntensity / clicksInSquare;

	const scale = mapScale(
		clicksInSquare,
		0,
		maxClicksInSquare,
		HEATMAP_MAX_SIZE_MULTIPLIER,
		1
	);

	heatmap.instance.addPoint(
		x * HEATMAP_GL_CANVAS_SCALE,
		y * HEATMAP_GL_CANVAS_SCALE,
		scale * HEATMAP_POINT_SIZE * HEATMAP_GL_CANVAS_SCALE,
		clickIntensity
	);
} //end renderClick()

function mapScale(
	value: number,
	inputStart: number,
	inputEnd: number,
	outputStart: number,
	outputEnd: number
) {
	const slope = ( outputEnd - outputStart ) / ( inputEnd - inputStart );
	return outputStart + slope * ( value - inputStart );
} //end mapScale()

function getClicksInSquare( click: Click ): number {
	const cps = getClicksPerSquare();
	const coords = click.realCoordinates;
	if ( ! cps || ! coords ) {
		return 1;
	} //end if

	const { x, y } = coords;
	const { columns, value } = cps;
	const col = Math.floor( x / HEATMAP_POINT_SIZE );
	const row = Math.floor( y / HEATMAP_POINT_SIZE );

	const index = row * columns + col;
	if ( index < 0 && value.length <= index ) {
		return 1;
	} //end if

	return cps.value[ index ] ?? 0;
} //end getClicksInSquare()
