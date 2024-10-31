/**
 * External dependencies
 */
import type {
	AlternativeIndex,
	ConfettiType,
	HeatmapMode,
	HeatmapResolution,
} from '@nab/types';

export type UIAction =
	| SetActiveAlternative
	| SetActiveFilter
	| SetActiveMode
	| SetActiveResolution
	| SetDisabledFilterOptions
	| SetIntensity
	| MakeSidebarVisible
	| SetOpacity;

export function setActiveAlternative(
	alternative: AlternativeIndex
): SetActiveAlternative {
	return {
		type: 'SET_ACTIVE_ALTERNATIVE',
		alternative,
	};
} //end setActiveAlternative()

export function setActiveFilter( filter: ConfettiType ): SetActiveFilter {
	return {
		type: 'SET_ACTIVE_FILTER',
		filter,
	};
} //end setActiveFilter()

export function setActiveMode( mode: HeatmapMode ): SetActiveMode {
	return {
		type: 'SET_ACTIVE_MODE',
		mode,
	};
} //end setActiveMode()

export function setActiveResolution(
	resolution: HeatmapResolution
): SetActiveResolution {
	return {
		type: 'SET_ACTIVE_RESOLUTION',
		resolution,
	};
} //end setActiveResolution()

export function setDisabledFilterOptions(
	disabledFilterOptions: ReadonlyArray< string >
): SetDisabledFilterOptions {
	return {
		type: 'SET_DISABLED_FILTER_OPTIONS',
		disabledFilterOptions,
	};
} //end setDisabledFilterOptions()

export function setIntensity( intensity: number ): SetIntensity {
	return {
		type: 'SET_INTENSITY',
		intensity,
	};
} //end setIntensity()

export function makeSidebarVisible(
	isSidebarVisible: boolean
): MakeSidebarVisible {
	return {
		type: 'MAKE_SIDEBAR_VISIBLE',
		isSidebarVisible,
	};
} //end makeSidebarVisible()

export function setOpacity( opacity: number ): SetOpacity {
	return {
		type: 'SET_OPACITY',
		opacity,
	};
} //end setOpacity()

// ============
// HELPER TYPES
// ============

type SetActiveAlternative = {
	readonly type: 'SET_ACTIVE_ALTERNATIVE';
	readonly alternative: AlternativeIndex;
};

type SetActiveFilter = {
	readonly type: 'SET_ACTIVE_FILTER';
	readonly filter: ConfettiType;
};

type SetActiveMode = {
	readonly type: 'SET_ACTIVE_MODE';
	readonly mode: HeatmapMode;
};

type SetActiveResolution = {
	readonly type: 'SET_ACTIVE_RESOLUTION';
	readonly resolution: HeatmapResolution;
};

type SetDisabledFilterOptions = {
	readonly type: 'SET_DISABLED_FILTER_OPTIONS';
	readonly disabledFilterOptions: ReadonlyArray< string >;
};

type SetIntensity = {
	readonly type: 'SET_INTENSITY';
	readonly intensity: number;
};

type MakeSidebarVisible = {
	readonly type: 'MAKE_SIDEBAR_VISIBLE';
	readonly isSidebarVisible: boolean;
};

type SetOpacity = {
	readonly type: 'SET_OPACITY';
	readonly opacity: number;
};
