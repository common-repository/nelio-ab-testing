/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, TextControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';
import {
	AutomaticConversionActionList,
	ConversionActionList,
} from './conversion-action-list';
import { ConversionActionTypeList } from './conversion-action-type-list';
import { ECommerceGoalSettings } from './ecommerce-goal-settings';

export type GoalProps = {
	readonly isAutomatic: boolean;
	readonly name: string;
	readonly removeGoal?: () => void;
	readonly setName: ( name: string ) => void;
};

export const Goal = ( {
	name,
	setName,
	removeGoal,
	isAutomatic,
}: GoalProps ): JSX.Element => (
	<div className="nab-current-goal-info">
		{ ! isAutomatic && (
			<div className="nab-current-goal-info__header">
				<TextControl
					placeholder={ _x(
						'Name your goal…',
						'user',
						'nelio-ab-testing'
					) }
					value={ name }
					onChange={ ( value ) => setName( value ) }
				/>
				{ !! removeGoal && (
					<Button
						variant="tertiary"
						isDestructive
						className="nab-current-goal-info__delete-button"
						onClick={ removeGoal }
					>
						{ _x( 'Delete', 'command (goal)', 'nelio-ab-testing' ) }
					</Button>
				) }
			</div>
		) }

		<ECommerceGoalSettings />

		{ isAutomatic ? (
			<AutomaticConversionActionList />
		) : (
			<>
				<ConversionActionList />
				<ConversionActionTypeList />
			</>
		) }
	</div>
);
