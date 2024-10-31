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
import { createInterpolateElement } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
	ConversionActionScope,
	ErrorText,
	PostSearcher,
} from '@nab/components';
import { store as NAB_DATA } from '@nab/data';
import type { CAEditProps, ProductId } from '@nab/types';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export const Edit = ( {
	attributes: { anyProduct, productId },
	scope,
	errors,
	setAttributes,
	setScope,
}: CAEditProps< Attributes > ): JSX.Element => {
	const instanceId = useInstanceId( Edit );
	return (
		<>
			<ToggleControl
				label={ _x(
					'Track conversion if a specific product is added to the shopping cart.',
					'command',
					'nelio-ab-testing'
				) }
				checked={ ! anyProduct }
				onChange={ () => setAttributes( { anyProduct: ! anyProduct } ) }
			/>

			{ ! anyProduct && (
				<BaseControl
					id={ `nab-conversion-action__wc-order-${ instanceId }` }
					className={ classnames( {
						'nab-conversion-action__field--has-errors':
							errors.productId,
					} ) }
					label={ <Label productId={ productId } /> }
					help={ <ErrorText value={ errors.productId } /> }
				>
					<PostSearcher
						id={ `nab-conversion-action__wc-order-${ instanceId }` }
						type="product"
						perPage={ 10 }
						value={ productId }
						onChange={ ( newProductId ) =>
							// @ts-expect-error Product IDs are always numbers.
							setAttributes( { productId: newProductId } )
						}
					/>
				</BaseControl>
			) }

			<ConversionActionScope
				scope={ scope }
				setScope={ setScope }
				error={ errors._scope }
			/>
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

// =====
// HOOKS
// =====

const useProductPermalink = ( productId: ProductId ) =>
	useSelect(
		( select ) =>
			select( NAB_DATA ).getEntityRecord( 'product', productId )?.link
	);
