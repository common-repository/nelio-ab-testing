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
import { map, trim } from 'lodash';
import { store as NAB_DATA } from '@nab/data';
import { listify } from '@nab/utils';
import type {
	CAViewProps,
	SureCartProductdId,
	SelectedSureCartProductdIds,
	SomeSureCartProducts,
} from '@nab/types';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export const View = ( {
	attributes,
}: CAViewProps< Attributes > ): JSX.Element => {
	const { value: selection } = attributes;

	switch ( selection.type ) {
		case 'all-surecart-products':
			return <AllProductsView />;

		case 'some-surecart-products':
			return <SomeProductsView selection={ selection.value } />;
	} //end switch
};

// ============
// HELPER VIEWS
// ============

type HelperViewProps< T = unknown > = {
	readonly selection: T;
};

const AllProductsView = (): JSX.Element => {
	return <>{ _x( 'An order is paid.', 'text', 'nelio-ab-testing' ) }</>;
};

const SomeProductsView = ( {
	selection,
}: HelperViewProps< SomeSureCartProducts[ 'value' ] > ): JSX.Element => (
	<ProductList selection={ selection } />
);

const ProductList = ( {
	selection,
}: HelperViewProps< SelectedSureCartProductdIds > ): JSX.Element => {
	const { productIds, mode, excluded = false } = selection;

	const productNames = map( useProductNames( productIds ), strong );

	switch ( productNames.length ) {
		case 0:
			return beautify( ORDER_STATUS );

		case 1:
			return beautify(
				// eslint-disable-next-line @wordpress/valid-sprintf
				sprintf(
					excluded
						? PRODUCT_LABELS.singleExcluded
						: PRODUCT_LABELS.singleIncluded,
					productNames[ 0 ]
				)
			);

		default:
			return beautify(
				// eslint-disable-next-line @wordpress/valid-sprintf
				sprintf(
					excluded
						? PRODUCT_LABELS.multipleExcluded
						: PRODUCT_LABELS.multipleIncluded,
					listify( mode, productNames )
				)
			);
	} //end switch
};

// =======
// HELPERS
// =======

const beautify = ( text: string ): JSX.Element =>
	createInterpolateElement(
		// eslint-disable-next-line @wordpress/valid-sprintf
		text,
		{ strong: <strong /> }
	);

const strong = ( t: string ): string => `<strong>${ t }</strong>`;

// =====
// HOOKS
// =====

const useProductNames = ( productIds: ReadonlyArray< SureCartProductdId > ) =>
	useSelect( ( select ) =>
		productIds.map(
			( productId ) =>
				trim(
					select( NAB_DATA ).getEntityRecord(
						'sc_product',
						productId
					)?.title
				) ||
				sprintf(
					/* translators: product id */
					_x( 'Product #%s', 'text', 'nelio-ab-testing' ),
					productId
				)
		)
	);

// =========
// CONSTANTS
// =========

type Labels = {
	readonly singleExcluded: string;
	readonly singleIncluded: string;
	readonly multipleExcluded: string;
	readonly multipleIncluded: string;
};

/* translators: woocommerce order status */
const ORDER_STATUS = _x(
	'The status of an order is set to paid.',
	'text',
	'nelio-ab-testing'
);

const PRODUCT_LABELS: Labels = {
	/* translators: product name */
	singleExcluded: _x(
		'The status of an order not containing product %s is set to paid.',
		'text',
		'nelio-ab-testing'
	),
	/* translators: product name */
	singleIncluded: _x(
		'The status of an order containing the product %s is set to paid.',
		'text',
		'nelio-ab-testing'
	),
	/* translators: list of product names */
	multipleExcluded: _x(
		'The status of an order not containing any of the products %s is set to paid.',
		'text',
		'nelio-ab-testing'
	),
	/* translators: list of product names */
	multipleIncluded: _x(
		'The status of an order containing products %s is set to paid.',
		'text',
		'nelio-ab-testing'
	),
};
