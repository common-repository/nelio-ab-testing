/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon } from '@safe-wordpress/components';
import { createInterpolateElement } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';

import { GoalList } from '../goal-list';
import { ConversionActionList } from '../conversion-action-list';

export const GoalSection = (): JSX.Element => (
	<div className="nab-goal-section">
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

		<div className="nab-goal-section__content">
			<GoalList />

			<div className="nab-current-goal-info">
				<ConversionActionList />
			</div>
		</div>
	</div>
);
