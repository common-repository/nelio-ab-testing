/**
 * WordPress dependencies
 */
import { sprintf, _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NAB_DATA } from '@nab/data';
import type { ExperimentType, ThemeId } from '@nab/types';

/**
 * Internal dependencies
 */
import icon from './icon.svg';
import { Original } from './components/original';
import { Alternative } from './components/alternative';

import type { ControlAttributes, AlternativeAttributes } from './types';

export const settings: ExperimentType<
	ControlAttributes,
	AlternativeAttributes
> = {
	name: 'nab/theme' as const,
	category: 'global',
	title: _x( 'Theme', 'text (experiment name)', 'nelio-ab-testing' ),
	description: _x(
		'Test different themes on your site',
		'user',
		'nelio-ab-testing'
	),
	icon,
	supports: {
		alternativeApplication: true,
		scope: 'custom',
		presetAlternatives: ( select, collection ) => {
			const { getThemes } = select( NAB_DATA );
			const themes = getThemes();

			if ( ! themes ) {
				return false;
			} //end if

			if ( 'nab-check-availability' === collection ) {
				return true;
			} //end if

			return themes.map( ( theme ) => ( {
				value: theme.id,
				label: theme.name,
			} ) );
		},
	},
	checks: {
		getControlError: () => false,
		getAlternativeError: ( alternative, letter ) => {
			if ( ! alternative.themeId ) {
				return sprintf(
					/* translators: letter of the variant */
					_x(
						'Please select a theme in variant %s',
						'user',
						'nelio-ab-testing'
					),
					letter
				);
			} //end if

			return false;
		},
		isAlternativePreviewDisabled: ( alternative ) => ! alternative.themeId,
	},
	help: {
		original: _x(
			'Split tests of WordPress themes help you to improve the conversion rate of your site by showing different themes to different visitors. The control version (commonly known as the “A” version) uses your current theme.',
			'user',
			'nelio-ab-testing'
		),
		alternative: _x(
			'You can test your active theme against one or more alternative themes from those installed in your WordPress site.',
			'user',
			'nelio-ab-testing'
		),
	},
	defaults: {
		original: {},
		alternative: {
			name: '',
			themeId: '' as ThemeId,
		},
	},
	views: {
		original: Original,
		alternative: Alternative,
	},
};
