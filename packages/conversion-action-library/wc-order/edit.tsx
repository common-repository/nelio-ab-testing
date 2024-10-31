/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	BaseControl,
	ToggleControl,
	ExternalLink,
} from '@safe-wordpress/components';
import { useInstanceId } from '@safe-wordpress/compose';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';
import { createInterpolateElement, useEffect } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { ErrorText, PostSearcher } from '@nab/components';
import { store as NAB_DATA } from '@nab/data';
import type {
	AllProducts,
	CAEditProps,
	ProductId,
	ProductSelection,
	SomeProducts,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { modernize } from './helpers';
import type { Attributes } from './types';

export const Edit = ( {
	attributes: attrs,
	setAttributes: setAttrs,
	errors,
}: CAEditProps< Attributes > ): JSX.Element => {
	const instanceId = useInstanceId( Edit );

	const { value: attributes } = modernize( attrs );
	const productId =
		attributes.type === 'some-products' &&
		attributes.value.type === 'product-ids'
			? attributes.value.productIds[ 0 ] || 0
			: 0;

	const setAttributes = ( value: ProductSelection ): void =>
		setAttrs( {
			type: 'product-selection',
			value,
		} );

	useEffect( () => {
		if ( attrs.type === 'product-selection' ) {
			return;
		} //end if
		setAttributes( attributes );
	}, [] );

	return (
		<>
			<ToggleControl
				label={ _x(
					'Track conversion if the order contains a specific product.',
					'command',
					'nelio-ab-testing'
				) }
				checked={ attributes.type === 'some-products' }
				onChange={ ( any ) =>
					setAttributes( any ? SOME_PRODUCTS : ALL_PRODUCTS )
				}
			/>

			{ attributes.type === 'some-products' &&
				attributes.value.type === 'product-ids' && (
					<BaseControl
						id={ `nab-conversion-action__wc-add-to-cart-${ instanceId }` }
						className={ classnames( {
							'nab-conversion-action__field--has-errors':
								errors.type,
						} ) }
						label={ <Label productId={ productId } /> }
						help={ <ErrorText value={ errors.type } /> }
					>
						<PostSearcher
							id={ `nab-conversion-action__wc-add-to-cart-${ instanceId }` }
							type="product"
							perPage={ 10 }
							value={ productId }
							onChange={ ( newProductId ) =>
								setAttributes( {
									type: 'some-products',
									value: {
										type: 'product-ids',
										mode: 'and',
										// @ts-expect-error Product IDs are always numbers.
										productIds: newProductId
											? [ newProductId ]
											: [],
									},
								} )
							}
						/>
					</BaseControl>
				) }
		</>
	);
};

const Label = ( { productId }: { productId: ProductId } ) => {
	const permalink = useProductPermalink( productId );

	if ( ! permalink ) {
		return <span>{ _x( 'Product', 'text', 'nelio-ab-testing' ) }</span>;
	} //end if

	return (
		<span>
			{ createInterpolateElement(
				_x( 'Product (<a>View</a>)', 'text', 'nelio-ab-testing' ),
				// @ts-expect-error children prop is set by createInterpolateComponent.
				{ a: <ExternalLink href={ permalink } /> }
			) }
		</span>
	);
};

// =========
// CONSTANTS
// =========

const ALL_PRODUCTS: AllProducts = {
	type: 'all-products',
};

const SOME_PRODUCTS: SomeProducts = {
	type: 'some-products',
	value: {
		type: 'product-ids',
		mode: 'and',
		productIds: [],
	},
};

// =====
// HOOKS
// =====

const useProductPermalink = ( productId: ProductId ) =>
	useSelect(
		( select ) =>
			select( NAB_DATA ).getEntityRecord( 'product', productId )?.link
	);
