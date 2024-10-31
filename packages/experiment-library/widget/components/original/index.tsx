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
	<p className="nab-widget-original-version">
		{ _x( 'Current Widget Set', 'text', 'nelio-ab-testing' ) }
	</p>
);
