/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { addQueryArgs } from '@safe-wordpress/url';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { Preview } from '@nab/components';
import { store as NAB_DATA } from '@nab/data';
import { store as NAB_EXPERIMENTS } from '@nab/experiments';
import { numberFormat } from '@nab/i18n';
import type { ExperimentId, ExperimentTypeName } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';

export type HeatmapExperimentProps = {
	readonly id: ExperimentId;
	readonly name: string;
};

export const HeatmapExperiment = ( {
	id,
	name,
}: HeatmapExperimentProps ): JSX.Element => {
	const preview = usePreviewUrl( id );
	const views = usePageViews( id );
	const daysRunning = useDaysRunning( id );

	const experimentType = useExperimentType( 'nab/heatmap' );
	const Icon = experimentType?.icon ?? ( () => <></> );

	return (
		<article className="nab-heatmap">
			<header className="nab-heatmap__header">
				<h1 className="nab-heatmap__title">
					{ Icon && <Icon className="nab-heatmap__icon" /> }
					{ name }
				</h1>
			</header>

			<div className="nab-heatmap__content">
				<Preview
					className="nab-heatmap__screenshot"
					url={ preview ?? '' }
					caption={ _x(
						'Test screenshot.',
						'text',
						'nelio-ab-testing'
					) }
				/>

				<p className="screen-reader-text">
					{ _x(
						'Collected data about this test:',
						'text',
						'nelio-ab-testing'
					) }
				</p>

				<ul className="nab-heatmap__data">
					<li className="nab-heatmap__data-item">
						<span className="nab-heatmap__data-measure">
							{ _x( 'Page views', 'text', 'nelio-ab-testing' ) }
							<span className="screen-reader-text">:</span>
						</span>
						<span className="nab-heatmap__data-value">
							{ numberFormat( views ) }
						</span>
					</li>
					<li className="nab-heatmap__data-item">
						<span className="nab-heatmap__data-measure">
							{ _x( 'Days running', 'text', 'nelio-ab-testing' ) }
							<span className="screen-reader-text">:</span>
						</span>
						<span className="nab-heatmap__data-value">
							{ numberFormat( daysRunning ) }
						</span>
					</li>
				</ul>
			</div>

			<a
				className="nab-heatmap__link"
				href={ addQueryArgs( 'admin.php', {
					page: 'nelio-ab-testing-experiment-view',
					experiment: id,
				} ) }
			>
				<span className="screen-reader-text">
					{ _x( 'View', 'command', 'nelio-ab-testing' ) }
				</span>
			</a>
		</article>
	);
};

// =====
// HOOKS
// =====

const useExperimentType = ( type: ExperimentTypeName ) =>
	useSelect( ( select ) =>
		select( NAB_EXPERIMENTS ).getExperimentType( type )
	);

const usePreviewUrl = ( id: ExperimentId ) =>
	useSelect(
		( select ) => select( NAB_DATA ).getExperiment( id )?.links.preview
	);

const usePageViews = ( id: ExperimentId ) =>
	useSelect( ( select ) => select( NAB_DATA ).getPageViews( id ) );

const useDaysRunning = ( id: ExperimentId ) =>
	useSelect( ( select ) => select( NAB_DATA ).getDaysRunning( id ) );
