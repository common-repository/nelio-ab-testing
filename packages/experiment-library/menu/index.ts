/**
 * WordPress dependencies
 */
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NAB_DATA } from '@nab/data';
import type { ExperimentType } from '@nab/types';

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
	name: 'nab/menu' as const,
	category: 'global',
	title: _x( 'Menu', 'text (experiment name)', 'nelio-ab-testing' ),
	description: _x(
		'Test alternative versions of a menu',
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
		getControlError: ( control ) => {
			if ( ! control.menuId ) {
				return _x(
					'Please select the menu you want to test',
					'user',
					'nelio-ab-testing'
				);
			} //end if

			return false;
		},
		getAlternativeError: ( alternative, letter, control ) => {
			if ( control.testAgainstExistingMenu && ! alternative.menuId ) {
				return sprintf(
					/* translators: letter of the variant */
					_x(
						'Please select a menu in variant %s',
						'user',
						'nelio-ab-testing'
					),
					letter
				);
			} //end if

			return false;
		},
		isAlternativePreviewDisabled: ( alternative, control ) =>
			!! control.testAgainstExistingMenu && ! alternative.menuId,
		isTestTypeEnabled: ( select ) =>
			select( NAB_DATA ).hasMenus() &&
			select( NAB_DATA ).getPluginSetting( 'themeSupport' ).menus,
	},
	help: {
		original: _x(
			'Menu split tests help you to improve the conversion rate of your WordPress site by creating one or more variants of your navigation menus. The control version (commonly known as the “A” version) is the already-existing navigation menu you want to run the test on.',
			'user',
			'nelio-ab-testing'
		),
		alternative: _x(
			'Here you can create one or more variants of your tested menu. By default, each variant you create will be an exact copy of the tested menu. Click on the “Edit” link of each variant to tweak it as you please.',
			'user',
			'nelio-ab-testing'
		),
	},
	defaults: {
		original: {
			menuId: 0,
		},
		alternative: {
			name: '',
			menuId: 0,
		},
	},
	views: {
		original: Original,
		alternative: Alternative,
	},
};
