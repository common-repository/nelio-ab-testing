/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type { ExperimentType, ExperimentTypeName } from '@nab/types';

export type Action = AddExperimentTypes | RemoveExperimentTypes;

export function addExperimentTypes(
	experimentTypes: ExperimentType | ReadonlyArray< ExperimentType >
): AddExperimentTypes {
	return {
		type: 'ADD_EXPERIMENT_TYPES',
		experimentTypes: castArray( experimentTypes ),
	};
} //end addExperimentTypes()

export function removeExperimentTypes(
	names: ExperimentTypeName | ReadonlyArray< ExperimentTypeName >
): RemoveExperimentTypes {
	return {
		type: 'REMOVE_EXPERIMENT_TYPES',
		names: castArray( names ),
	};
} //end removeExperimentTypes()

// ============
// HELPER TYPES
// ============

type AddExperimentTypes = {
	readonly type: 'ADD_EXPERIMENT_TYPES';
	readonly experimentTypes: ReadonlyArray< ExperimentType >;
};

type RemoveExperimentTypes = {
	readonly type: 'REMOVE_EXPERIMENT_TYPES';
	readonly names: ReadonlyArray< ExperimentTypeName >;
};
