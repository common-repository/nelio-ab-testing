/**
 * External dependencies
 */
import type { AnyAction } from '@nab/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { FastSpringAction as Action } from '../actions/fastspring';

type State = FullState[ 'fastspring' ];

export function fastspring(
	state = INIT_STATE.fastspring,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end fastspring()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'RECEIVE_FS_CURRENCY':
			return {
				...state,
				currency: action.currency,
			};

		case 'RECEIVE_FS_PRODUCTS':
			return {
				...state,
				products: action.products,
			};

		case 'RECEIVE_FS_SUBSCRIPTION_ID':
			return {
				...state,
				subscriptionId: action.subscriptionId,
			};
	} //end switch
} //end actualReducer()
