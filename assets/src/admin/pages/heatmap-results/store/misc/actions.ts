/**
 * External dependencies
 */
import type { AlternativeIndex } from '@nab/types';

/**
 * Internal dependencies
 */
import type { IFrameStatus } from './config';

export type MiscAction = SetFirstDayOfWeek | SetIFrameStatus;

export function setFirstDayOfWeek( day: number ): SetFirstDayOfWeek {
	return {
		type: 'SET_FIRST_DAY_OF_WEEK',
		day,
	};
} //end setFirstDayOfWeek()

export function setIFrameStatus(
	alternative: AlternativeIndex,
	status: IFrameStatus
): SetIFrameStatus {
	return {
		type: 'SET_IFRAME_STATUS',
		alternative,
		status,
	};
} //end setIFrameStatus()

// ============
// HELPER TYPES
// ============

type SetFirstDayOfWeek = {
	readonly type: 'SET_FIRST_DAY_OF_WEEK';
	readonly day: number;
};

type SetIFrameStatus = {
	readonly type: 'SET_IFRAME_STATUS';
	readonly alternative: AlternativeIndex;
	readonly status: IFrameStatus;
};
