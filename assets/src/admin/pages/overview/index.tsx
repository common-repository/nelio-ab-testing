/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import '@safe-wordpress/dom-ready';
import '@safe-wordpress/notices';
import { render } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import '@nab/data';
import { registerCoreExperiments } from '@nab/experiment-library';
import { NewTestButton, QuotaMeter, TitleAction } from '@nab/components';
import { createStagingNotice } from '@nab/utils';
import type { Experiment, Heatmap, SubscriptionPlan } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { renderHelp } from './help';
import { OverviewProvider } from './components/provider';
import { OverviewExperimentsList } from './components/overview-experiments-list';

type Settings = {
	readonly isStaging: boolean;
	readonly isDeprecated: boolean;
	readonly experiments: ReadonlyArray< Experiment >;
	readonly heatmaps: ReadonlyArray< Heatmap >;
	readonly subscription: SubscriptionPlan | false;
};

export function initPage( id: string, settings: Settings ): void {
	registerCoreExperiments();

	const { experiments, heatmaps, isDeprecated, isStaging, subscription } =
		settings;

	const titleAction = document.getElementById( `${ id }-title-action` );
	const content = document.getElementById( id );

	if ( isStaging ) {
		createStagingNotice();
	} //end if

	render(
		<>
			<NewTestButton />
			<TitleAction
				isSubscribed={ !! subscription }
				isDeprecated={ isDeprecated }
			/>
		</>,
		titleAction
	);

	render(
		<OverviewProvider>
			<QuotaMeter />
			<OverviewExperimentsList
				experiments={ experiments }
				heatmaps={ heatmaps }
			/>
		</OverviewProvider>,
		content
	);

	renderHelp();
} //end initPage()
