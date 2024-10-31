/**
 * External dependencies
 */
import { reject } from 'lodash';
import type { AnyAction } from '@nab/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from './config';
import type { State } from './types';
import type { Action } from './actions';

export default function reducer(
	state = INIT_STATE,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'RECEIVE_ACCOUNT':
			return {
				...state,
				account: action.account,
			};

		case 'RECEIVE_INVOICES':
			return {
				...state,
				invoices: action.invoices,
			};

		case 'RECEIVE_SITES':
			return {
				...state,
				sites: action.sites,
			};

		case 'UNLINK_SITE':
			return {
				...state,
				sites: reject( state.sites, { id: action.id } ),
			};

		case 'LOCK_PAGE':
			return {
				...state,
				isPageLocked: true,
			};

		case 'UNLOCK_PAGE':
			return {
				...state,
				isPageLocked: false,
			};

		case 'ENABLE_AGENCY_FULL_VIEW':
			return {
				...state,
				isAgencyFullViewEnabled: true,
			};
	} //end switch
} //end actualReducer()
