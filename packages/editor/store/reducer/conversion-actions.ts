/**
 * External dependencies
 */
import { keyBy, omit } from 'lodash';
import type { AnyAction } from '@nab/types';

/**
 * Internal dependencies
 */
import { INIT_STATE as IS } from '../config';

import type { State as FullState } from '../types';
type State = FullState[ 'experiment' ][ 'conversionActions' ];

import type { CAAction } from '../actions/conversion-actions';
import type { SetupEditor } from '../actions/editor';
type Action = CAAction | SetupEditor;

const INIT_STATE = IS.experiment.conversionActions;

export function conversionActions(
	state = INIT_STATE,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end conversionActions()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'ADD_CONVERSION_ACTIONS_INTO_GOAL':
			return {
				...state,
				[ action.goalId ]: {
					...state[ action.goalId ],
					...keyBy( action.conversionActions, 'id' ),
				},
			};

		case 'REPLACE_CONVERSION_ACTIONS_IN_GOAL':
			return {
				...state,
				[ action.goalId ]: {
					...keyBy( action.conversionActions, 'id' ),
				},
			};

		case 'UPDATE_CONVERSION_ACTION': {
			const goal = state[ action.goalId ];
			if ( ! goal ) {
				return state;
			} //end if

			const oldConversionAction = goal[ action.conversionActionId ];
			if ( ! oldConversionAction ) {
				return state;
			} //end if

			return {
				...state,
				[ action.goalId ]: {
					...goal,
					[ action.conversionActionId ]: {
						...oldConversionAction,
						attributes: action.attributes
							? {
									...oldConversionAction.attributes,
									...action.attributes,
							  }
							: oldConversionAction.attributes,
						scope: action.scope
							? action.scope
							: oldConversionAction.scope,
					},
				},
			};
		}

		case 'REMOVE_CONVERSION_ACTIONS_FROM_GOAL':
			return {
				...state,
				[ action.goalId ]: omit(
					state[ action.goalId ],
					action.conversionActionIds
				),
			};

		case 'SETUP_EDITOR':
			if ( 'nab/heatmap' === action.experiment.type ) {
				return {};
			} //end if

			return action.experiment.goals.reduce( ( memo, goal ) => {
				memo[ goal.id ] = keyBy( goal.conversionActions, 'id' );
				return memo;
			}, {} as State );
	} //end switch
} //end actualReducer()
