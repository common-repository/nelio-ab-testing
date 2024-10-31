/**
 * External dependencies
 */
import type { AlternativeId, Experiment, ExperimentId } from '@nab/types';

export type ExperimentAction = ChangeLastAppliedAlternative | ReceiveExperiment;

export function changeLastAppliedAlternative(
	experimentId: ExperimentId,
	alternativeId: AlternativeId
): ChangeLastAppliedAlternative {
	return {
		type: 'CHANGE_LAST_APPLIED_ALTERNATIVE',
		experimentId,
		alternativeId,
	};
} //end receiveExperiment()

export function receiveExperiment(
	key: ExperimentId,
	experiment: Experiment
): ReceiveExperiment {
	return {
		type: 'RECEIVE_EXPERIMENT',
		key,
		experiment,
	};
} //end receiveExperiment()

// ============
// HELPER TYPES
// ============

type ChangeLastAppliedAlternative = {
	readonly type: 'CHANGE_LAST_APPLIED_ALTERNATIVE';
	readonly experimentId: ExperimentId;
	readonly alternativeId: AlternativeId;
};

type ReceiveExperiment = {
	readonly type: 'RECEIVE_EXPERIMENT';
	readonly key: ExperimentId;
	readonly experiment: Experiment;
};
