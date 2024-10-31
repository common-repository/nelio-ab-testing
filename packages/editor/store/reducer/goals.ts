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
type State = FullState[ 'experiment' ][ 'goals' ];

import type { GoalAction } from '../actions/goals';
import type { SetupEditor } from '../actions/editor';
type Action = GoalAction | SetupEditor;

const INIT_STATE = IS.experiment.goals;

export function goals( state = INIT_STATE, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end goals()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'ADD_GOALS':
			return {
				...state,
				...keyBy( action.goals, 'id' ),
			};

		case 'UPDATE_GOAL': {
			const goal = state[ action.goalId ];
			if ( ! goal ) {
				return state;
			} //end if

			return {
				...state,
				[ action.goalId ]: {
					...goal,
					attributes: {
						...goal.attributes,
						...action.attributes,
					},
				},
			};
		}

		case 'REMOVE_GOALS':
			return omit( state, action.ids );

		case 'SETUP_EDITOR':
			if ( 'nab/heatmap' === action.experiment.type ) {
				return {};
			} //end if

			return keyBy(
				action.experiment.goals.map( ( g ) =>
					omit( g, 'conversionActions' )
				),
				'id'
			);
	} //end switch
} //end actualReducer()
