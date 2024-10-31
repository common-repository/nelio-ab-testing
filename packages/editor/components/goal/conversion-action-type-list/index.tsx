/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, ExternalLink, Tooltip } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { every, filter, find, without } from 'lodash';
import {
	store as NAB_ACTIONS,
	createConversionAction as createConversionActionWithDefaults,
} from '@nab/conversion-actions';
import { usePluginSetting } from '@nab/data';
import { addFreeTracker } from '@nab/utils';
import type {
	ConversionAction as CA,
	ConversionActionTypeName,
	GoalId,
} from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NAB_EDITOR } from '../../../store';

export const ConversionActionTypeList = (): JSX.Element => {
	const isSubscribed = !! usePluginSetting( 'subscription' );
	const goalId = useActiveGoalId();
	const hasConversionActions = !! useConversionActions( goalId ).length;
	const conversionActionTypes = useConversionActionTypes();
	const { addConversionActionsIntoGoal } = useDispatch( NAB_EDITOR );

	if ( ! isSubscribed && hasConversionActions ) {
		return (
			<div className="nab-conversion-action-type-list">
				<ExternalLink
					className="components-button is-secondary"
					href={ addFreeTracker(
						_x(
							'https://neliosoftware.com/testing/pricing/',
							'text',
							'nelio-ab-testing'
						)
					) }
				>
					{ _x(
						'Subscribe to Track More Actions',
						'user',
						'nelio-ab-testing'
					) }
				</ExternalLink>
			</div>
		);
	} //end if

	const createConversionAction = ( type: ConversionActionTypeName ) => {
		if ( ! goalId ) {
			return;
		} //end if
		const act = createConversionActionWithDefaults( type );
		if ( act ) {
			void addConversionActionsIntoGoal( goalId, act );
		} //end if
	};

	return (
		<ul className="nab-conversion-action-type-list">
			{ conversionActionTypes &&
				conversionActionTypes.map( ( type ) => {
					const Icon = type.icon;
					return (
						<Tooltip
							key={ type.name }
							text={ type.title }
							placement="top"
						>
							<li
								key={ type.name }
								className="nab-conversion-action-type-list__item"
							>
								<Button
									variant="secondary"
									className="nab-conversion-action-type-list__new-action-button"
									onClick={ () =>
										createConversionAction( type.name )
									}
								>
									<Icon />
								</Button>
							</li>
						</Tooltip>
					);
				} ) }
		</ul>
	);
};

// =====
// HOOKS
// =====

const useActiveGoalId = () =>
	useSelect( ( select ) => select( NAB_EDITOR ).getActiveGoal()?.id );

const useConversionActionTypes = () => {
	const goalId = useActiveGoalId();
	const conversionActions = useConversionActions( goalId );
	return useSelect( ( select ) => {
		const { getConversionActionTypes } = select( NAB_ACTIONS );
		const conversionActionTypes = filter(
			getConversionActionTypes(),
			( type ) => ! type.isActive || type.isActive( select )
		);

		// TODO. This is an adhoc solution, but we probably need something “better.”
		const wcOrder = find( conversionActionTypes, { name: 'nab/wc-order' } );
		if ( wcOrder ) {
			if (
				conversionActions.length &&
				every( conversionActions, { type: 'nab/wc-order' } )
			) {
				return [ wcOrder ];
			} //end if
		} //end if

		// TODO. This is an adhoc solution, but we probably need something “better.”
		const eddOrder = find( conversionActionTypes, {
			name: 'nab/edd-order',
		} );
		if ( eddOrder ) {
			if (
				conversionActions.length &&
				every( conversionActions, { type: 'nab/edd-order' } )
			) {
				return [ eddOrder ];
			} //end if
		} //end if

		// TODO. This is an adhoc solution, but we probably need something “better.”
		if ( ( eddOrder || wcOrder ) && conversionActions.length ) {
			return without(
				conversionActionTypes,
				...[
					...( wcOrder ? [ wcOrder ] : [] ),
					...( eddOrder ? [ eddOrder ] : [] ),
				]
			);
		} //end if

		return conversionActionTypes;
	} );
};

const useConversionActions = ( goalId?: GoalId ): ReadonlyArray< CA > =>
	useSelect( ( select ) => {
		if ( ! goalId ) {
			return [];
		} //end if
		return select( NAB_EDITOR ).getConversionActions( goalId ) || [];
	} );
