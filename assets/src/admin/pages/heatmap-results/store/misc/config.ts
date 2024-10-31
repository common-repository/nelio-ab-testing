/**
 * External dependencies
 */
import type { AlternativeIndex } from '@nab/types';

export type State = {
	readonly firstDayOfWeek: number;
	readonly iframeStatus: Record< AlternativeIndex, IFrameStatus >;
};

export const INIT: State = {
	firstDayOfWeek: 0,
	iframeStatus: { 0: 'waiting-script' },
};

export type IFrameStatus =
	| 'waiting-script'
	| 'script-ready'
	| 'page-ready'
	| 'script-not-found';
