/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { StrictMode, render } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { registerCoreExperiments } from '@nab/experiment-library';
import { registerCoreSegmentationRules } from '@nab/segmentation-rule-library';
import {
	isExperimentTooOldToHaveHeatmaps,
	createStagingNotice,
} from '@nab/utils';
import type { ExperimentId, ExperimentTypeName, SiteId } from '@nab/types';

/**
 * Internal dependencies
 */
import { ResultsNotAvailable } from './components/results-not-available';
import { ResultsProvider } from './components/provider';
import { Layout } from './components/layout';

type Settings = {
	readonly alternativeIndex: number;
	readonly endDate: string | false;
	readonly experimentId: ExperimentId;
	readonly experimentType: ExperimentTypeName;
	readonly firstDayOfWeek: number;
	readonly isStaging: boolean;
	readonly isPublicView: boolean;
	readonly isReadOnlyActive: boolean;
	readonly siteId: SiteId;
};

export function initPage( id: string, settings: Settings ): void {
	const content = document.getElementById( id );

	if ( isExperimentTooOldToHaveHeatmaps( settings.endDate || '' ) ) {
		return render(
			<StrictMode>
				<ResultsNotAvailable />
			</StrictMode>,
			content
		);
	} //end if

	const {
		experimentId,
		experimentType,
		alternativeIndex,
		isPublicView,
		isReadOnlyActive,
		isStaging,
		firstDayOfWeek,
	} = settings;

	if ( isStaging ) {
		createStagingNotice();
	} //end if

	registerCoreExperiments();
	registerCoreSegmentationRules();

	render(
		<StrictMode>
			<ResultsProvider
				experimentId={ experimentId }
				experimentType={ experimentType }
				alternativeIndex={ alternativeIndex }
				firstDayOfWeek={ firstDayOfWeek }
				isPublicView={ isPublicView }
				isReadOnlyActive={ isReadOnlyActive }
			>
				<Layout />
			</ResultsProvider>
		</StrictMode>,
		content
	);
} //end initPage()
