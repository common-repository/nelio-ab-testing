/**
 * External dependencies
 */
import type { AnyAction } from '@nab/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { MediaAction as Action } from '../actions/media';

type State = FullState[ 'media' ];

export function media( state = INIT_STATE.media, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end media()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'RECEIVE_MEDIA_URL':
			return {
				...state,
				[ action.id ]: action.url,
			};
	} //end switch
} //end actualReducer()
