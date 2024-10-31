/**
 * External dependencies
 */
import debounce from 'lodash/debounce';
import type { Dict, HeatmapFrameAction } from '@nab/types';

/**
 * Internal dependencies
 */
import { reactToParentMessages as heatmapReact } from './heatmap';
import { reactToParentMessages as scrollmapReact } from './scrollmap';
import { reactToParentMessages as confettiReact } from './confetti';

import { loadAssets, onPageReady } from './internal/page';
import {
	markPageAsReady,
	markScriptAsReady,
	onWindowResize,
} from './internal/store';

import { domReady } from '../../../public/utils/helpers';

type MaybeHeatmapFrameAction = {
	readonly plugin?: string;
};

function init() {
	if ( ! isParentApiAvailable() ) {
		console.error( 'Parent window doesn’t have expected API. Bye!' ); // eslint-disable-line
		return;
	} //end if

	window.addEventListener( 'message', reactToParentMessages, false );

	window.addEventListener( 'resize', debounce( onWindowResize, 100 ) );
	onWindowResize();

	markScriptAsReady();
	domReady( loadAssets );
	onPageReady( markPageAsReady );
} //end init()

function reactToParentMessages( message: { data: MaybeHeatmapFrameAction } ) {
	const action = message.data;
	if ( ! isHeatmapFrameAction( action ) ) {
		return;
	} //end if
	heatmapReact( action );
	scrollmapReact( action );
	confettiReact( action );
} //end reactToParentMessages()

const isHeatmapFrameAction = (
	action: MaybeHeatmapFrameAction
): action is HeatmapFrameAction => action.plugin === 'nelio-ab-testing';

const isParentApiAvailable = () => !! ( window.parent?.wp as Dict )?.data;

// =======
// KICKOFF
// =======

init();
