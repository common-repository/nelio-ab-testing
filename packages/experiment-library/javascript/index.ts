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
	name: 'nab/javascript' as const,
	category: 'global',
	title: _x( 'JavaScript', 'text (experiment name)', 'nelio-ab-testing' ),
	description: _x(
		'Apply changes to your pages by running JS code',
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
			'JavaScript split tests help you to improve the conversion rate of your WordPress site by running custom code to tweak the tested page(s). The control version (commonly known as the “A” version) won’t run any code.',
			'user',
			'nelio-ab-testing'
		),
		alternative: _x(
			'Here you can create one or more JavaScript snippets that will be loaded when your page’s DOM is ready. Click on the “Edit” link of each variant to view and edit its associated snippet.',
			'user',
			'nelio-ab-testing'
		),
	},
	defaults: {
		original: {},
		alternative: {
			name: '',
			code: '',
		},
	},
	views: {
		original: Original,
		alternative: DefaultAlternative,
	},
};
