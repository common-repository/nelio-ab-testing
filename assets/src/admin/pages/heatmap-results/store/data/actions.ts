/**
 * External dependencies
 */
import type {
	AlternativeIndex,
	Click,
	HeatmapDataStatus,
	HeatmapResolution,
	Maybe,
	RawHeatmapResults,
	Scroll,
} from '@nab/types';

/**
 * Internal dependencies
 */
import type { PageData, ProcessedResults, RawResults } from './config';

export type DataAction =
	| ReceiveRawResults
	| SetRawResultStatus
	| SetRawResultProgress
	| UpdateLoadAttempts
	| SetProcessedResults
	| SetPageInfo
	| MarkResultsAsProcessing
	| RequestResultProcessing;

export function receiveRawResults(
	alternative: AlternativeIndex,
	data: RawResults
): ReceiveRawResults {
	return {
		type: 'RECEIVE_RAW_RESULTS',
		alternative,
		data,
	};
} //end receiveRawResults()

export function setRawResultStatus(
	alternative: AlternativeIndex,
	status: HeatmapDataStatus
): SetRawResultStatus {
	return {
		type: 'SET_RAW_RESULT_STATUS',
		alternative,
		status,
	};
} //end setRawResultStatus()

export function setRawResultProgress(
	alternative: AlternativeIndex,
	progress: number
): SetRawResultProgress {
	return {
		type: 'SET_RAW_RESULT_PROGRESS',
		alternative,
		progress,
	};
} //end setRawResultProgress()

export function updateLoadAttempts(
	alternative: AlternativeIndex,
	clicks: Maybe< RawHeatmapResults< Click > >,
	scrolls: Maybe< RawHeatmapResults< Scroll > >
): UpdateLoadAttempts {
	return {
		type: 'UPDATE_LOAD_ATTEMPTS',
		alternative,
		clicks,
		scrolls,
	};
} //end updateLoadAttempts()

export function setProcessedResults(
	alternative: AlternativeIndex,
	resolution: HeatmapResolution,
	results: ProcessedResults
): SetProcessedResults {
	return {
		type: 'SET_PROCESSED_RESULTS',
		alternative,
		resolution,
		results,
	};
} //end setProcessedResults()

export function setPageInfo(
	alternative: AlternativeIndex,
	resolution: HeatmapResolution,
	page: PageData
): SetPageInfo {
	return {
		type: 'SET_PAGE_INFO',
		alternative,
		resolution,
		page,
	};
} //end setPageInfo()

export function markResultsAsProcessing(
	alternative: AlternativeIndex,
	resolution: HeatmapResolution
): MarkResultsAsProcessing {
	return {
		type: 'MARK_RESULTS_AS_PROCESSING',
		alternative,
		resolution,
	};
} //end markResultsAsProcessing()

export function requestResultProcessing(
	alternative: AlternativeIndex,
	resolution: HeatmapResolution
): RequestResultProcessing {
	return {
		type: 'REQUEST_RESULTS_PROCESSING',
		alternative,
		resolution,
	};
} //end requestResultProcessing()

// ============
// HELPER TYPES
// ============

type ReceiveRawResults = {
	readonly type: 'RECEIVE_RAW_RESULTS';
	readonly alternative: AlternativeIndex;
	readonly data: RawResults;
};

type SetRawResultStatus = {
	readonly type: 'SET_RAW_RESULT_STATUS';
	readonly alternative: AlternativeIndex;
	readonly status: HeatmapDataStatus;
};

type SetRawResultProgress = {
	readonly type: 'SET_RAW_RESULT_PROGRESS';
	readonly alternative: AlternativeIndex;
	readonly progress: number;
};

type UpdateLoadAttempts = {
	readonly type: 'UPDATE_LOAD_ATTEMPTS';
	readonly alternative: AlternativeIndex;
	readonly clicks: Maybe< RawHeatmapResults< Click > >;
	readonly scrolls: Maybe< RawHeatmapResults< Scroll > >;
};

type SetProcessedResults = {
	readonly type: 'SET_PROCESSED_RESULTS';
	readonly alternative: AlternativeIndex;
	readonly resolution: HeatmapResolution;
	readonly results: ProcessedResults;
};

type SetPageInfo = {
	readonly type: 'SET_PAGE_INFO';
	readonly alternative: AlternativeIndex;
	readonly resolution: HeatmapResolution;
	readonly page: PageData;
};

type MarkResultsAsProcessing = {
	readonly type: 'MARK_RESULTS_AS_PROCESSING';
	readonly alternative: AlternativeIndex;
	readonly resolution: HeatmapResolution;
};

type RequestResultProcessing = {
	readonly type: 'REQUEST_RESULTS_PROCESSING';
	readonly alternative: AlternativeIndex;
	readonly resolution: HeatmapResolution;
};
