/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import {
	createInterpolateElement,
	useEffect,
	useState,
} from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { find, map } from 'lodash';
import { ItemSelectControl } from '@nab/components';
import { hasHead, listify } from '@nab/utils';
import type {
	ExperimentEditProps,
	Maybe,
	ProductSelection,
	SelectedProductTerms,
	TermId,
} from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';

import {
	useProductCategoryLabel,
	useProductCategories,
	useProductTagLabel,
	useProductTags,
} from '../../hooks';
import type { ControlAttributes } from '../../types';

const DEFAULT_ATTRS = {
	productSelections: [ { type: 'all-products' } ] as const,
};

export const Original = (
	props: ExperimentEditProps< ControlAttributes >
): JSX.Element => {
	const { setAttributes } = props;
	const { productSelections } = props.attributes;

	useEffect( () => {
		if ( ! productSelections.length ) {
			setAttributes( DEFAULT_ATTRS );
			return;
		} //end if

		if ( ! hasHead( productSelections ) ) {
			setAttributes( DEFAULT_ATTRS );
			return;
		} //end if
		if ( productSelections[ 0 ].type !== 'some-products' ) {
			setAttributes( DEFAULT_ATTRS );
			return;
		} //end if

		const selection = productSelections[ 0 ].value;
		if ( selection.type !== 'product-taxonomies' ) {
			setAttributes( DEFAULT_ATTRS );
			return;
		} //end if

		setAttributes(
			makeCatTagFilter( { selection: productSelections[ 0 ] } )
		);
	}, [] );

	const selection =
		productSelections[ 0 ] ?? DEFAULT_ATTRS.productSelections[ 0 ];

	const categories =
		selection.type === 'some-products' &&
		selection.value.type === 'product-taxonomies'
			? find( selection.value.value, { taxonomy: 'product_cat' } )
					?.termIds || []
			: [];
	const tags =
		selection.type === 'some-products' &&
		selection.value.type === 'product-taxonomies'
			? find( selection.value.value, { taxonomy: 'product_tag' } )
					?.termIds || []
			: [];

	const [ areProductsFiltered, enableProductFilter ] = useState(
		!! categories.length || !! tags.length
	);

	return (
		<div>
			<p className="nab-woocommerce-bulk-sale-original">
				{ areProductsFiltered
					? _x( 'Selected Products', 'text', 'nelio-ab-testing' )
					: _x( 'All Products', 'text', 'nelio-ab-testing' ) }
				{ ! areProductsFiltered && (
					<span className="nab-woocommerce-bulk-sale-original__filter-action">
						<Button
							variant="link"
							onClick={ () => enableProductFilter( true ) }
						>
							{ _x( 'Filter', 'command', 'nelio-ab-testing' ) }
						</Button>
					</span>
				) }
			</p>

			{ areProductsFiltered && (
				<ProductFilters
					categories={ categories }
					tags={ tags }
					setCategories={ ( cats ) =>
						setAttributes( makeCatTagFilter( { selection, cats } ) )
					}
					setTags={ ( value ) =>
						setAttributes(
							makeCatTagFilter( { selection, tags: value } )
						)
					}
				/>
			) }
		</div>
	);
};

// ============
// HELPER VIEWS
// ============

type ProductFilterProps = {
	readonly categories: ReadonlyArray< TermId >;
	readonly tags: ReadonlyArray< TermId >;
	readonly setCategories: ( cats: ReadonlyArray< TermId > ) => void;
	readonly setTags: ( tags: ReadonlyArray< TermId > ) => void;
};

const ProductFilters = ( props: ProductFilterProps ) => {
	const {
		categories: selectedCategories,
		tags: selectedTags,
		setCategories,
		setTags,
	} = props;

	const explanation = useFilterExplanation(
		selectedCategories,
		selectedTags
	);

	const categoryLabel = useProductCategoryLabel();
	const allCats = useProductCategories();

	const tagLabel = useProductTagLabel();
	const allTags = useProductTags();

	return (
		<>
			<div className="nab-woocommerce-bulk-sale-original__product-filters">
				<div>
					<ItemSelectControl
						label={ categoryLabel }
						kind="taxonomy"
						name="product_cat"
						disabled={ ! allCats?.length }
						value={ selectedCategories }
						onChange={ setCategories }
					/>
				</div>

				<div>
					<ItemSelectControl
						label={ tagLabel }
						kind="taxonomy"
						name="product_tag"
						disabled={ ! allTags?.length }
						value={ selectedTags }
						onChange={ setTags }
					/>
				</div>
			</div>
			<p className="nab-woocommerce-bulk-sale-original__explanation">
				{ explanation }
			</p>
		</>
	);
};

// =======
// HELPERS
// =======

const makeCatTagFilter = ( attrs: {
	readonly selection: ProductSelection;
	readonly cats?: ReadonlyArray< TermId >;
	readonly tags?: ReadonlyArray< TermId >;
} ): ControlAttributes => {
	const { selection, cats, tags } = attrs;
	const taxonomies =
		selection.type === 'some-products' &&
		selection.value.type === 'product-taxonomies'
			? selection.value.value
			: [];

	const catTax: SelectedProductTerms = {
		type: 'product-terms',
		taxonomy: 'product_cat',
		mode: 'or',
		termIds: [],
		...find( taxonomies, { taxonomy: 'product_cat' } ),
		...( cats ? { termIds: cats } : {} ),
	};

	const tagTax: SelectedProductTerms = {
		type: 'product-terms',
		taxonomy: 'product_tag',
		mode: 'or',
		termIds: [],
		...find( taxonomies, { taxonomy: 'product_tag' } ),
		...( tags ? { termIds: tags } : {} ),
	};

	if ( ! catTax.termIds.length && ! tagTax.termIds.length ) {
		return DEFAULT_ATTRS;
	} //end if

	return {
		productSelections: [
			{
				type: 'some-products',
				value: {
					type: 'product-taxonomies',
					value: [
						!! catTax.termIds.length && catTax,
						!! tagTax.termIds.length && tagTax,
					].filter( ( x ): x is SelectedProductTerms => !! x ),
				},
			},
		],
	};
};

const useFilterExplanation = (
	cats: Maybe< ReadonlyArray< TermId > >,
	tags: Maybe< ReadonlyArray< TermId > >
): JSX.Element => {
	const allCats = useProductCategories();
	const getCatName = ( id: TermId ): string =>
		find( allCats, { id } )?.name || `#${ id }`;

	const allTags = useProductTags();
	const getTagName = ( id: TermId ): string =>
		find( allTags, { id } )?.name || `#${ id }`;

	if ( cats?.length && tags?.length ) {
		return beautify(
			sprintf(
				/* translators: 1 -> list of category names, 2 -> list of tag names */
				_x(
					'This test applies to products in category %1$s and tagged as %2$s.',
					'text',
					'nelio-ab-testing'
				),
				listify( 'or', map( map( cats, getCatName ), strong ) ),
				listify( 'or', map( map( tags, getTagName ), strong ) )
			)
		);
	} //end if

	if ( cats?.length ) {
		return beautify(
			sprintf(
				/* translators: list of category names */
				_x(
					'This test applies to products in category %s.',
					'text',
					'nelio-ab-testing'
				),
				listify( 'or', map( map( cats, getCatName ), strong ) )
			)
		);
	} //end if

	if ( tags?.length ) {
		return beautify(
			sprintf(
				/* translators: list of tag names */
				_x(
					'This test applies to products tagged as %s.',
					'text',
					'nelio-ab-testing'
				),
				listify( 'or', map( map( tags, getTagName ), strong ) )
			)
		);
	} //end if

	return (
		<>
			{ _x(
				'This test applies to all products in your store.',
				'text',
				'nelio-ab-testing'
			) }
		</>
	);
};

// =======
// HELPERS
// =======

const beautify = ( text: string ): JSX.Element =>
	createInterpolateElement(
		// eslint-disable-next-line @wordpress/valid-sprintf
		text,
		{ em: <em />, strong: <strong /> }
	);

const strong = ( t: string ): string => `<strong>${ t }</strong>`;
