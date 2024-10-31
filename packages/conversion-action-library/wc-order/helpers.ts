/**
 * Internal dependencies
 */
import type { Attributes, NewAttributes } from './types';

export const modernize = ( attrs: Attributes ): NewAttributes => {
	if ( isNewAttributes( attrs ) ) {
		return attrs;
	} //end if

	const { anyProduct } = attrs;
	if ( anyProduct ) {
		return {
			type: 'product-selection',
			value: { type: 'all-products' },
		};
	} //end if

	const { productId } = attrs;
	const productIds = productId ? [ productId ] : [];
	return {
		type: 'product-selection',
		value: {
			type: 'some-products',
			value: {
				type: 'product-ids',
				mode: 'and',
				productIds,
			},
		},
	};
};

// =======
// HELPERS
// =======

const isNewAttributes = ( attrs: Attributes ): attrs is NewAttributes =>
	attrs.type === 'product-selection' && ! hasProductIdWhenItShouldnt( attrs );

const hasProductIdWhenItShouldnt = (
	attrs: Record< string, unknown >
): boolean => !! attrs.productId;
