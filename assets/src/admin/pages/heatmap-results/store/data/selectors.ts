/**
 * External dependencies
 */
import type {
	AlternativeIndex,
	BoundingBox,
	ClicksPerSquare,
	ConfettiOption,
	ConfettiType,
	Dict,
	HeatmapDataStatus,
	HeatmapResolution,
	HeatmapResults,
	Maybe,
	ScrollSummary,
} from '@nab/types';

/**
 * Internal dependencies
 */
import type { State } from '../config';
import type {
	PageData,
	ProcessedAlternative,
	ProcessedResultsStatus,
} from './config';

// ========
// RAW DATA
// ========

const NO_STATUS: HeatmapDataStatus = { mode: 'missing' };
export function getRawResultStatus(
	state: State,
	alternative: AlternativeIndex
): HeatmapDataStatus {
	return state.data.byAlternative[ alternative ]?.raw.status ?? NO_STATUS;
} //end getRawResultStatus()

export function getRawResultProgress(
	state: State,
	alternative: AlternativeIndex
): number {
	return state.data.byAlternative[ alternative ]?.raw.progress ?? 0;
} //end getRawResultProgress()

export function getRawClicks(
	state: State,
	alternative: AlternativeIndex
): HeatmapResults[ 'clicks' ] {
	return state.data.byAlternative[ alternative ]?.raw.results.clicks ?? [];
} //end getRawClicks()

export function getRawScrolls(
	state: State,
	alternative: AlternativeIndex
): HeatmapResults[ 'scrolls' ] {
	return state.data.byAlternative[ alternative ]?.raw.results.scrolls ?? [];
} //end getRawScrolls()

export function getLoadAttempts(
	state: State,
	alternative: AlternativeIndex
): ProcessedAlternative[ 'loadAttempts' ] {
	return (
		state.data.byAlternative[ alternative ]?.loadAttempts ?? {
			clicks: { count: 0, length: 0 },
			scrolls: { count: 0, length: 0 },
		}
	);
} //end getLoadAttempts()

export function canRawDataBeProcessed(
	state: State,
	alternative: AlternativeIndex
): boolean {
	const status = state.data.byAlternative[ alternative ]?.raw.status.mode;
	return (
		'still-loading' === status ||
		'ready' === status ||
		'canceling' === status
	);
} //end canRawDataBeProcessed()

// ==============
// PROCESSED DATA
// ==============

export function hasProcessedResults(
	state: State,
	alternative: AlternativeIndex,
	resolution: HeatmapResolution
): boolean {
	return !! state.data.byAlternative[ alternative ]?.byResolution[
		resolution
	].results;
} //end hasProcessedResults()

export function getProcessedResultStatus(
	state: State,
	alternative: AlternativeIndex,
	resolution: HeatmapResolution
): ProcessedResultsStatus {
	return (
		state.data.byAlternative[ alternative ]?.byResolution[ resolution ]
			.status ?? 'missing'
	);
} //end getProcessedResultStatus()

export function getClicksInResolution(
	state: State,
	alternative: AlternativeIndex,
	resolution: HeatmapResolution
): HeatmapResults[ 'clicks' ] {
	return (
		state.data.byAlternative[ alternative ]?.byResolution[ resolution ]
			.results?.clicks ?? []
	);
} //end getClicksInResolution()

const DEFAULT_CLICKS_PER_SQUARE: ClicksPerSquare = {
	rows: 1,
	max: 1,
	value: [ 1 ],
	columns: 1,
};
export function getClicksPerSquare(
	state: State,
	alternative: AlternativeIndex,
	resolution: HeatmapResolution
): ClicksPerSquare {
	return (
		state.data.byAlternative[ alternative ]?.byResolution[ resolution ]
			.results?.clicksPerSquare ?? DEFAULT_CLICKS_PER_SQUARE
	);
} //end getClicksPerSquare()

export function getScrollsInResolution(
	state: State,
	alternative: AlternativeIndex,
	resolution: HeatmapResolution
): HeatmapResults[ 'scrolls' ] {
	return (
		state.data.byAlternative[ alternative ]?.byResolution[ resolution ]
			.results?.scrolls ?? []
	);
} //end getScrollsInResolution()

const NO_SCROLL_SUMMARY: ScrollSummary = {
	rows: [],
	maxHits: 0,
	averageFold: 0,
};
export function getScrollSummary(
	state: State,
	alternative: AlternativeIndex,
	resolution: HeatmapResolution
): ScrollSummary {
	return (
		state.data.byAlternative[ alternative ]?.byResolution[ resolution ]
			.results?.scrollSummary ?? NO_SCROLL_SUMMARY
	);
} //end getScrollSummary()

// ================
// FILTERS AND MORE
// ================

export function getConfettiFilterOptions(
	state: State,
	alternative: AlternativeIndex,
	resolution: HeatmapResolution
): Partial< Record< ConfettiType, Dict< ConfettiOption > > > {
	return (
		state.data.byAlternative[ alternative ]?.byResolution[ resolution ]
			.confettiFilterOptions ?? state.data.confettiFilterOptions
	);
} //end getConfettiFilterOptions()

type Selector = string;
export function getBoundingBoxes(
	state: State,
	alternative: AlternativeIndex,
	resolution: HeatmapResolution
): Maybe< Record< Selector, BoundingBox > > {
	return state.data.byAlternative[ alternative ]?.byResolution[ resolution ]
		.page.boundingBoxes;
} //end getBoundingBoxes()

export function getPageDimensions(
	state: State,
	alternative: AlternativeIndex,
	resolution: HeatmapResolution
): Maybe< PageData[ 'dimensions' ] > {
	return state.data.byAlternative[ alternative ]?.byResolution[ resolution ]
		.page.dimensions;
} //end getPageDimensions()
