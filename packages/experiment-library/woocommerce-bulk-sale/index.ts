/**
 * WordPress dependencies
 */
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { createConversionAction } from '@nab/conversion-actions';
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
	name: 'nab/wc-bulk-sale' as const,
	category: 'woocommerce',
	title: _x(
		'WooCommerce Bulk Sale',
		'text (experiment name)',
		'nelio-ab-testing'
	),
	shortTitle: _x( 'Bulk Sale', 'text (experiment name)', 'nelio-ab-testing' ),
	description: _x(
		'Apply a discount to all your (selected) products.',
		'user',
		'nelio-ab-testing'
	),
	icon,
	supports: {
		automaticGoalSetup: ( control ) => {
			return control.productSelections.map( ( selection ) =>
				createConversionAction( 'nab/wc-order', {
					type: 'product-selection',
					value: selection,
				} )
			);
		},
		postTypes: 'product',
	},
	checks: {
		getControlError: () => false,
		getAlternativeError: ( alternative, letter ) => {
			if ( ! isValidPercentage( alternative.discount ) ) {
				return sprintf(
					/* translators: letter of the variant */
					_x(
						'Please set a valid discount percentage value (between 0 and 100) in variant %s',
						'user',
						'nelio-ab-testing'
					),
					letter
				);
			} //end if

			return false;
		},
	},
	help: {
		original: _x(
			'This type of test lets you apply a bulk sale to all your (selected) products. The control version doesn’t apply any discount and simply shows the regular price of your selected products.',
			'user',
			'nelio-ab-testing'
		),
		alternative: _x(
			'Here you can create one or more bulk sale discounts that will apply to all your tested products.',
			'user',
			'nelio-ab-testing'
		),
	},
	defaults: {
		original: {
			productSelections: [ { type: 'all-products' } ],
		},
		alternative: {
			name: '',
			discount: 20,
			overwritesExistingSalePrice: true,
		},
	},
	views: {
		original: Original,
		alternative: Alternative,
	},
};

// =======
// HELPERS
// =======

const isValidPercentage = ( percentage: number ): boolean => {
	return 0 <= percentage && percentage <= 100;
};
