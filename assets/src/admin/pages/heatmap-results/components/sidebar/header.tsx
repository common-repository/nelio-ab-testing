/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dashicon, Spinner } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NAB_DATA, useAdminUrl, usePageAttribute } from '@nab/data';

/**
 * Internal dependencies
 */
import {
	useActiveExperiment,
	useProgress,
	useRawResultsStatus,
	useResultsStopper,
} from '../hooks';
import { VariantSwitcher } from '../variant-switcher';

export const Header = (): JSX.Element => {
	const isHeatmapExperiment = useIsHeatmapExperiment();
	const isRunning = useIsRunning();
	const [ status ] = useRawResultsStatus();
	const dataStatus = status.mode;

	const [ progress ] = useProgress();
	const [ isStopping, stopResultLoading ] = useResultsStopper();

	const { stopExperiment } = useDispatch( NAB_DATA );

	if (
		'loading' === dataStatus ||
		'error' === dataStatus ||
		'missing' === dataStatus
	) {
		return (
			<div className="nab-heatmap-results-sidebar__header-actions">
				<BackButton />
			</div>
		);
	} //end if

	if ( 'still-loading' === dataStatus || 'canceling' === dataStatus ) {
		return (
			<div className="nab-heatmap-results-sidebar__header-actions">
				<BackButton />
				<div className="nab-heatmap-results-sidebar__running-actions">
					{ !! progress ? (
						<span className="nab-heatmap-results-sidebar__progress">
							{ sprintf(
								/* translators: percentage */
								_x(
									'Fetching more data… (%1$d%%)',
									'text',
									'nelio-ab-testing'
								),
								Math.min( progress, 99 )
							) }
						</span>
					) : (
						<Spinner />
					) }
					{ 'canceling' !== dataStatus && (
						<Button variant="link" onClick={ stopResultLoading }>
							{ _x( 'Cancel', 'command', 'nelio-ab-testing' ) }
						</Button>
					) }
				</div>
			</div>
		);
	} //end if

	return (
		<div className="nab-heatmap-results-sidebar__header-actions">
			<BackButton />

			{ isHeatmapExperiment && isRunning && (
				<div className="nab-heatmap-results-sidebar__running-actions">
					<Button
						variant="primary"
						onClick={ () => void stopExperiment() }
						disabled={ isStopping }
						isBusy={ isStopping }
					>
						{ isStopping
							? _x( 'Stopping…', 'text', 'nelio-ab-testing' )
							: _x( 'Stop', 'command', 'nelio-ab-testing' ) }
					</Button>
				</div>
			) }

			{ ! isHeatmapExperiment && (
				<div className="nab-heatmap-results-sidebar__alt-switcher">
					<VariantSwitcher />
				</div>
			) }
		</div>
	);
};

const BackButton = () => {
	const [ isPublicView ] = usePageAttribute( 'editor/isPublicView', false );
	const backUrl = useBackUrl();

	if ( isPublicView ) {
		return null;
	} //end if

	return (
		<div className="nab-heatmap-results-sidebar__back">
			<a
				className="nab-heatmap-results-sidebar__back-link"
				href={ backUrl }
				title={ _x( 'Back…', 'command', 'nelio-ab-testing' ) }
			>
				<Dashicon icon="arrow-left-alt2" />
			</a>
		</div>
	);
};

// =====
// HOOKS
// =====

const useBackUrl = () => {
	const experimentsUrl = useAdminUrl( 'edit.php', {
		post_type: 'nab_experiment',
	} );
	const experiment = useActiveExperiment();
	if ( ! experiment ) {
		return;
	} //end if

	return experiment.type === 'nab/heatmap'
		? experimentsUrl
		: experiment.links.edit;
};

const useIsHeatmapExperiment = () =>
	useActiveExperiment()?.type === 'nab/heatmap';

const useIsRunning = () => useActiveExperiment()?.status === 'running';
