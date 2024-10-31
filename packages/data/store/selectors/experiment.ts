/**
 * External dependencies
 */
import { get } from 'lodash';
import type {
	Goal,
	GoalId,
	ECommercePlugin,
	Experiment,
	ExperimentId,
	Maybe,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { State } from '../types';

export function getExperiment(
	state: State,
	key?: ExperimentId
): Maybe< Experiment > {
	return key ? get( state.experiments, key ) : undefined;
} //end getExperiment()

export type GetExperimentAttributeFunction = < K extends keyof Experiment >(
	key: ExperimentId,
	attribute: K
) => Maybe< Experiment[ K ] >;

type GetExperimentAttribute = typeof _getExperimentAttribute & {
	CurriedSignature: < K extends keyof Experiment >(
		key: ExperimentId,
		attribute: K
	) => Maybe< Experiment[ K ] >;
};
export const getExperimentAttribute =
	_getExperimentAttribute as GetExperimentAttribute;
function _getExperimentAttribute< K extends keyof Experiment >(
	state: State,
	key: ExperimentId,
	attribute: K
): Maybe< Experiment[ K ] > {
	const experiment = getExperiment( state, key );
	if ( ! experiment ) {
		return;
	} //end if
	return experiment[ attribute ];
} //end _getExperimentAttribute()

export function getDefaultGoal(
	state: State,
	key: ExperimentId
): Maybe< Goal > {
	const experiment = getExperiment( state, key );
	if ( ! experiment ) {
		return;
	} //end if
	return experiment.goals[ 0 ];
} //end getDefaultGoal()

export function getECommercePlugin(
	state: State,
	key: ExperimentId,
	goalId?: GoalId
): Maybe< ECommercePlugin > {
	if ( isWooCommerceGoal( state, key, goalId ) ) {
		return 'woocommerce';
	} //end if

	if ( isEddGoal( state, key, goalId ) ) {
		return 'edd';
	} //end if

	return undefined;
} //end getECommercePlugin();

// ========
// INTERNAL
// ========

function isWooCommerceGoal(
	state: State,
	key: ExperimentId,
	goalId?: GoalId
): boolean {
	const experiment = getExperiment( state, key );
	if ( ! experiment ) {
		return false;
	} //end if

	goalId = goalId ?? getDefaultGoal( state, key )?.id;
	const goal = experiment.goals.find( ( g ) => g.id === goalId );
	if ( ! goal ) {
		return false;
	} //end if

	const actions = goal?.conversionActions ?? [];
	return (
		0 < actions.length &&
		actions.every( ( { type } ) => type === 'nab/wc-order' )
	);
} //end isWooCommerceGoal()

function isEddGoal(
	state: State,
	key: ExperimentId,
	goalId?: GoalId
): boolean {
	const experiment = getExperiment( state, key );
	if ( ! experiment ) {
		return false;
	} //end if

	goalId = goalId ?? getDefaultGoal( state, key )?.id;
	const goal = experiment.goals.find( ( g ) => g.id === goalId );
	if ( ! goal ) {
		return false;
	} //end if

	const actions = goal?.conversionActions ?? [];
	return (
		0 < actions.length &&
		actions.every( ( { type } ) => type === 'nab/edd-order' )
	);
} //end isEddGoal()
