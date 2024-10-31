/**
 * External dependencies.
 */
import { values } from 'lodash';
import createSelector from 'rememo';
import type { Alternative, AlternativeId, Dict, Maybe } from '@nab/types';

/**
 * Internal dependencies.
 */
import type { State } from '../types';
import { isDefined } from '@nab/utils';

type GetAlternative = typeof _getAlternative & {
	CurriedSignature: < A extends Dict = Dict >(
		id: string
	) => Maybe< Alternative< A > >;
};
export const getAlternative = _getAlternative as GetAlternative;
function _getAlternative< A extends Dict = Dict >(
	state: State,
	id: AlternativeId
): Maybe< Alternative< A > > {
	return state.experiment.alternatives.byId[ id ] as Alternative< A >;
} //end getAlternative()

export const getAlternatives = createSelector(
	( state: State ): ReadonlyArray< Alternative > =>
		values( state.experiment.alternatives.byId ).filter( isDefined ),
	( state: State ) => [ state.experiment.alternatives.byId ]
);

export const getAlternativeIds = (
	state: State
): ReadonlyArray< AlternativeId > => state.experiment.alternatives.allIds;
