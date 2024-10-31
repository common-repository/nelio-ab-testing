/**
 * External dependencies
 */
import type { AnyAction } from '@nab/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from './config';
import type { State } from './types';
import type { Action } from './actions';

export function reducer( state = INIT_STATE, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'SET_FIELD_VALUE':
			return {
				...state,
				values: {
					...state.values,
					[ action.field ]: action.value,
				},
			};

		case 'SET_FIELD_ATTRIBUTES':
			return {
				...state,
				attributes: {
					...state.attributes,
					[ action.field ]: {
						...state.attributes[ action.field ],
						...action.attributes,
					},
				},
			};
	} //end switch
} //end actualReducer()
