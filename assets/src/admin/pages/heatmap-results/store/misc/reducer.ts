/**
 * External dependencies
 */
import type { AnyAction } from '@nab/types';

/**
 * Internal dependencies
 */
import { INIT } from './config';
import type { MiscAction as Action } from './actions';
import type { State } from './config';

export function reducer( state = INIT, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'SET_FIRST_DAY_OF_WEEK':
			return {
				...state,
				firstDayOfWeek: action.day,
			};

		case 'SET_IFRAME_STATUS':
			return {
				...state,
				iframeStatus: {
					...state.iframeStatus,
					[ action.alternative ]: action.status,
				},
			};
	} //end switch
} //end actualReducer()
