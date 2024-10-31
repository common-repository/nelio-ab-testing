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
type State = FullState[ 'experiment' ][ 'scope' ];

import type { ScopeAction } from '../actions/scope';
import type { SetupEditor } from '../actions/editor';
type Action = ScopeAction | SetupEditor;

const INIT_STATE = IS.experiment.scope;

export function scope( state = INIT_STATE, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end scope()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'ADD_SCOPE_RULES':
			return {
				...state,
				...keyBy( action.rules, 'id' ),
			};

		case 'REMOVE_SCOPE_RULES':
			return omit( state, action.ids );

		case 'SETUP_EDITOR':
			if ( 'nab/heatmap' === action.experiment.type ) {
				return {};
			} //end if

			return keyBy( action.experiment.scope, 'id' );
	} //end switch
} //end actualReducer()
