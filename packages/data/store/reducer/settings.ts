/**
 * External dependencies
 */
import { keyBy, sortBy } from 'lodash';
import type { AnyAction } from '@nab/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { SettingsAction as Action } from '../actions/settings';

type State = FullState[ 'settings' ];

export function settings(
	state = INIT_STATE.settings,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end settings()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'SET_TODAY':
			return {
				...state,
				today: action.today,
			};

		case 'RECEIVE_MENUS':
			return {
				...state,
				menus: {
					...state.menus,
					...keyBy( action.menus, 'id' ),
				},
			};

		case 'RECEIVE_PLUGINS':
			return {
				...state,
				plugins: action.plugins || [],
			};

		case 'RECEIVE_TEMPLATE_CONTEXTS':
			return {
				...state,
				templateContexts: action.templateContexts,
			};

		case 'RECEIVE_TEMPLATES':
			return {
				...state,
				templates: action.templates,
			};

		case 'RECEIVE_THEMES':
			return {
				...state,
				themes: keyBy( action.themes, 'id' ),
			};

		case 'RECEIVE_PLUGIN_SETTINGS':
			return {
				...state,
				nelio: action.settings,
			};

		case 'RECEIVE_ECOMMERCE_SETTINGS':
			return {
				...state,
				ecommerce: {
					...state.ecommerce,
					[ action.ecommerce ]: {
						...action.settings,
						orderStatuses: sortBy(
							action.settings.orderStatuses,
							'label'
						),
					},
				},
			};
	} //end switch
} //end actualReducer()
