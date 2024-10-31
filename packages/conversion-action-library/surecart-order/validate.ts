/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export function validate(
	attrs: Attributes
): Partial< Record< keyof Attributes, string > > {
	const { value: attributes } = attrs;

	if ( attributes.type === 'all-surecart-products' ) {
		return {};
	} //end if

	const selection = attributes.value;
	switch ( selection.type ) {
		case 'surecart-ids':
			return selection.productIds.length
				? {}
				: {
						type: _x(
							'Please select a product',
							'user',
							'nelio-ab-testing'
						),
				  };
	} //end switch
} //end validate()
