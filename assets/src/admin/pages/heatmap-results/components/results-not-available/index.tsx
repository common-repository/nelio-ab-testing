/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';
import Logo from '../../../../../images/full-logo.svg';

export const ResultsNotAvailable = (): JSX.Element => (
	<div className="nab-heatmap-no-longer-available">
		<Logo
			className="nab-heatmap-no-longer-available__logo"
			title="Nelio A/B Testing"
			alt="Nelio A/B Testing"
		/>

		<h1 className="nab-heatmap-no-longer-available__title">
			{ _x( 'Heatmap not found', 'text', 'nelio-ab-testing' ) }
		</h1>

		<p className="nab-heatmap-no-longer-available__explanation">
			{ _x(
				'Oops! It looks like your heatmap is no longer available. Please keep in mind that heatmap data is only stored up to two years in Nelio’s cloud.',
				'user',
				'nelio-ab-testing'
			) }
		</p>
	</div>
);
