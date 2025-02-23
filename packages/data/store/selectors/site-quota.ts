/**
 * External dependencies
 */
import type { Maybe, Quota } from '@nab/types';

/**
 * Internal dependencies
 */
import { State } from '../types';

export function getQuota( state: State ): Maybe< Quota > {
	return state.siteQuota;
} //end getQuota()
