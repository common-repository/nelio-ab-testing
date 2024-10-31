/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { dispatch, useSelect } from '@safe-wordpress/data';
import domReady from '@safe-wordpress/dom-ready';
import { StrictMode, render, useEffect } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { debounce } from 'lodash';
import { registerCoreConversionActions } from '@nab/conversion-action-library';
import { store as NAB_DATA } from '@nab/data';
import { registerCoreExperiments } from '@nab/experiment-library';
import { registerCoreSegmentationRules } from '@nab/segmentation-rule-library';
import { createStagingNotice } from '@nab/utils';
import type { ExperimentId } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { ResultsProvider } from './components/provider';
import { Layout } from './components/layout';

import { renderHelp } from './help';

type Settings = {
	readonly experimentId: ExperimentId;
	readonly isStaging: boolean;
	readonly isPublicView: boolean;
	readonly isReadOnlyActive: boolean;
};

export function initPage( id: string, settings: Settings ): void {
	const content = document.getElementById( id );

	registerCoreExperiments();
	registerCoreConversionActions();
	registerCoreSegmentationRules();

	const { experimentId, isStaging, isPublicView, isReadOnlyActive } =
		settings;

	if ( isStaging ) {
		createStagingNotice();
	} //end if

	render(
		<Main
			experimentId={ experimentId }
			isPublicView={ isPublicView }
			isReadOnlyActive={ isReadOnlyActive }
		/>,
		content
	);
} //end initPage()

const Main = ( {
	experimentId,
	isPublicView,
	isReadOnlyActive,
}: {
	experimentId: ExperimentId;
	isPublicView: boolean;
	isReadOnlyActive: boolean;
} ) => {
	const experiment = useSelect( ( select ) =>
		select( NAB_DATA ).getExperiment( experimentId )
	);
	useEffect( () => {
		if ( experiment && ! isPublicView ) {
			renderHelp();
		} //end if
	}, [ !! experiment ] );

	return (
		<StrictMode>
			<ResultsProvider
				experimentId={ experimentId }
				isPublicView={ isPublicView }
				isReadOnlyActive={ isReadOnlyActive }
			>
				<Layout />
			</ResultsProvider>
		</StrictMode>
	);
};

function fixSidebarDimensions() {
	const height = window.innerHeight;
	const wpAdminBar = document.getElementById( 'wpadminbar' );
	const adminBarHeight = wpAdminBar
		? wpAdminBar.getBoundingClientRect().height
		: 0;

	const { setPageAttribute } = dispatch( NAB_DATA );
	void setPageAttribute( 'sidebarDimensions', {
		top: adminBarHeight,
		height: `${ height - adminBarHeight }px`,
		applyFix: 782 <= window.innerWidth, // medium breakpoint
	} );
} //end fixSidebarDimensions()
window.addEventListener( 'resize', debounce( fixSidebarDimensions, 100 ) );
domReady( fixSidebarDimensions );
