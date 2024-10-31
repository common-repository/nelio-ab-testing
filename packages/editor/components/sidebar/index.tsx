/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { createInterpolateElement } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NAB_DATA } from '@nab/data';

/**
 * Internal dependencies
 */
import './style.scss';
import { ExperimentManagement } from './experiment-management';
import { Description } from './description';
import { Scope } from './scope';

export const Sidebar = (): JSX.Element => {
	const dims = useSidebarDimensions();
	return (
		<div className="nab-edit-experiment-sidebar" style={ dims }>
			<div className="nab-edit-experiment-sidebar__element-wrapper">
				<h2 className="nab-edit-experiment-sidebar__section-title">
					{ createInterpolateElement(
						sprintf(
							/* translators: dashicon */
							_x(
								'%s Additional Settings',
								'text',
								'nelio-ab-testing'
							),
							'<icon></icon>'
						),
						{
							icon: (
								<Dashicon
									className="nab-edit-experiment-sidebar__section-title-icon"
									icon="admin-settings"
								/>
							),
						}
					) }
				</h2>

				<ExperimentManagement />
				<Description />
				<Scope />
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useSidebarDimensions = () =>
	useSelect( ( select ) => {
		const { getPageAttribute } = select( NAB_DATA );
		const { applyFix, ...dims } = getPageAttribute( 'sidebarDimensions' );
		return applyFix ? dims : undefined;
	} );
