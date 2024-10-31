/**
 * External dependencies
 */
import { uniq } from 'lodash';
import type { AnyAction } from '@nab/types';

/**
 * Internal dependencies
 */
import { INIT } from './config';
import type { UIAction as Action } from './actions';
import type { State } from './config';

export function reducer( state = INIT, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'SET_ACTIVE_ALTERNATIVE':
			return {
				...state,
				activeAlternative: action.alternative,
				iframes: uniq( [ ...state.iframes, action.alternative ] ),
			};

		case 'SET_ACTIVE_FILTER':
			return {
				...state,
				activeFilter: action.filter,
			};

		case 'SET_ACTIVE_MODE':
			return {
				...state,
				activeMode: action.mode,
			};

		case 'SET_ACTIVE_RESOLUTION':
			return {
				...state,
				activeResolution: action.resolution,
			};

		case 'SET_DISABLED_FILTER_OPTIONS':
			return {
				...state,
				disabledFilterOptions: action.disabledFilterOptions,
			};

		case 'SET_INTENSITY':
			return {
				...state,
				intensity: action.intensity,
			};

		case 'MAKE_SIDEBAR_VISIBLE':
			return {
				...state,
				isSidebarVisible: action.isSidebarVisible,
			};

		case 'SET_OPACITY':
			return {
				...state,
				opacity: action.opacity,
			};
	} //end switch
} //end actualReducer()
