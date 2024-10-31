/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type {
	ConversionAction,
	ConversionActionScope,
	ConversionActionId,
	GoalId,
	Maybe,
} from '@nab/types';

export type CAAction =
	| AddConversionActionsIntoGoal
	| ReplaceConversionActionsInGoal
	| RemoveConversionActionsFromGoal
	| UpdateConversionAction;

export function addConversionActionsIntoGoal(
	goalId: GoalId,
	conversionActions: ConversionAction | ReadonlyArray< ConversionAction >
): AddConversionActionsIntoGoal {
	return {
		type: 'ADD_CONVERSION_ACTIONS_INTO_GOAL',
		goalId,
		conversionActions: castArray( conversionActions ),
	};
} //end addConversionActionsIntoGoal()

export function replaceConversionActionsInGoal(
	goalId: GoalId,
	conversionActions: ConversionAction | ReadonlyArray< ConversionAction >
): ReplaceConversionActionsInGoal {
	return {
		type: 'REPLACE_CONVERSION_ACTIONS_IN_GOAL',
		goalId,
		conversionActions: castArray( conversionActions ),
	};
} //end replaceConversionActionsInGoal()

export function removeConversionActionsFromGoal(
	goalId: GoalId,
	conversionActionIds:
		| ConversionActionId
		| ReadonlyArray< ConversionActionId >
): RemoveConversionActionsFromGoal {
	return {
		type: 'REMOVE_CONVERSION_ACTIONS_FROM_GOAL',
		goalId,
		conversionActionIds: castArray( conversionActionIds ),
	};
} //end removeConversionActionsFromGoal()

export function updateConversionAction(
	goalId: GoalId,
	conversionActionId: ConversionActionId,
	attributes: Maybe< ConversionAction[ 'attributes' ] >,
	scope: Maybe< ConversionActionScope >
): UpdateConversionAction {
	return {
		type: 'UPDATE_CONVERSION_ACTION',
		goalId,
		conversionActionId,
		attributes,
		scope,
	};
} //end updateConversionAction()

// =====
// TYPES
// =====

type AddConversionActionsIntoGoal = {
	readonly type: 'ADD_CONVERSION_ACTIONS_INTO_GOAL';
	readonly goalId: GoalId;
	readonly conversionActions: ReadonlyArray< ConversionAction >;
};

type ReplaceConversionActionsInGoal = {
	readonly type: 'REPLACE_CONVERSION_ACTIONS_IN_GOAL';
	readonly goalId: GoalId;
	readonly conversionActions: ReadonlyArray< ConversionAction >;
};

type RemoveConversionActionsFromGoal = {
	readonly type: 'REMOVE_CONVERSION_ACTIONS_FROM_GOAL';
	readonly goalId: GoalId;
	readonly conversionActionIds: ReadonlyArray< ConversionActionId >;
};

type UpdateConversionAction = {
	readonly type: 'UPDATE_CONVERSION_ACTION';
	readonly goalId: GoalId;
	readonly conversionActionId: ConversionActionId;
	readonly attributes: Maybe< ConversionAction[ 'attributes' ] >;
	readonly scope: Maybe< ConversionActionScope >;
};
