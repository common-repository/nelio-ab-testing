/**
 * Internal dependencies
 */
import type { ExperimentData, HeatmapAttributes } from '../types';

export type ExperimentDataAction =
	| SetExperimentData
	| SetTestedElementAsInvalid;

export function setExperimentData(
	attributes: Partial< ExperimentData >
): SetExperimentData {
	return {
		type: 'UPDATE_EXPERIMENT_DATA',
		attributes,
	};
} //end setExperimentData()

export function setHeatmapData(
	attributes: Partial< HeatmapAttributes >
): SetExperimentData {
	return {
		type: 'UPDATE_EXPERIMENT_DATA',
		attributes,
	};
} //end setExperimentData()

export function setTestedElementAsInvalid(
	invalid: boolean
): SetTestedElementAsInvalid {
	return {
		type: 'SET_TESTED_ELEMENT_AS_INVALID',
		invalid,
	};
} //end setTestedElementAsInvalid()

// =====
// TYPES
// =====

type SetExperimentData = {
	readonly type: 'UPDATE_EXPERIMENT_DATA';
	readonly attributes: Partial< ExperimentData >;
};

type SetTestedElementAsInvalid = {
	readonly type: 'SET_TESTED_ELEMENT_AS_INVALID';
	readonly invalid: boolean;
};
