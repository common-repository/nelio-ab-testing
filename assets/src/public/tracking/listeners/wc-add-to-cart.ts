/**
 * External dependencies
 */
import type { Attributes } from '../../../../../packages/conversion-action-library/wc-add-to-cart/types';
import type { WooCommerceCartItem } from './woocommerce';

/**
 * Internal dependencies
 */
import { domReady } from '../../utils/helpers';
import type { ConvertibleAction, Convert } from '../../types';

export function isWooCommerceAddToCartAction(
	action: ConvertibleAction
): action is ConvertibleAction< Attributes > {
	return 'nab/wc-add-to-cart' === action.type;
} //end isWooCommerceAddToCartAction()

export function listenToWooCommerceAddToCartEvent(
	action: ConvertibleAction< Attributes >,
	convert: Convert
): void {
	domReady( () => {
		const {
			attributes: { anyProduct, productId },
			experiment,
			goal,
		} = action;

		document.body.addEventListener(
			'nab-wc-product-added-to-cart',
			( event ) => {
				const e = event as CustomEvent<
					ReadonlyArray< WooCommerceCartItem >
				>;
				if ( anyProduct ) {
					convert( experiment, goal );
				} else if (
					e.detail.map( ( p ) => p.product_id ).includes( productId )
				) {
					convert( experiment, goal );
				} //end if
			}
		);
	} );
} //end listenToWooCommerceAddToCartEvent()
