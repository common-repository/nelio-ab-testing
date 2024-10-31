/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { DefaultAlternative as Alternative } from '@nab/components';
import { createConversionAction } from '@nab/conversion-actions';
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
	name: 'nab/wc-product' as const,
	category: 'woocommerce',
	title: _x(
		'WooCommerce Product',
		'text (experiment name)',
		'nelio-ab-testing'
	),
	shortTitle: _x( 'Product', 'text (experiment name)', 'nelio-ab-testing' ),
	description: _x(
		'Test alternative versions of a product name, price, featured image, and short description',
		'user',
		'nelio-ab-testing'
	),
	icon,
	supports: {
		alternativeApplication: true,
		alternativeEdition: { type: 'external' },
		automaticGoalSetup: ( control ) => {
			return [
				createConversionAction( 'nab/wc-order', {
					type: 'product-selection',
					value: {
						type: 'some-products',
						value: {
							type: 'product-ids',
							mode: 'and',
							productIds: control.postId
								? [ control.postId ]
								: [],
						},
					},
				} ),
			];
		},
		postTypes: 'product',
	},
	checks: {
		getControlError: ( control ) => {
			if ( ! control.postId ) {
				return _x(
					'Please select the product you want to test',
					'user',
					'nelio-ab-testing'
				);
			} //end if

			return false;
		},
		getAlternativeError: () => false,
	},
	help: {
		original: _x(
			'Product split tests help you to improve the interest your customers show in your products by creating one or more variants of the name, pricing, short description, and image of a WooCommerce Product. The control version (commonly known as the “A” version) is the already-existing product you want to test.',
			'user',
			'nelio-ab-testing'
		),
		alternative: _x(
			'Here you can create and edit one or more variants of your tested product. By default, each variant you create will use the product’s current values.',
			'user',
			'nelio-ab-testing'
		),
	},
	defaults: {
		original: {
			postId: 0,
			postType: 'product',
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
