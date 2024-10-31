/**
 * External dependencies
 */
import type { ExperimentId, Results } from '@nab/types';

export type ResultsAction = ReceiveExperimentResult;

export function receiveExperimentResult(
	key: ExperimentId,
	result: Results
): ReceiveExperimentResult {
	return {
		type: 'RECEIVE_RESULT',
		key,
		result,
	};
} //end receiveExperimentResult()

// ============
// HELPER TYPES
// ============

type ReceiveExperimentResult = {
	readonly type: 'RECEIVE_RESULT';
	readonly key: ExperimentId;
	readonly result: Results;
};
