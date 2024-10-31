/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { createInterpolateElement, useEffect } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { findIndex, isEqual, omit } from 'lodash';
import { store as NAB_EXPERIMENTS } from '@nab/experiments';
import type {
	ConversionAction as CA,
	Goal as RealGoal,
	GoalId,
	Maybe,
} from '@nab/types';
type Goal = Omit< RealGoal, 'conversionActions' >;

/**
 * Internal dependencies
 */
import './style.scss';
import { Goal as GoalView } from '../goal';
import { GoalList } from '../goal-list';
import { useExperimentAttribute } from '../hooks';
import { store as NAB_EDITOR } from '../../store';

export const GoalSection = (): JSX.Element => {
	useAutoConversionActionsEffect();

	const goal = useActiveGoal();
	const goals = useGoals();
	const isExperimentPaused = useIsExperimentPaused();
	const numberOfGoals = goals.length;
	const isAutomatic = useIsActiveGoalAutomatic();
	const { removeGoals, setActiveGoal, updateGoal } =
		useDispatch( NAB_EDITOR );

	const canGoalBeRemoved = 1 < numberOfGoals && ! isExperimentPaused;

	const removeActiveGoal = () => {
		if ( ! goal ) {
			return;
		} //end if
		const nextGoal = getAdjacentGoal( goals, goal.id );
		if ( ! nextGoal ) {
			return;
		} //end if
		void setActiveGoal( nextGoal.id );
		void removeGoals( goal.id );
	};

	const updateActiveGoal = ( attributes: Partial< Goal[ 'attributes' ] > ) =>
		goal && updateGoal( goal.id, { ...goal.attributes, ...attributes } );

	return (
		<div className="nab-edit-experiment__goal-section">
			<h2>
				{ createInterpolateElement(
					sprintf(
						/* translators: dashicon */
						_x(
							'%s Conversion Goals and Actions',
							'text',
							'nelio-ab-testing'
						),
						'<icon></icon>'
					),
					{
						icon: (
							<Dashicon
								className="nab-goal-section__title-icon"
								icon="flag"
							/>
						),
					}
				) }
			</h2>

			<div className="nab-edit-experiment-goal-section__content">
				<GoalList />
				<GoalView
					name={ goal?.attributes.name ?? '' }
					setName={ ( name ) => updateActiveGoal( { name } ) }
					removeGoal={
						canGoalBeRemoved ? removeActiveGoal : undefined
					}
					isAutomatic={ isAutomatic }
				/>
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useActiveGoal = () =>
	useSelect( ( select ) => select( NAB_EDITOR ).getActiveGoal() );

const useGoals = () =>
	useSelect( ( select ) => select( NAB_EDITOR ).getGoals() );

const useIsExperimentPaused = () => {
	const [ status ] = useExperimentAttribute( 'status' );
	return ( status || '' ).includes( 'paused' );
};

const useIsActiveGoalAutomatic = () => {
	const goal = useActiveGoal();
	const goals = useGoals();
	return useSelect( ( select ): boolean => {
		const { getExperimentType } = select( NAB_EDITOR );
		const { hasExperimentSupport } = select( NAB_EXPERIMENTS );
		return (
			goal?.id === goals[ 0 ]?.id &&
			hasExperimentSupport( getExperimentType(), 'automaticGoalSetup' )
		);
	} );
};

const useAutoConversionActionsEffect = () => {
	const { replaceConversionActionsInGoal } = useDispatch( NAB_EDITOR );

	const goalId = useGoals()[ 0 ]?.id;
	const control = useSelect( ( select ) =>
		select( NAB_EDITOR ).getAlternative( 'control' )
	);
	const automaticGoalSetup = useSelect( ( select ) => {
		const { getExperimentType } = select( NAB_EDITOR );
		const { getExperimentSupport } = select( NAB_EXPERIMENTS );
		return getExperimentSupport(
			getExperimentType(),
			'automaticGoalSetup'
		);
	} );

	const conversionActions = useSelect( ( select ) => {
		select( NAB_EDITOR );
		return goalId
			? select( NAB_EDITOR ).getConversionActions( goalId )
			: [];
	} );

	useEffect( () => {
		if ( ! control || ! goalId || ! automaticGoalSetup ) {
			return;
		} //end if

		const auto = automaticGoalSetup( control.attributes );
		if ( isEqual( removeIds( conversionActions ), removeIds( auto ) ) ) {
			return;
		} //end if

		void replaceConversionActionsInGoal( goalId, auto );
	}, [ automaticGoalSetup, goalId, control ] );
};

// =======
// HELPERS
// =======

function getAdjacentGoal(
	goals: ReadonlyArray< Goal >,
	goalId: GoalId
): Maybe< Goal > {
	const index = findIndex( goals, { id: goalId } );
	if ( index === goals.length - 1 ) {
		return goals[ index - 1 ];
	} //end if
	return goals[ index + 1 ];
} //end getAdjacentGoal()

const removeIds = (
	conversionActions: ReadonlyArray< CA >
): ReadonlyArray< Omit< CA, 'id' > > =>
	conversionActions.map( ( ca ) => omit( ca, 'id' ) );
