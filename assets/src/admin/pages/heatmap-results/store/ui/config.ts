/**
 * External dependencies
 */
import type {
	AlternativeIndex,
	ConfettiType,
	HeatmapMode,
	HeatmapResolution,
} from '@nab/types';

export type State = {
	readonly activeAlternative: AlternativeIndex;
	readonly activeFilter: ConfettiType;
	readonly activeMode: HeatmapMode;
	readonly activeResolution: HeatmapResolution;
	readonly disabledFilterOptions: ReadonlyArray< string >;
	readonly iframes: ReadonlyArray< AlternativeIndex >;
	readonly intensity: number;
	readonly isSidebarVisible: boolean;
	readonly opacity: number;
};

export const INIT: State = {
	activeAlternative: 0,
	activeFilter: 'timeToClick',
	activeMode: 'heatmap',
	activeResolution: 'desktop',
	disabledFilterOptions: [],
	iframes: [],
	intensity: 60,
	isSidebarVisible: true,
	opacity: 70,
};
