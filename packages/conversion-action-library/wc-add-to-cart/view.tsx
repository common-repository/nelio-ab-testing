/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { createInterpolateElement } from '@safe-wordpress/element';
import { sprintf, _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NAB_DATA } from '@nab/data';
import { ConversionActionScopeView } from '@nab/components';
import type { CAViewProps, ProductId } from '@nab/types';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export const View = ( props: CAViewProps< Attributes > ): JSX.Element => (
	<>
		<div>
			<ActualView { ...props } />
		</div>
		<ConversionActionScopeView scope={ props.scope } />
	</>
);

const ActualView = ( {
	attributes: { anyProduct, productId },
}: CAViewProps< Attributes > ): JSX.Element => {
	const productTitle = useProductTitle( productId );

	if ( anyProduct ) {
		return (
			<>
				{ _x(
					'Any product is added to the shopping cart.',
					'text',
					'nelio-ab-testing'
				) }
			</>
		);
	} //end if

	if ( ! productTitle ) {
		return (
			<>
				{ _x(
					'A specific product is added to the shopping cart.',
					'text',
					'nelio-ab-testing'
				) }
			</>
		);
	} //end if

	return (
		<>
			{ createInterpolateElement(
				sprintf(
					/* translators: the name of a product */
					_x(
						'The product %s is added to the shopping cart.',
						'text',
						'nelio-ab-testing'
					),
					sprintf( '<strong>%s</strong>', productTitle )
				),
				{ strong: <strong /> }
			) }
		</>
	);
};

// =====
// HOOKS
// =====

const useProductTitle = ( productId: ProductId ) =>
	useSelect(
		( select ) =>
			select( NAB_DATA ).getEntityRecord( 'product', productId )?.title
	);
