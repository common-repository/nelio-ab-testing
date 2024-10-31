/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type { Alternative, AlternativeId } from '@nab/types';

export type AlternativeAction =
	| AddAlternatives
	| RemoveAlternatives
	| ReplaceAlternatives
	| UpdateAlternative;

export function addAlternatives(
	alternatives: Alternative | ReadonlyArray< Alternative >
): AddAlternatives {
	return {
		type: 'ADD_ALTERNATIVES',
		alternatives: castArray( alternatives ),
	};
} //end addAlternatives()

export function removeAlternatives(
	ids: AlternativeId | ReadonlyArray< AlternativeId >
): RemoveAlternatives {
	return {
		type: 'REMOVE_ALTERNATIVES',
		ids: castArray( ids ),
	};
} //end removeAlternatives()

export function replaceAlternatives(
	oldIds: AlternativeId | ReadonlyArray< AlternativeId >,
	alternatives: Alternative | ReadonlyArray< Alternative >
): ReplaceAlternatives {
	return {
		type: 'REPLACE_ALTERNATIVES',
		oldIds: castArray( oldIds ),
		alternatives: castArray( alternatives ),
	};
} //end replaceAlternatives()

export function setAlternative(
	id: AlternativeId,
	alternative: Alternative
): UpdateAlternative {
	return {
		type: 'SET_ALTERNATIVE',
		id,
		alternative,
	};
} //end setAlternative()

// =====
// TYPES
// =====

type AddAlternatives = {
	readonly type: 'ADD_ALTERNATIVES';
	readonly alternatives: ReadonlyArray< Alternative >;
};

type RemoveAlternatives = {
	readonly type: 'REMOVE_ALTERNATIVES';
	readonly ids: ReadonlyArray< AlternativeId >;
};

type ReplaceAlternatives = {
	readonly type: 'REPLACE_ALTERNATIVES';
	readonly oldIds: ReadonlyArray< AlternativeId >;
	readonly alternatives: ReadonlyArray< Alternative >;
};

type UpdateAlternative = {
	readonly type: 'SET_ALTERNATIVE';
	readonly id: AlternativeId;
	readonly alternative: Alternative;
};
