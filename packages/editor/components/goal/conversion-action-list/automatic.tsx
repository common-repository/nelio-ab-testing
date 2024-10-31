/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { ConversionAction as CA, GoalId } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { ConversionAction } from '../conversion-action';
import { store as NAB_EDITOR } from '../../../store';

export const AutomaticConversionActionList = (): JSX.Element => {
	const goalId = useActiveGoalId();
	const conversionActions = useConversionActions( goalId );

	return (
		<div className="nab-conversion-action-list nab-conversion-action-list--automatic">
			{ 1 === conversionActions.length ? (
				<p
					key="conversion-action-explanation"
					className="nab-conversion-action-list__help"
				>
					{ _x(
						'By default, there will be a new conversion in this test when the following conversion action occurs after the visitor has seen the tested element:',
						'text',
						'nelio-ab-testing'
					) }
				</p>
			) : (
				<p
					key="conversion-action-explanation"
					className="nab-conversion-action-list__help"
				>
					{ _x(
						'Split tests are usually run with some specific goals in mind. In this type of test, there’s a new conversion when at least one of the following conversion actions occurs after the visitor has seen the tested element:',
						'text',
						'nelio-ab-testing'
					) }
				</p>
			) }
			{ goalId &&
				conversionActions.map( ( action ) => (
					<ConversionAction
						key={ action.id }
						goalId={ goalId }
						action={ action }
						readOnly={ true }
					/>
				) ) }
		</div>
	);
};

// =====
// HOOKS
// =====

const useActiveGoalId = () =>
	useSelect( ( select ) => select( NAB_EDITOR ).getActiveGoal()?.id );

const useConversionActions = ( goalId?: GoalId ): ReadonlyArray< CA > =>
	useSelect( ( select ) => {
		if ( ! goalId ) {
			return [];
		} //end if
		const { getConversionActions } = select( NAB_EDITOR );
		return getConversionActions( goalId ) || [];
	} );
