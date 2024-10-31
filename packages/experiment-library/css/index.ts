/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { DefaultAlternative } from '@nab/components';
import type { ExperimentType } from '@nab/types';

/**
 * Internal dependencies
 */
import icon from './icon.svg';
import { Original } from './components/original';
import { ValuePreview } from './components/value-preview';

import type { ControlAttributes, AlternativeAttributes } from './types';

export const settings: ExperimentType<
	ControlAttributes,
	AlternativeAttributes
> = {
	name: 'nab/css' as const,
	category: 'global',
	title: _x( 'CSS', 'text (experiment name)', 'nelio-ab-testing' ),
	description: _x(
		'Test different CSS rules on your site',
		'user',
		'nelio-ab-testing'
	),
	icon,
	supports: {
		alternativeEdition: { type: 'external' },
		alternativePreviewDialog: ValuePreview,
		scope: 'custom',
	},
	checks: {
		getControlError: () => false,
		getAlternativeError: () => false,
	},
	help: {
		original: _x(
			'CSS split tests help you to improve the conversion rate of your WordPress site by changing its look and feel. The control version (commonly known as the “A” version) is how your site currently looks with the active theme, with no extra CSS snippets loaded in the front-end.',
			'user',
			'nelio-ab-testing'
		),
		alternative: _x(
			'Here you can create one or more CSS snippets that will be loaded after your theme’s own styles. This way, you can test what style works the best for you. Click on the “Edit” link of each variant to view and edit the corresponding CSS snippet.',
			'user',
			'nelio-ab-testing'
		),
	},
	defaults: {
		original: {},
		alternative: {
			name: '',
			css: '',
		},
	},
	views: {
		original: Original,
		alternative: DefaultAlternative,
	},
};
