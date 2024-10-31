/**
 * Internal dependencies
 */
import { INIT_STATE as IS } from '../config';

/**
 * External dependencies
 */
import type { AnyAction } from '@nab/types';

import type { State as FullState } from '../types';
type State = FullState[ 'editor' ];

import type { EditorAction as Action } from '../actions/editor';

const INIT_STATE = IS.editor;

export function editor( state = INIT_STATE, action: AnyAction ): State {
	state = { ...state, hasExperimentBeenRecentlySaved: false };
	return actualReducer( state, action as Action ) ?? state;
} //end editor()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'SET_ACTIVE_GOAL':
			return {
				...state,
				activeGoalId: action.goalId,
			};

		case 'SET_ACTIVE_SEGMENT':
			return {
				...state,
				activeSegmentId: action.segmentId,
			};

		case 'SET_EXPERIMENT_AS_BEING_SAVED':
			return {
				...state,
				isExperimentBeingSaved: !! action.status,
			};

		case 'SET_EXPERIMENT_AS_RECENTLY_SAVED':
			return {
				...state,
				hasExperimentBeenRecentlySaved: true,
			};

		case 'SET_DRAFT_STATUS_RATIONALE':
			return {
				...state,
				draftStatusRationale: action.rationale,
			};

		case 'OPEN_ALTERNATIVE_PREVIEWER':
			return {
				...state,
				alternativePreviewerUrl: action.url,
			};

		case 'CLOSE_ALTERNATIVE_PREVIEWER':
			return {
				...state,
				alternativePreviewerUrl: '',
			};

		case 'SETUP_EDITOR':
			return state;
	} //end switch
} //end actualReducer()
