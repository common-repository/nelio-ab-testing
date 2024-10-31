/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import '@safe-wordpress/dom-ready';
import '@safe-wordpress/notices';

import { render } from '@safe-wordpress/element';

/**
 * Internal dependencies
 */
import './style.scss';
import { WelcomeBox } from './components/welcome-box';

export function initPage( id: string ): void {
	const content = document.getElementById( id );
	render( <WelcomeBox />, content );
} //end initPage()
