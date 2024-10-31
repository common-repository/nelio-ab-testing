import { ScrollEvent } from './tracking';
import { Coords } from './utils';

export type HeatmapDataStatus =
	| {
			readonly mode:
				| 'missing'
				| 'loading'
				| 'still-loading'
				| 'canceling'
				| 'ready';
			readonly partialError?: 'stuck-results' | 'unknown';
	  }
	| {
			readonly mode: 'error';
			readonly rationale: HeatmapErrorRationale;
	  };

export type HeatmapErrorRationale =
	| 'unknown'
	| 'no-script'
	| 'experiment-not-found'
	| 'alternative-not-found'
	| 'stuck-empty-results'
	| 'unreachable-servers';

// =======
// RESULTS
// =======

export type ClicksPerSquare = {
	readonly columns: number;
	readonly value: ReadonlyArray< number >;
	readonly max: number;
	readonly rows: number;
};

export type HeatmapResults = {
	readonly clicks: ReadonlyArray< Click >;
	readonly scrolls: ReadonlyArray< Scroll >;
};

export type RawHeatmapResults< T extends Click | Scroll = Click | Scroll > = {
	readonly data: ReadonlyArray< T >;
	readonly more: boolean;
};

export type Click = Coords & {
	readonly browser: string;
	readonly country: string;
	readonly cssPath: string;
	readonly dayOfWeek: string;
	readonly device: string;
	readonly hourOfDay: string;
	readonly intensity: number;
	readonly os: string;
	readonly timeToClick: string;
	readonly windowWidth: string;
	readonly windowWidthInPx: number;
	readonly xpath: string;
	readonly timestamp: string;
	readonly realCoordinates: Coords;
};

export type Scroll = ScrollEvent;

export type ScrollSummary = {
	readonly maxHits: number;
	readonly rows: ReadonlyArray< number >;
	readonly averageFold: number | false;
};

// =============
// FRAME ACTIONS
// =============

export type HeatmapFrameAction =
	| ProcessResults
	| RenderResults
	| UpdateOpacity
	| UpdateIntensity;

type ProcessResults = {
	readonly plugin: 'nelio-ab-testing';
	readonly type: 'process-results';
	readonly mode: 'heatmap' | 'scrollmap' | 'confetti';
};

type RenderResults = {
	readonly plugin: 'nelio-ab-testing';
	readonly type: 'render-results';
	readonly mode: 'heatmap' | 'scrollmap' | 'confetti';
};

type UpdateOpacity = {
	readonly plugin: 'nelio-ab-testing';
	readonly type: 'update-opacity';
	readonly mode: 'heatmap' | 'scrollmap' | 'confetti';
	readonly value: number;
};

type UpdateIntensity = {
	readonly plugin: 'nelio-ab-testing';
	readonly type: 'update-intensity';
	readonly mode: 'heatmap';
	readonly value: number;
};

// ==============
// USER INTERFACE
// ==============

export type ConfettiType =
	| 'country'
	| 'device'
	| 'os'
	| 'browser'
	| 'dayOfWeek'
	| 'hourOfDay'
	| 'timeToClick'
	| 'windowWidth';

export type ConfettiOption = {
	readonly color: string;
	readonly key: string;
	readonly label: string;
	readonly value: number;
};

export type HeatmapMode = 'heatmap' | 'scrollmap' | 'confetti';

export type HeatmapResolution = 'desktop' | 'tablet' | 'smartphone';

export type HeatmapLabels = {
	readonly averageFold: string;
	readonly clicksAbove: string;
	readonly popularity: string;
	readonly unknown: string;
};
