/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dashicon, PanelBody } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { useCallback, useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { noop } from 'lodash';
import { store as NAB_ACTIONS } from '@nab/conversion-actions';
import { getConversionActionScopeError, isEmpty } from '@nab/utils';
import type {
	ConversionAction as CA,
	ConversionActionId,
	ConversionActionScope,
	ConversionActionTypeName,
	GoalId,
	Maybe,
} from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NAB_EDITOR } from '../../../store';

export type ConversionActionProps = {
	readonly readOnly?: boolean;
	readonly action: CA;
	readonly goalId: GoalId;
};

export const ConversionAction = ( {
	readOnly,
	action,
	goalId,
}: ConversionActionProps ): JSX.Element | null => {
	const experimentId = useExperimentId();
	const goal = useActiveGoal();
	const goalIndex = useActiveGoalIndex();
	const actionType = useConversionActionType( action.type );

	const View = actionType?.view;
	const Edit = actionType?.edit;
	const Icon = actionType?.icon;
	const attributes = action?.attributes || {};
	const scope = action?.scope || { type: 'test-scope' };
	const validate = actionType?.validate ?? ( () => ( {} ) );

	const errors = {
		...validate( attributes ),
		_scope: getConversionActionScopeError( scope ),
	};
	const [ initialOpen ] = useState( ! isEmpty( errors ) );

	const { setAttributes, setScope } = useUpdater( goalId, action.id );
	const remove = useRemove( goalId, action.id );

	if ( ! goal ) {
		return null;
	} //end if

	if ( readOnly ) {
		return (
			<div className="nab-conversion-action">
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
								scope={ scope }
								experimentId={ experimentId }
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
			</div>
		);
	} //end if

	return (
		<PanelBody
			className="nab-conversion-action"
			initialOpen={ initialOpen }
			title={
				(
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
									scope={ scope }
									experimentId={ experimentId }
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
				 ) as unknown as string
			}
		>
			<div className="nab-conversion-action__edit">
				{ !! Edit ? (
					<Edit
						attributes={ attributes }
						scope={ scope }
						experimentId={ experimentId }
						goal={ goal.attributes }
						goalId={ goalId }
						goalIndex={ goalIndex }
						setAttributes={ setAttributes }
						setScope={ setScope }
						errors={ errors }
					/>
				) : (
					<span>
						{ _x(
							'This conversion action can’t be properly loaded. Please consider removing it.',
							'text',
							'nelio-ab-testing'
						) }
					</span>
				) }
			</div>

			<Button
				variant="link"
				isDestructive
				onClick={ remove }
				className="nab-conversion-action__delete-button"
			>
				{ _x( 'Delete', 'command', 'neli-ab-testing' ) }
			</Button>
		</PanelBody>
	);
};

// =====
// HOOKS
// =====

const useExperimentId = () =>
	useSelect( ( select ) => select( NAB_EDITOR ).getExperimentId() );

const useActiveGoal = () =>
	useSelect( ( select ) => select( NAB_EDITOR ).getActiveGoal() );

const useActiveGoalIndex = () =>
	useSelect( ( select ) => select( NAB_EDITOR ).getActiveGoalIndex() );

const useConversionActionType = ( type: ConversionActionTypeName ) =>
	useSelect( ( select ) =>
		select( NAB_ACTIONS ).getConversionActionType( type )
	);

const useUpdater = ( goalId: GoalId, actionId: ConversionActionId ) => {
	const { updateConversionAction } = useDispatch( NAB_EDITOR );
	const update = (
		attributes: Maybe< Partial< CA[ 'attributes' ] > >,
		scope: Maybe< ConversionActionScope >
	) => updateConversionAction( goalId, actionId, attributes, scope );

	const setAttributes = useCallback(
		( attributes: Partial< CA[ 'attributes' ] > ) =>
			update( attributes, undefined ),
		[ goalId, actionId ]
	);

	const setScope = useCallback(
		( scope: ConversionActionScope ) => update( undefined, scope ),
		[ goalId, actionId ]
	);

	return {
		setAttributes: goalId && actionId ? setAttributes : noop,
		setScope: goalId && actionId ? setScope : noop,
	};
};

const useRemove = ( goalId: GoalId, actionId: ConversionActionId ) => {
	const { removeConversionActionsFromGoal } = useDispatch( NAB_EDITOR );
	return goalId && actionId
		? () => removeConversionActionsFromGoal( goalId, actionId )
		: noop;
};
