/**
 * WordPress dependencies
 */
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
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
	name: 'nab/custom-post-type' as const,
	category: 'page',
	title: _x(
		'Custom Post Type',
		'text (experiment name)',
		'nelio-ab-testing'
	),
	description: _x(
		'Test alternative versions of a custom post type',
		'user',
		'nelio-ab-testing'
	),
	icon,
	supports: {
		alternativeApplication: ( alternatives ) =>
			! alternatives[ 0 ]?.attributes?.testAgainstExistingContent,
		alternativeEdition: {
			type: 'external',
			enabled: ( control ) => ! control.testAgainstExistingContent,
		},
		postTypeExceptions: [
			'page',
			'post',
			'product',
			'product_variation',
			'attachment',
			'nelio_popup',
			'nelio_form',
			'elementor_library',
			'sc_product',
		],
		scope: 'tested-post-with-consistency',
	},
	checks: {
		getControlError: ( control ) => {
			if ( ! control.postId ) {
				return _x(
					'Please select the element you want to test',
					'user',
					'nelio-ab-testing'
				);
			} //end if

			return false;
		},
		getAlternativeError: ( alternative, letter, control ) => {
			if ( control.testAgainstExistingContent && ! alternative.postId ) {
				return sprintf(
					/* translators: letter of the variant */
					_x(
						'Please select an element in variant %s',
						'user',
						'nelio-ab-testing'
					),
					letter
				);
			} //end if

			return false;
		},
		isAlternativePreviewDisabled: ( alternative, control ) =>
			!! control.testAgainstExistingContent && ! alternative.postId,
	},
	help: {
		original: _x(
			'Split tests of custom post types help you to improve the conversion rate of your WordPress site by creating one or more variants of your content. The control version (commonly known as the “A” version) is the already-existing content from your site you want to run the test on.',
			'user',
			'nelio-ab-testing'
		),
		alternative: _x(
			'You can create one or more variants of your tested element. By default, each variant you create will be an exact copy of the tested element. Click on the “Edit” link of each variant to tweak it as you please. When editing a variant, you can also overwrite it with the content of any existing element in the selected type.',
			'user',
			'nelio-ab-testing'
		),
	},
	defaults: {
		original: {
			postType: '',
			postId: 0,
		},
		alternative: {
			name: '',
			postId: 0,
		},
	},
	views: {
		original: Original,
		alternative: Alternative,
	},
};
