/**
 * External dependencies
 */
import type {
	AlternativeIndex,
	BoundingBox,
	Click,
	ClicksPerSquare,
	ConfettiOption,
	ConfettiType,
	Dict,
	HeatmapDataStatus,
	HeatmapResolution,
	HeatmapResults,
	Scroll,
	ScrollSummary,
} from '@nab/types';

export type State = {
	readonly confettiFilterOptions: Partial<
		Record< ConfettiType, Dict< ConfettiOption > >
	>;
	readonly byAlternative: Record< AlternativeIndex, ProcessedAlternative >;
};

export const INIT: State = {
	confettiFilterOptions: {},
	byAlternative: {},
};

export type ProcessedAlternative = {
	readonly raw: RawResults;
	readonly byResolution: Record< HeatmapResolution, ResolutionResults >;
	readonly loadAttempts: {
		readonly clicks: LoadAttemptsData;
		readonly scrolls: LoadAttemptsData;
	};
};

export type RawResults = {
	readonly results: HeatmapResults;
	readonly status: HeatmapDataStatus;
	readonly progress: number;
};

export type LoadAttemptsData = {
	readonly count: number;
	readonly length: number;
};

type Selector = string;
export type ResolutionResults =
	| {
			readonly results?: undefined;
			readonly page: PageData;
			readonly status: 'missing' | 'processing' | 'outdated';
			readonly confettiFilterOptions?: undefined;
	  }
	| {
			readonly results: ProcessedResults;
			readonly page: PageData;
			readonly status: 'processing' | 'ready' | 'outdated';
			readonly confettiFilterOptions: Partial<
				Record< ConfettiType, Dict< ConfettiOption > >
			>;
	  };

export type ProcessedResults = {
	readonly clicks: ReadonlyArray< Click >;
	readonly clicksPerSquare: ClicksPerSquare;
	readonly scrolls: ReadonlyArray< Scroll >;
	readonly scrollSummary: ScrollSummary;
};

export type ProcessedResultsStatus = ResolutionResults[ 'status' ];

export type PageData = {
	readonly boundingBoxes: Record< Selector, BoundingBox >;
	readonly dimensions: {
		readonly width: number;
		readonly bodyHeight: number;
		readonly iframeHeight: number;
	};
};
