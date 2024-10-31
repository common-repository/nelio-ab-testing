/**
 * Internal dependencies
 */
import { State } from '../types';

type GetPageAttribute = typeof _getPageAttribute & {
	CurriedSignature: < K extends keyof State[ 'page' ] >(
		name: K
	) => State[ 'page' ][ K ];
};
export const getPageAttribute = _getPageAttribute as GetPageAttribute;
function _getPageAttribute< K extends keyof State[ 'page' ] >(
	state: State,
	name: K
): State[ 'page' ][ K ] {
	return state.page[ name ];
} //end _getPageAttribute()

export function isLocked( state: State ): boolean {
	return getPageAttribute( state, 'isLocked' );
} //end isLocked()
