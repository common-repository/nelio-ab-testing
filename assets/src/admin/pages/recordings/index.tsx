/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import '@safe-wordpress/dom-ready';
import { render } from '@safe-wordpress/element';

/**
 * Internal dependencies
 */
import { Layout } from './components/layout';
import type { Settings } from './types';

export function initPage( id: string, settings: Settings ): void {
	const content = document.getElementById( id );
	render( <Layout settings={ settings } />, content );
} //end initPage()
