/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { AlternativeIndex, HeatmapLabels } from '@nab/types';

/**
 * Internal dependencies
 */
import type { State } from '../config';
import { IFrameStatus } from './config';

export function getFirstDayOfWeek( state: State ): number {
	return state.misc.firstDayOfWeek;
} //end getFirstDayOfWeek()

export function getIFrameStatus(
	state: State,
	alternative: AlternativeIndex
): IFrameStatus {
	return state.misc.iframeStatus[ alternative ] ?? 'waiting-script';
} //end getIFrameStatus()

export function getIFrameLabels( _: State ): HeatmapLabels {
	return {
		averageFold: _x( 'Average Fold:', 'text', 'nelio-ab-testing' ),
		clicksAbove: _x( 'Clicks above:', 'text', 'nelio-ab-testing' ),
		popularity: _x( 'Popularity:', 'text', 'nelio-ab-testing' ),
		unknown: _x( 'unknown', 'text', 'nelio-ab-testing' ),
	};
} //end
