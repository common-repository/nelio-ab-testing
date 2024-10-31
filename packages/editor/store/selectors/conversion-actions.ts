/**
 * External dependencies
 */
import { values } from 'lodash';
import createSelector from 'rememo';
import type { ConversionAction, GoalId } from '@nab/types';

/**
 * Internal dependencies.
 */
import type { State } from '../types';

export const getConversionActions = createSelector(
	( state: State, goalId: GoalId ): ReadonlyArray< ConversionAction > =>
		values( state.experiment.conversionActions[ goalId ] ),
	( state: State, goalId: GoalId ) => [
		state.experiment.conversionActions,
		goalId,
	]
);
