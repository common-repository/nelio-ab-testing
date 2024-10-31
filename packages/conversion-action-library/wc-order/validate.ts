/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { modernize } from './helpers';
import type { Attributes } from './types';

export function validate(
	attrs: Attributes
): Partial< Record< keyof Attributes, string > > {
	const { value: attributes } = modernize( attrs );

	if ( attributes.type === 'all-products' ) {
		return {};
	} //end if

	const selection = attributes.value;
	switch ( selection.type ) {
		case 'product-ids':
			return selection.productIds.length
				? {}
				: {
						type: _x(
							'Please select a product',
							'user',
							'nelio-ab-testing'
						),
				  };

		case 'product-taxonomies': {
			const taxonomies = selection.value;
			if ( ! taxonomies.length ) {
				return {
					type: _x(
						'Please select one or more taxonomies',
						'user',
						'nelio-ab-testing'
					),
				};
			} //end if

			return taxonomies.every( ( t ) => !! t.termIds.length )
				? {}
				: {
						type: _x(
							'Please select one or more terms in all your taxonomies',
							'user',
							'nelio-ab-testing'
						),
				  };
		}
	} //end switch
} //end validate()
