/**
 * Internal dependencies
 */
import type { State } from '../types';

export type PageAction = SetPageAttributeAction | Lock | Unlock;

export function setPageAttribute< K extends keyof State[ 'page' ] >(
	name: K,
	value: State[ 'page' ][ K ]
): SetPageAttributeAction< K > {
	return {
		type: 'SET_PAGE_ATTRIBUTE',
		name,
		value,
	};
} //end setPageAttribute()

export function lock(): Lock {
	return {
		type: 'LOCK_UI',
	};
} //end lock()

export function unlock(): Unlock {
	return {
		type: 'UNLOCK_UI',
	};
} //end lock()

// ============
// HELPER TYPES
// ============

type SetPageAttributeAction<
	K extends keyof State[ 'page' ] = keyof State[ 'page' ],
> = {
	readonly type: 'SET_PAGE_ATTRIBUTE';
	readonly name: K;
	readonly value: State[ 'page' ][ K ];
};

type Lock = {
	readonly type: 'LOCK_UI';
};

type Unlock = {
	readonly type: 'UNLOCK_UI';
};
