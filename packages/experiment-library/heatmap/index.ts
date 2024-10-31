/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import icon from './icon.svg';

export const settings = {
	name: 'nab/heatmap' as const,
	category: 'page',
	title: _x( 'Heatmap', 'text (experiment name)', 'nelio-ab-testing' ),
	description: _x(
		'Discover which parts of a web page are attracting the most attention',
		'user',
		'nelio-ab-testing'
	),
	icon,
};
