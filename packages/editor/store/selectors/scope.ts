/**
 * External dependencies
 */
import { values } from 'lodash';
import createSelector from 'rememo';
import { isDefined } from '@nab/utils';
import type { ScopeRule } from '@nab/types';

/**
 * Internal dependencies.
 */
import type { State } from '../types';

export const getScope = createSelector(
	( state: State ): ReadonlyArray< ScopeRule > =>
		values( state.experiment.scope ).filter( isDefined ),
	( state: State ) => [ state.experiment.scope ]
);
