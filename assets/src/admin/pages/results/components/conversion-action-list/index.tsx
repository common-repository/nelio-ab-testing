/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { find } from 'lodash';
import { store as NAB_DATA } from '@nab/data';

/**
 * Internal dependencies
 */
import { ConversionAction } from '../conversion-action';
import { useExperimentAttribute } from '../hooks';

export const ConversionActionList = (): JSX.Element | null => {
	const conversionActions = useConversionActions();
	const isRunning = 'running' === useExperimentAttribute( 'status' );

	if ( ! conversionActions.length ) {
		return null;
	} //end if

	return (
		<>
			{ isRunning ? (
				<p>
					{ _x(
						'After a visitor has seen the tested element, there’s a new conversion every time one of the following conversion actions occurs:',
						'text',
						'nelio-ab-testing'
					) }
				</p>
			) : (
				<p>
					{ _x(
						'After a visitor had seen the tested element, there was a new conversion every time one of the following conversion actions occurred:',
						'text',
						'nelio-ab-testing'
					) }
				</p>
			) }
			<div className="nab-conversion-action-list">
				{ conversionActions.map( ( action ) => (
					<ConversionAction key={ action.id } action={ action } />
				) ) }
			</div>
		</>
	);
};

// =====
// HOOKS
// =====

const useConversionActions = () => {
	const goals = useExperimentAttribute( 'goals' ) || [];
	const activeGoalId = useSelect(
		( select ) =>
			select( NAB_DATA ).getPageAttribute( 'editor/activeGoal' ) ??
			goals[ 0 ]?.id
	);
	return find( goals, { id: activeGoalId } )?.conversionActions || [];
};
