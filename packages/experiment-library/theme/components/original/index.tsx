/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';

export const Original = (): JSX.Element => (
	<p className="nab-theme-original-version">
		{ _x( 'Active Theme', 'text', 'nelio-ab-testing' ) }
	</p>
);
