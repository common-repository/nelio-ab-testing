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
		case 'ADD_CONVERSION_ACTION_TYPES':
			return {
				...state,
				conversionActionTypes: {
					...state.conversionActionTypes,
					...keyBy( action.conversionActionTypes, 'name' ),
				},
			};

		case 'REMOVE_CONVERSION_ACTION_TYPES':
			return {
				...state,
				conversionActionTypes: omit(
					state.conversionActionTypes,
					action.names
				),
			};
	} //end switch
} //end actualReducer()
