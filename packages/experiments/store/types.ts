/**
 * External dependencies
 */
import type { ExperimentType, ExperimentTypeName } from '@nab/types';

export type State = {
	readonly experimentTypes: Record< ExperimentTypeName, ExperimentType >;
};
