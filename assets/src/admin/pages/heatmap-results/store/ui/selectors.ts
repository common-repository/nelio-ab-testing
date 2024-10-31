/**
 * External dependencies
 */
import type {
	AlternativeIndex,
	ConfettiType,
	HeatmapMode,
	HeatmapResolution,
} from '@nab/types';

/**
 * Internal dependencies
 */
import type { State } from '../config';

export function getActiveAlternative( state: State ): AlternativeIndex {
	return state.ui.activeAlternative;
} //end getActiveAlternative()

export function getActiveFilter( state: State ): ConfettiType {
	return state.ui.activeFilter;
} //end getActiveFilter()

export function getActiveMode( state: State ): HeatmapMode {
	return state.ui.activeMode;
} //end getActiveMode()

export function getActiveResolution( state: State ): HeatmapResolution {
	return state.ui.activeResolution;
} //end getActiveResolution()

export function getDisabledFilterOptions(
	state: State
): ReadonlyArray< string > {
	return state.ui.disabledFilterOptions;
} //end getDisabledFilterOptions()

export function getIFrames( state: State ): ReadonlyArray< AlternativeIndex > {
	return state.ui.iframes;
} //end getIFrames()

export function getIntensity( state: State ): number {
	return state.ui.intensity;
} //end getIntensity()

export function isSidebarVisible( state: State ): boolean {
	return state.ui.isSidebarVisible;
} //end isSidebarVisible()

export function getOpacity( state: State ): number {
	return state.ui.opacity;
} //end getOpacity()
