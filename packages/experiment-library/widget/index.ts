/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { DefaultAlternative } from '@nab/components';
import { store as NAB_DATA } from '@nab/data';
import type { ExperimentType } from '@nab/types';

/**
 * Internal dependencies
 */
import icon from './icon.svg';
import { Original } from './components/original';

import type { ControlAttributes, AlternativeAttributes } from './types';

export const settings: ExperimentType<
	ControlAttributes,
	AlternativeAttributes
> = {
	name: 'nab/widget' as const,
	category: 'global',
	title: _x( 'Widget', 'text (experiment name)', 'nelio-ab-testing' ),
	description: _x(
		'Test alternative widget configurations on your site',
		'user',
		'nelio-ab-testing'
	),
	icon,
	supports: {
		alternativeApplication: true,
		alternativeEdition: { type: 'external' },
		scope: 'custom',
	},
	checks: {
		getControlError: () => false,
		getAlternativeError: () => false,
		isTestTypeEnabled: ( select ) =>
			select( NAB_DATA ).getPluginSetting( 'themeSupport' ).widgets,
	},
	help: {
		original: _x(
			'Widget split tests help you to improve the conversion rate of your WordPress site by changing the widgets you show on your sidebars (or widget areas). The control version (commonly known as the “A” version) is your current setup.',
			'user',
			'nelio-ab-testing'
		),
		alternative: _x(
			'Here you can create one or more variants of the widgets you use in your website. By default, each variant you create will be an exact copy of your control widgets. Click on the “Edit” link of each variant to modify its widgets.',
			'user',
			'nelio-ab-testing'
		),
	},
	defaults: {
		original: {},
		alternative: {
			name: '',
			sidebars: [],
		},
	},
	views: {
		original: Original,
		alternative: DefaultAlternative,
	},
};
