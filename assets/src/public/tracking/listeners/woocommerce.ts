/**
 * External dependencies
 */
import isObject from 'lodash/isObject';
import type { Maybe, ProductId } from '@nab/types';

/**
 * Internal dependencies.
 */
import { domReady } from '../../utils/helpers';

domReady( () => {
	if ( ! hasJQuery( window ) ) {
		return;
	} //end if

	const cart = getWooCommerceCart();
	if ( cart ) {
		updateNabCart( cart );
	} //end if

	window
		.jQuery( document.body )
		.on( 'wc_fragments_loaded wc_fragments_refreshed', () =>
			setTimeout( () => {
				const newCart = getWooCommerceCart();
				if ( newCart ) {
					updateNabCart( newCart );
				} //end if
			}, 1 )
		);

	window
		.jQuery( document.body )
		.on( 'added_to_cart removed_from_cart', ( _, fragments ) => {
			const newCart = hasOwnProperty( fragments, 'nab_cart_info' )
				? fragments.nab_cart_info ?? { items: [] }
				: { items: [] };
			updateNabCart( newCart as WooCommerceCart );
		} );
} );

// =======
// HELPERS
// =======

// ------------------------
// Nelio A/B Testing’s Cart
// ------------------------

function updateNabCart( cart: WooCommerceCart ) {
	/*
	 * TODO
	if ( ! hasWooCommerceCartFragmentsParams( window ) ) {
		return;
	} //end if
	*/

	const previousCart = getNabCart();
	const addedProducts = cart.items.filter(
		( p ) =>
			! previousCart.items.some(
				( pp ) =>
					pp.product_id === p.product_id &&
					pp.variation_id === p.variation_id
			)
	);
	if ( addedProducts.length ) {
		document.body.dispatchEvent(
			new CustomEvent( 'nab-wc-product-added-to-cart', {
				detail: [ ...addedProducts ],
			} )
		);
	} //end if

	setNabCart( cart );
} //end updateNabCart()

function getNabCart(): WooCommerceCart {
	const key = getNabCartKey();
	const cart = getWooCommerceCart();
	if ( ! sessionStorage.getItem( key ) && cart ) {
		setNabCart( { items: cart.items } );
	} //end if

	try {
		const data = JSON.parse(
			sessionStorage.getItem( key ) ?? '{}'
		) as Maybe< Partial< WooCommerceCart > >;
		return {
			items: Array.isArray( data?.items ) ? data?.items ?? [] : [],
		};
	} catch ( _ ) {
		return { items: [] };
	} //end try
} //end getNabCart()

function setNabCart( cart: WooCommerceCart ): void {
	sessionStorage.setItem( getNabCartKey(), JSON.stringify( cart ) );
} //end setNabCart()

function getNabCartKey(): string {
	return `nab_${ getWooCommerceCartFragmentsParams().fragment_name }`;
} //end getNabCartKey()

// ----------------------------
// WooCommerce’s Fragments/Cart
// ----------------------------

function getWooCommerceCart(): Maybe< WooCommerceCart > {
	const fragmentName = getWooCommerceCartFragmentsParams().fragment_name;

	try {
		const wooCommerceFragments = JSON.parse(
			sessionStorage.getItem( fragmentName ) ?? '{}'
		) as Maybe< Partial< WooCommerceFragments > >;
		return wooCommerceFragments?.nab_cart_info;
	} catch ( _ ) {
		return undefined;
	} //end if
} //end getWooCommerceCart()

function getWooCommerceCartFragmentsParams(): WooCommerceCartFragmentsParams {
	const params = hasWooCommerceCartFragmentsParams( window )
		? window.wc_cart_fragments_params
		: {};

	return {
		fragment_name: '',
		...params,
	};
} //end getWooCommerceCartFragmentsParams()

function hasWooCommerceCartFragmentsParams( x: unknown ): x is {
	// eslint-disable-next-line camelcase
	wc_cart_fragments_params: Partial< WooCommerceCartFragmentsParams >;
} {
	return (
		hasOwnProperty( x, 'wc_cart_fragments_params' ) &&
		isObject( x.wc_cart_fragments_params )
	);
} //end hasWooCommerceCartFragmentsParams()

// ------
// Others
// ------

function hasJQuery( x?: unknown ): x is { jQuery: JQuery } {
	return hasOwnProperty( x, 'jQuery' ) && 'function' === typeof x.jQuery;
} //end hasJQuery()

function hasOwnProperty< Y extends PropertyKey >(
	obj: unknown,
	prop: Y
): obj is Record< Y, unknown > {
	return !! obj && typeof obj === 'object' && obj.hasOwnProperty( prop );
} //end hasOwnProperty()

// =====
// TYPES
// =====

type JQuery = ( selector: string | Node ) => JQueryElement;
type JQueryElement = {
	readonly on: (
		event: string,
		callback: ( ...args: unknown[] ) => void
	) => void;
};

type WooCommerceCart = {
	readonly items: ReadonlyArray< WooCommerceCartItem >;
};

export type WooCommerceCartItem = {
	// eslint-disable-next-line camelcase
	readonly product_id: ProductId;
	// eslint-disable-next-line camelcase
	readonly variation_id: ProductId;
	readonly quantity: number;
	// eslint-disable-next-line camelcase
	readonly line_total: number;
	// eslint-disable-next-line camelcase
	readonly line_tax: number;
	// eslint-disable-next-line camelcase
	readonly line_subtotal: number;
	// eslint-disable-next-line camelcase
	readonly line_subtotal_tax: number;
};

type WooCommerceCartFragmentsParams = {
	// eslint-disable-next-line camelcase
	readonly fragment_name: string;
};

type WooCommerceFragments = {
	// eslint-disable-next-line camelcase
	readonly nab_cart_info: WooCommerceCart;
};
