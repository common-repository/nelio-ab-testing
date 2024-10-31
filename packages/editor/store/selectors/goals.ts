/**
 * External dependencies
 */
import { values } from 'lodash';
import createSelector from 'rememo';
import type { Goal } from '@nab/types';
import { isDefined } from '@nab/utils';

/**
 * Internal dependencies.
 */
import type { State } from '../types';

export const getGoals = createSelector(
	( state: State ): ReadonlyArray< Omit< Goal, 'conversionActions' > > =>
		values( state.experiment.goals ).filter( isDefined ),
	( state: State ) => [ state.experiment.goals ]
);
