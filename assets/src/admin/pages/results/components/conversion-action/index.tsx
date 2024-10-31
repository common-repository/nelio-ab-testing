/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { find } from 'lodash';
import { store as NAB_ACTIONS } from '@nab/conversion-actions';
import { store as NAB_DATA } from '@nab/data';
import type {
	ConversionAction as CA,
	ConversionActionTypeName,
} from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';

export type ConversionActionProps = {
	readonly action: CA;
};

export const ConversionAction = ( {
	action,
}: ConversionActionProps ): JSX.Element | null => {
	const experiment = useActiveExperiment();
	const goalId = useActiveGoalId();
	const actionType = useConversionActionType( action.type );
	const goal = find( experiment?.goals, { id: goalId } );

	if ( ! actionType || ! experiment || ! goalId || ! goal ) {
		return null;
	} //end if

	const attributes = {
		...actionType.attributes,
		...action.attributes,
	};

	const View = actionType.view;
	const Icon = actionType.icon;
	const goalIndex = experiment.goals.map( ( g ) => g.id ).indexOf( goalId );

	return (
		<div className="nab-conversion-action__view">
			{ !! Icon ? (
				<Icon className="nab-conversion-action__icon" />
			) : (
				<Dashicon
					className="nab-conversion-action__icon nab-conversion-action__icon--invalid"
					icon="warning"
				/>
			) }
			<div className="nab-conversion-action__actual-view">
				{ !! View ? (
					<View
						attributes={ attributes }
						scope={ action.scope }
						experimentId={ experiment.id }
						goal={ goal.attributes }
						goalId={ goalId }
						goalIndex={ goalIndex }
					/>
				) : (
					<span>
						{ _x(
							'Invalid conversion action.',
							'text',
							'nelio-ab-testing'
						) }
					</span>
				) }
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useActiveExperiment = () =>
	useSelect( ( select ) =>
		select( NAB_DATA ).getExperiment(
			select( NAB_DATA ).getPageAttribute( 'editor/activeExperiment' ) ??
				0
		)
	);

const useConversionActionType = ( type: ConversionActionTypeName ) =>
	useSelect( ( select ) =>
		select( NAB_ACTIONS ).getConversionActionType( type )
	);

const useActiveGoalId = () => {
	const activeGoal = useSelect( ( select ) =>
		select( NAB_DATA ).getPageAttribute( 'editor/activeGoal' )
	);
	const firstGoal = useActiveExperiment()?.goals[ 0 ]?.id;
	return activeGoal || firstGoal;
};
