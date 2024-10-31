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
		case 'ADD_SEGMENTATION_RULE_TYPES':
			return {
				...state,
				segmentationRuleTypes: {
					...state.segmentationRuleTypes,
					...keyBy( action.segmentationRuleTypes, 'name' ),
				},
			};

		case 'REMOVE_SEGMENTATION_RULE_TYPES':
			return {
				...state,
				segmentationRuleTypes: omit(
					state.segmentationRuleTypes,
					action.names
				),
			};

		case 'ADD_SEGMENTATION_RULE_TYPE_CATEGORIES':
			return {
				...state,
				categories: {
					...state.categories,
					...keyBy( action.categories, 'name' ),
				},
			};

		case 'REMOVE_SEGMENTATION_RULE_TYPE_CATEGORIES':
			return {
				...state,
				categories: omit( state.categories, action.names ),
			};
	} //end switch
} //end actualReducer()
