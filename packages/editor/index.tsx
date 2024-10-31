/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import '@safe-wordpress/core-data';
import { dispatch } from '@safe-wordpress/data';
import domReady from '@safe-wordpress/dom-ready';
import { render } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { debounce } from 'lodash';
import { registerCoreConversionActions } from '@nab/conversion-action-library';
import { store as NAB_DATA } from '@nab/data';
import { registerCoreExperiments } from '@nab/experiment-library';
import { registerCoreSegmentationRules } from '@nab/segmentation-rule-library';
import type { ExperimentId } from '@nab/types';

/**
 * Internal dependencies
 */
import { Editor } from './components/editor';

export * from './store';
export * from './components/provider';
export * from './components/experiment-name';
export * from './components/header';
export * from './components/sidebar';

export function initializeExperimentEditor(
	id: string,
	experimentId: ExperimentId
): void {
	const target = document.getElementById( id );
	if ( ! target ) {
		// eslint-disable-next-line no-console
		console.warn( `Unable to find container node ${ id }.` );
		return;
	} //end if

	registerCoreExperiments();
	registerCoreConversionActions();
	registerCoreSegmentationRules();

	render( <Editor experimentId={ experimentId } />, target );
} //end initializeExperimentEditor()

// =======
// HELPERS
// =======

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
