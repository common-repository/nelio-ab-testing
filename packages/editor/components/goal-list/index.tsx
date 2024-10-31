/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dashicon } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { trim } from 'lodash';
import { usePluginSetting } from '@nab/data';
import { createGoal } from '@nab/utils';

/**
 * Internal dependencies
 */
import './style.scss';
import { useExperimentAttribute } from '../hooks';
import { store as NAB_EDITOR } from '../../store';

export const GoalList = (): JSX.Element => {
	const activeGoalId = useActiveGoalId();
	const goals = useGoals();
	const isExperimentPaused = useIsExperimentPaused();
	const isSubscribed = !! usePluginSetting( 'subscription' );

	const { setActiveGoal, addGoals } = useDispatch( NAB_EDITOR );

	return (
		<ul className="nab-goal-list">
			{ goals.map( ( goal, index ) => (
				<li
					key={ goal.id }
					className={ classnames( 'nab-goal-list__item', {
						'nab-goal-list__item--is-active':
							goal.id === activeGoalId,
					} ) }
				>
					<Button
						disabled={ goal.id === activeGoalId }
						onClick={ () => setActiveGoal( goal.id ) }
					>
						{ trim( goal.attributes.name ) ||
							getDefaultGoalNameForIndex( index ) }
					</Button>
				</li>
			) ) }

			{ ! isExperimentPaused && isSubscribed && (
				<li className="nab-goal-list__add-new-goal" key="add-new-goal">
					<Button
						className="nab-goal-list__add-new-goal-button"
						variant="link"
						onClick={ () => {
							const goal = createGoal();
							void addGoals( goal );
							void setActiveGoal( goal.id );
						} }
					>
						<Dashicon icon="plus" />
						<span>
							{ _x(
								'New',
								'command (goal)',
								'nelio-ab-testing'
							) }
						</span>
					</Button>
				</li>
			) }
		</ul>
	);
};

// =====
// HOOKS
// =====

const useActiveGoalId = () =>
	useSelect( ( select ) => select( NAB_EDITOR ).getActiveGoal()?.id );

const useGoals = () =>
	useSelect( ( select ) => select( NAB_EDITOR ).getGoals() );

const useIsExperimentPaused = () => {
	const [ status ] = useExperimentAttribute( 'status' );
	return ( status || '' ).includes( 'paused' );
};

// =======
// HELPERS
// =======

function getDefaultGoalNameForIndex( index: number ) {
	return index
		? sprintf(
				/* translators: a number */
				_x( 'Goal %d', 'text', 'nelio-ab-testing' ),
				index + 1
		  )
		: _x( 'Default Goal', 'text', 'nelio-ab-testing' );
} //end getDefaultGoalNameForIndex()
