/**
 * External dependencies.
 */
import type { ExperimentId, ExperimentTypeName, Maybe } from '@nab/types';

/**
 * Internal dependencies.
 */
import type { ExperimentAttributes, HeatmapAttributes, State } from '../types';

export function getExperimentId( state: State ): ExperimentId {
	return state.experiment.data.id;
} //end getExperimentId()

export function getExperimentType( state: State ): ExperimentTypeName {
	return state.experiment.data.type;
} //end getExperimentType()

type GetExperimentAttribute = typeof _getExperimentAttribute & {
	CurriedSignature: < K extends keyof ExperimentAttributes >(
		attribute: K
	) => ExperimentAttributes[ K ];
};
export const getExperimentAttribute =
	_getExperimentAttribute as GetExperimentAttribute;
function _getExperimentAttribute< K extends keyof ExperimentAttributes >(
	state: State,
	attribute: K
): ExperimentAttributes[ K ] {
	return state.experiment.data[ attribute ];
} //end _getExperimentAttribute()

type GetHeatmapAttribute = typeof _getHeatmapAttribute & {
	CurriedSignature: < K extends keyof HeatmapAttributes >(
		attribute: K
	) => Maybe< HeatmapAttributes[ K ] >;
};
export const getHeatmapAttribute = _getHeatmapAttribute as GetHeatmapAttribute;
function _getHeatmapAttribute< K extends keyof HeatmapAttributes >(
	state: State,
	attribute: K
): Maybe< HeatmapAttributes[ K ] > {
	return state.experiment.data[ attribute ];
} //end _getHeatmapAttribute()

export function isTestedElementInvalid( state: State ): boolean {
	return !! state.experiment.data.isTestedElementInvalid;
} //end isTestedElementInvalid()
