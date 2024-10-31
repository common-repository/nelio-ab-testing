/**
 * External dependencies
 */
import type { Maybe, MediaId, Url } from '@nab/types';

/**
 * Internal dependencies
 */
import { State } from '../types';

export function getMediaUrl( state: State, id: MediaId ): Maybe< Url > {
	return state.media[ id ];
} //end getMediaUrl()
