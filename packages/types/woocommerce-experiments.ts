/**
 * Internal dependencies
 */
import type { PostId, TaxonomyName, TermId } from './wordpress';

export type ProductId = PostId;

export type ProductSelection = AllProducts | SomeProducts;

export type AllProducts = {
	readonly type: 'all-products';
};

export type SomeProducts = {
	readonly type: 'some-products';
	readonly value: SelectedProductIds | SelectedProductTaxonomies;
};

export type SelectedProductIds = {
	readonly type: 'product-ids';
	readonly productIds: ReadonlyArray< ProductId >;
	readonly mode: 'or' | 'and';
	readonly excluded?: boolean;
};

export type SelectedProductTaxonomies = {
	readonly type: 'product-taxonomies';
	readonly value: ReadonlyArray< SelectedProductTerms >;
};

export type SelectedProductTerms = {
	readonly type: 'product-terms';
	readonly taxonomy: TaxonomyName;
	readonly termIds: ReadonlyArray< TermId >;
	readonly mode: 'or' | 'and';
	readonly excluded?: boolean;
};
