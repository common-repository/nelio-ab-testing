/**
 * WordPress dependencies
 */
import type {
	select as _select,
	dispatch as _dispatch,
} from '@safe-wordpress/data';

/**
 * External dependencies
 */
import isEqual from 'lodash/isEqual';
import keyBy from 'lodash/keyBy';
import mapValues from 'lodash/mapValues';
import pickBy from 'lodash/pickBy';
import type {
	AlternativeIndex,
	BoundingBox,
	Click,
	ClicksPerSquare,
	ConfettiOption,
	ConfettiType,
	Dict,
	HeatmapDataStatus,
	HeatmapLabels,
	HeatmapResolution,
	HeatmapResults,
	ScrollSummary,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { getDocumentHeight } from './utils';
import { getElementByXPath } from '../../../../public/tracking/xpath';
import { getDocumentHeight as getBodyHeight } from '../../../../public/utils/helpers';

// ===================
// CONSTANTS AND UTILS
// ===================

import type { store as dataStore } from '@nab/data';
const NAB_DATA = 'nab/data' as unknown as typeof dataStore;

import type { store as heatmapStore } from '../../../pages/heatmap-results/store';
const NAB_HEATMAP = 'nab/heatmap' as unknown as typeof heatmapStore;

const select = ( ( window.parent?.wp as Dict )?.data as Dict )
	?.select as typeof _select;
const dispatch = ( ( window.parent?.wp as Dict )?.data as Dict )
	?.dispatch as typeof _dispatch;

// =======
// EXPORTS
// =======

export function areRawResults(
	mode: HeatmapDataStatus[ 'mode' ] | HeatmapDataStatus[ 'mode' ][]
): boolean {
	const alternative = getAlternative();
	const status = select( NAB_HEATMAP ).getRawResultStatus( alternative ).mode;
	const modes = 'string' === typeof mode ? [ mode ] : mode;
	return modes.some( ( m ) => m === status );
} //end areRawResults()

export function getRawClicks(): HeatmapResults[ 'clicks' ] {
	return select( NAB_HEATMAP ).getRawClicks( getAlternative() );
} //end getRawClicks()

export function getRawScrolls(): HeatmapResults[ 'scrolls' ] {
	return select( NAB_HEATMAP ).getRawScrolls( getAlternative() );
} //end getRawScrolls()

export function getHeatmapClicks(): HeatmapResults[ 'clicks' ] {
	return select( NAB_HEATMAP ).getClicksInResolution(
		getAlternative(),
		getActiveResolution()
	);
} //end getHeatmapClicks()

export function getClicksPerSquare(): ClicksPerSquare {
	return select( NAB_HEATMAP ).getClicksPerSquare(
		getAlternative(),
		getActiveResolution()
	);
} //end gClicksPerSquareetHeatmapClicks()

export function getScrollSummary(): ScrollSummary {
	return select( NAB_HEATMAP ).getScrollSummary(
		getAlternative(),
		getActiveResolution()
	);
} //end getScrollSummary()

export function getConfettiClicks(): HeatmapResults[ 'clicks' ] {
	return getHeatmapClicks().filter( isClickVisibleInConfetti );
} //end getConfettiClicks()

export function getConfettiFilterOptions(): Partial<
	Record< ConfettiType, Dict< ConfettiOption > >
> {
	return select( NAB_HEATMAP ).getConfettiFilterOptions(
		getAlternative(),
		getActiveResolution()
	);
} //end getConfettiFilterOptions()

export function getActiveConfettiFilter(): ConfettiType {
	return select( NAB_HEATMAP ).getActiveFilter();
} //end getActiveConfettiFilter()

export function getDisabledConfettiFilterOptions(): ReadonlyArray< string > {
	return select( NAB_HEATMAP ).getDisabledFilterOptions();
} //end getDisabledConfettiFilterOptions()

export function getIntensity(): number {
	return select( NAB_HEATMAP ).getIntensity();
} //end getIntensity()

export function getOpacity(): number {
	return select( NAB_HEATMAP ).getOpacity();
} //end getOpacity()

export function markScriptAsReady(): void {
	const alt = getAlternative();
	void dispatch( NAB_HEATMAP ).setIFrameStatus( alt, 'script-ready' );
} //end markScriptAsReady()

export function markPageAsReady(): void {
	const alt = getAlternative();
	void dispatch( NAB_HEATMAP ).setIFrameStatus( alt, 'page-ready' );
} //end markPageAsReady()

export function processResults(): void {
	const alt = getAlternative();
	const res = getActiveResolution();
	const clicks = getRawClicks();
	const page = {
		boundingBoxes: computeBoundingBoxes( clicks ),
		dimensions: getPageDimensions(),
	};
	void dispatch( NAB_HEATMAP ).setPageInfo( alt, res, page );
	void dispatch( NAB_HEATMAP ).processResults( alt, res );
} //end processResults()

export function onWindowResize(): void {
	const alt = getAlternative();
	const res = getActiveResolution();
	const pageDimensions = getPageDimensions();
	const storeDimensions = select( NAB_HEATMAP ).getPageDimensions( alt, res );
	if ( isEqual( pageDimensions, storeDimensions ) ) {
		return;
	} //end if
	processResults();
} //end onWindowResize()

export const getIFrameLabels = (): HeatmapLabels =>
	select( NAB_HEATMAP ).getIFrameLabels();

// =======
// HELPERS
// =======

const getAlternative = (): AlternativeIndex =>
	Number.parseInt(
		window.location.search
			.replace( /^\?/, '' )
			.split( '&' )
			.find( ( x ) => x.startsWith( 'alternative=' ) )
			?.split( '=' )[ 1 ] ?? '0'
	) || 0;

function getActiveResolution(): HeatmapResolution {
	return select( NAB_HEATMAP ).getActiveResolution();
} //end getActiveResolution()

const getPageDimensions = () => ( {
	width: window.innerWidth,
	bodyHeight: getBodyHeight(),
	iframeHeight: getDocumentHeight(),
} );

const computeBoundingBoxes = (
	clicks: ReadonlyArray< Click >
): Record< string, BoundingBox > =>
	pickBy(
		mapValues(
			keyBy(
				clicks.map( ( c ) => ( {
					...c,
					_selector: c.xpath || c.cssPath,
				} ) ),
				'_selector'
			),
			( click ): BoundingBox | undefined => {
				const selector = click.xpath || click.cssPath;
				if ( ! selector ) {
					return undefined;
				} //end if

				const el = getAllSelectors( selector ).reduce(
					( r, s ) => {
						try {
							return r || click.xpath
								? getElementByXPath( s )
								: document.querySelector( s );
						} catch ( _ ) {
							return r;
						}
					},
					null as Node | null
				);

				if ( ! isHTMLElement( el ) ) {
					return undefined;
				} //end if

				const bodyBox = document.body.getBoundingClientRect();
				const elBox = el.getBoundingClientRect();
				return {
					top: elBox.top - bodyBox.top,
					left: elBox.left - bodyBox.left,
					width: elBox.width,
					height: elBox.height,
				};
			}
		),
		< T >( x: T | undefined ): x is T => undefined !== x
	);

function getAllSelectors( selector: string ): ReadonlyArray< string > {
	const { getExperiment, getPageAttribute } = select( NAB_DATA );
	const experimentId = getPageAttribute( 'editor/activeExperiment' );
	const experiment = getExperiment( experimentId );
	if ( ! experiment ) {
		return [ selector ];
	} //end if

	if ( experiment.type === 'nab/heatmap' ) {
		return [ selector ];
	} //end if

	const { getActiveAlternative } = select( NAB_HEATMAP );
	const altIdx = getActiveAlternative();
	if ( altIdx === 0 ) {
		return [ selector ];
	} //end if

	const control = experiment.alternatives[ 0 ];
	const alternative =
		undefined !== altIdx ? experiment.alternatives[ altIdx ] : undefined;

	const controlPost = control?.attributes.postId;
	const alternativePost = alternative?.attributes.postId;
	if ( ! isPostId( controlPost ) || ! isPostId( alternativePost ) ) {
		return [ selector ];
	} //end if

	return [
		selector,
		selector.replace(
			new RegExp( `([\\b_])?${ controlPost }([\\b_])?`, 'g' ),
			`$1${ alternativePost }$2`
		),
		selector.replace(
			new RegExp( `([\\b_])?${ alternativePost }([\\b_])?`, 'g' ),
			`$1${ controlPost }$2`
		),
	];
} //end getAlternativeSelector()

const isPostId = ( id: unknown ): id is number =>
	'number' === typeof id && 0 < id;

function isHTMLElement( n: Node | null ): n is HTMLElement {
	return !! n && Node.ELEMENT_NODE === n.nodeType;
} //end isHTMLElement()

function isClickVisibleInConfetti( click: Click ): boolean {
	const actualFilterOptions = getConfettiFilterOptions();
	const activeFilter = getActiveConfettiFilter();
	const disabledFilterOptions = getDisabledConfettiFilterOptions();

	let filterValue = click[ activeFilter ];
	if (
		! Object.keys( actualFilterOptions[ activeFilter ] || {} ).includes(
			`${ filterValue }`
		)
	) {
		filterValue = 'other';
	} //end if

	return ! disabledFilterOptions.includes( `${ filterValue }` );
} //end isClickVisibleInConfetti()
