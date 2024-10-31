/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { addQueryArgs } from '@safe-wordpress/url';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { FancyIcon } from '@nab/components';
import type { Experiment, Heatmap } from '@nab/types';

/**
 * Internal dependencies
 */
import { AlternativeExperiment } from '../alternative-experiment';
import { HeatmapExperiment } from '../heatmap-experiment';
import './style.scss';

export type OverviewExperimentsList = {
	readonly experiments: ReadonlyArray< Experiment >;
	readonly heatmaps: ReadonlyArray< Heatmap >;
};

export const OverviewExperimentsList = ( {
	experiments,
	heatmaps,
}: OverviewExperimentsList ): JSX.Element => {
	if ( ! ( experiments.length + heatmaps.length ) ) {
		return (
			<section className="nab-no-experiments">
				<FancyIcon icon="overview" isRounded />
				<p>
					{ _x(
						'Here you’ll find relevant information about your running tests.',
						'user',
						'nelio-ab-testing'
					) }
				</p>
				<Button
					variant="primary"
					onClick={ () => {
						// phpcs:ignore
						window.location.href = addQueryArgs( 'edit.php', {
							post_type: 'nab_experiment',
						} );
					} }
				>
					{ _x( 'See my tests', 'command', 'nelio-ab-testing' ) }
				</Button>
			</section>
		);
	} //end if

	return (
		<>
			{ !! experiments.length && !! heatmaps.length && (
				<h2>{ _x( 'Split Tests', 'text', 'nelio-ab-testing' ) }</h2>
			) }

			{ !! experiments.length && (
				<div
					className={ classnames( 'nab-experiments', {
						'nab-experiments--single': 1 === experiments.length,
					} ) }
				>
					{ experiments.map( ( { id, type, name } ) => (
						<AlternativeExperiment
							key={ id }
							id={ id }
							type={ type }
							name={ name }
						/>
					) ) }
				</div>
			) }

			{ !! experiments.length && !! heatmaps.length && (
				<h2>{ _x( 'Heatmaps', 'text', 'nelio-ab-testing' ) }</h2>
			) }

			{ !! heatmaps.length && (
				<div
					className={ classnames( 'nab-heatmaps', {
						'nab-heatmaps--single': 1 === heatmaps.length,
					} ) }
				>
					{ heatmaps.map( ( { id, name } ) => (
						<HeatmapExperiment key={ id } id={ id } name={ name } />
					) ) }
				</div>
			) }
		</>
	);
};
