/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type { Goal, GoalId } from '@nab/types';

export type GoalAction = AddGoals | RemoveGoals | UpdateGoal;

export function addGoals( goals: Goal | ReadonlyArray< Goal > ): AddGoals {
	return {
		type: 'ADD_GOALS',
		goals: castArray( goals ),
	};
} //end addGoals()

export function removeGoals(
	ids: GoalId | ReadonlyArray< GoalId >
): RemoveGoals {
	return {
		type: 'REMOVE_GOALS',
		ids: castArray( ids ),
	};
} //end removeGoals()

export function updateGoal(
	goalId: GoalId,
	attributes: Partial< Goal[ 'attributes' ] >
): UpdateGoal {
	return {
		type: 'UPDATE_GOAL',
		goalId,
		attributes,
	};
} //end updateGoal()

// =====
// TYPES
// =====

type AddGoals = {
	readonly type: 'ADD_GOALS';
	readonly goals: ReadonlyArray< Goal >;
};

type RemoveGoals = {
	readonly type: 'REMOVE_GOALS';
	readonly ids: ReadonlyArray< GoalId >;
};

type UpdateGoal = {
	readonly type: 'UPDATE_GOAL';
	readonly goalId: GoalId;
	readonly attributes: Partial< Goal[ 'attributes' ] >;
};
