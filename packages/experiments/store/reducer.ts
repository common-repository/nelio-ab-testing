/**
 * External dependencies
 */
import { keyBy, omit } from 'lodash';
import type { AnyAction } from '@nab/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from './config';
import type { Action } from './actions';
import type { State } from './types';

export function reducer( state = INIT_STATE, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'ADD_EXPERIMENT_TYPES':
			return {
				...state,
				experimentTypes: {
					...state.experimentTypes,
					...keyBy( action.experimentTypes, 'name' ),
				},
			};

		case 'REMOVE_EXPERIMENT_TYPES':
			return {
				...state,
				experimentTypes: omit( state.experimentTypes, action.names ),
			};
	} //end switch
} //end actualReducer()
