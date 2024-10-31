/**
 * External dependencies
 */
import type { AnyAction } from '@nab/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { ResultsAction as Action } from '../actions/results';

type State = FullState[ 'results' ];

export function results(
	state = INIT_STATE.results,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end results()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'RECEIVE_RESULT':
			return {
				...state,
				[ action.key ]: action.result,
			};
	} //end switch
} //end actualReducer()
