/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { trim } from 'lodash';
import { store as NAB_DATA } from '@nab/data';
import type { GoalId } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { useExperimentAttribute } from '../hooks';

export const GoalList = (): JSX.Element => {
	const goals = useExperimentAttribute( 'goals' ) || [];
	const [ activeGoalId, setActiveGoalId ] = useActiveGoalId();

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
						onClick={ () => setActiveGoalId( goal.id ) }
					>
						{ trim( goal.attributes.name ) ||
							getDefaultGoalNameForIndex( index ) }
					</Button>
				</li>
			) ) }
		</ul>
	);
};

// =====
// HOOKS
// =====

const useActiveGoalId = () => {
	const goals = useExperimentAttribute( 'goals' ) || [];
	const value = useSelect(
		( select ) =>
			select( NAB_DATA ).getPageAttribute( 'editor/activeGoal' ) ??
			goals[ 0 ]?.id
	);

	const { setPageAttribute } = useDispatch( NAB_DATA );
	const setValue = ( goalId: GoalId ) =>
		setPageAttribute( 'editor/activeGoal', goalId );

	return [ value, setValue ] as const;
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
