/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export function validate(
	attributes: Attributes
): Partial< Record< keyof Attributes, string > > {
	const { anyProduct, productId } = attributes;

	if ( ! anyProduct && ! productId ) {
		return {
			productId: _x(
				'Please select a product',
				'user',
				'nelio-ab-testing'
			),
		};
	} //end if

	return {};
} //end validate()
