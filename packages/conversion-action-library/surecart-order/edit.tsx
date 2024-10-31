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
import { createInterpolateElement, useEffect } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { ErrorText, PostSearcher } from '@nab/components';
import { store as NAB_DATA } from '@nab/data';
import type {
	AllSureCartProducts,
	CAEditProps,
	SomeSureCartProducts,
	SureCartProductdId,
	SureCartProductSelection,
} from '@nab/types';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export const Edit = ( {
	attributes: attrs,
	setAttributes: setAttrs,
	errors,
}: CAEditProps< Attributes > ): JSX.Element => {
	const instanceId = useInstanceId( Edit );

	const { value: attributes } = attrs;
	const productId =
		attributes.type === 'some-surecart-products' &&
		attributes.value.type === 'surecart-ids'
			? attributes.value.productIds[ 0 ] || ''
			: '';

	const setAttributes = ( value: SureCartProductSelection ): void =>
		setAttrs( {
			type: 'surecart-selection',
			value,
		} );

	useEffect( () => {
		if ( attrs.type === 'surecart-selection' ) {
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
				checked={ attributes.type === 'some-surecart-products' }
				onChange={ ( any ) =>
					setAttributes( any ? SOME_PRODUCTS : ALL_PRODUCTS )
				}
			/>

			{ attributes.type === 'some-surecart-products' &&
				attributes.value.type === 'surecart-ids' && (
					<BaseControl
						id={ `nab-conversion-action__surecart-add-to-cart-${ instanceId }` }
						className={ classnames( {
							'nab-conversion-action__field--has-errors':
								errors.type,
						} ) }
						label={ <Label productId={ productId } /> }
						help={ <ErrorText value={ errors.type } /> }
					>
						<PostSearcher
							id={ `nab-conversion-action__surecart-add-to-cart-${ instanceId }` }
							type="sc_product"
							perPage={ 10 }
							value={ productId }
							onChange={ ( newProductId ) =>
								setAttributes( {
									type: 'some-surecart-products',
									value: {
										type: 'surecart-ids',
										mode: 'and',
										// @ts-expect-error SC Product IDs are always strings.
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

const Label = ( { productId }: { productId: SureCartProductdId } ) => {
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

const ALL_PRODUCTS: AllSureCartProducts = {
	type: 'all-surecart-products',
};

const SOME_PRODUCTS: SomeSureCartProducts = {
	type: 'some-surecart-products',
	value: {
		type: 'surecart-ids',
		mode: 'and',
		productIds: [],
	},
};

// =====
// HOOKS
// =====

const useProductPermalink = ( productId: SureCartProductdId ) =>
	useSelect(
		( select ) =>
			select( NAB_DATA ).getEntityRecord( 'sc_product', productId )?.link
	);
