/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dashicon } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import {
	useActiveResolution,
	useIsLocked,
	useSidebarVisibility,
} from '../hooks';

export const FooterActions = (): JSX.Element => {
	const [ isVisible, setVisibility ] = useSidebarVisibility();
	const isLocked = useIsLocked();
	const [ resolution, setResolution ] = useActiveResolution();

	return (
		<div className="nab-heatmap-results-sidebar__footer-actions">
			<div
				className={ classnames( {
					'nab-heatmap-results-sidebar__visibility-toggle': true,
					'nab-heatmap-results-sidebar__visibility-toggle--hide':
						!! isVisible,
					'nab-heatmap-results-sidebar__visibility-toggle--show':
						! isVisible,
				} ) }
			>
				<Button
					variant="link"
					onClick={ () => setVisibility( ! isVisible ) }
				>
					{ isVisible ? (
						<>
							<Dashicon icon="admin-collapse" />
							<span className="nab-heatmap-results-sidebar__visibility-toggle-label">
								{ _x(
									'Hide Controls',
									'command',
									'nelio-ab-testing'
								) }
							</span>
						</>
					) : (
						<Dashicon icon="admin-collapse" />
					) }
				</Button>
			</div>

			<div className="nab-heatmap-results-sidebar__resolutions">
				<div
					className={ classnames( {
						'nab-heatmap-results-sidebar__resolution': true,
						'nab-heatmap-results-sidebar__resolution--is-active':
							'desktop' === resolution,
					} ) }
				>
					<Button
						variant="link"
						onClick={ () => setResolution( 'desktop' ) }
						disabled={ isLocked }
					>
						<Dashicon icon="desktop" />
						<span className="screen-reader-text">
							{ _x(
								'Enter desktop preview mode',
								'command',
								'nelio-ab-testing'
							) }
						</span>
					</Button>
				</div>

				<div
					className={ classnames( {
						'nab-heatmap-results-sidebar__resolution': true,
						'nab-heatmap-results-sidebar__resolution--is-active':
							'tablet' === resolution,
					} ) }
				>
					<Button
						variant="link"
						onClick={ () => setResolution( 'tablet' ) }
						disabled={ isLocked }
					>
						<Dashicon icon="tablet" />
						<span className="screen-reader-text">
							{ _x(
								'Enter tablet preview mode',
								'command',
								'nelio-ab-testing'
							) }
						</span>
					</Button>
				</div>

				<div
					className={ classnames( {
						'nab-heatmap-results-sidebar__resolution': true,
						'nab-heatmap-results-sidebar__resolution--is-active':
							'smartphone' === resolution,
					} ) }
				>
					<Button
						variant="link"
						onClick={ () => setResolution( 'smartphone' ) }
						disabled={ isLocked }
					>
						<Dashicon icon="smartphone" />
						<span className="screen-reader-text">
							{ _x(
								'Enter mobile preview mode',
								'command',
								'nelio-ab-testing'
							) }
						</span>
					</Button>
				</div>
			</div>
		</div>
	);
};
