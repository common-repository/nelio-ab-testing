/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { createInterpolateElement } from '@safe-wordpress/element';
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

export const ConversionActionList = (): JSX.Element => {
	const goalId = useActiveGoalId();
	const conversionActions = useConversionActions( goalId );

	return (
		<div className="nab-conversion-action-list">
			{ !! conversionActions.length && (
				<p key="conversion-action-explanation-1">
					{ _x(
						'After a visitor has seen the tested element, there’s a new conversion every time one of the following conversion actions occurs:',
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
					/>
				) ) }
			{ ! conversionActions.length && [
				<p
					key="conversion-action-explanation-1"
					className="nab-conversion-action-list__help"
				>
					{ _x(
						'Split tests are usually run with some specific goals in mind, such as “getting more subscribers” or “showing interest in your products.” Goals are fulfilled when the visitor performs certain actions. For instance, a visitor might be “showing interest in your products” when they visit your pricing page or they submit a certain form in your website.',
						'text',
						'nelio-ab-testing'
					) }
				</p>,
				<p
					key="conversion-action-explanation-2"
					className="nab-conversion-action-list__help"
				>
					{ createInterpolateElement(
						_x(
							'Use the buttons below to <strong>add the specific conversion actions</strong> that fulfill this goal.',
							'user',
							'nelio-ab-testing'
						),
						{
							strong: <strong />,
						}
					) }
				</p>,
			] }
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
