/**
 * WordPress dependencies
 */
import { useSelect } from '@safe-wordpress/data';
import { store as CORE } from '@safe-wordpress/core-data';
import type { Taxonomy } from '@safe-wordpress/core-data';

/**
 * External dependencies
 */
import type { Maybe, Term } from '@nab/types';

export const useProductCategoryLabel = (): string =>
	useSelect( ( select ) => {
		const tax: Maybe< Taxonomy > = select( CORE ).getEntityRecord(
			'root',
			'taxonomy',
			'product_cat'
		);
		return tax?.name ?? 'Product categories';
	} );

export const useProductCategories = (): Maybe< ReadonlyArray< Term > > =>
	useTerms( 'product_cat' );

export const useProductTagLabel = (): string =>
	useSelect( ( select ) => {
		const tax: Maybe< Taxonomy > = select( CORE ).getEntityRecord(
			'root',
			'taxonomy',
			'product_tag'
		);
		return tax?.name ?? 'Product tags';
	} );

export const useProductTags = (): Maybe< ReadonlyArray< Term > > =>
	useTerms( 'product_tag' );

// =======
// HELPERS
// =======

const useTerms = ( taxonomy: string ): Maybe< ReadonlyArray< Term > > =>
	useSelect( ( select ): Maybe< ReadonlyArray< Term > > => {
		const cats = select( CORE ).getEntityRecords( 'taxonomy', taxonomy, {
			per_page: -1,
		} ) as unknown as ReadonlyArray< Term >;
		const isResolving = select( CORE ).isResolving( 'getEntityRecords', [
			'taxonomy',
			taxonomy,
			{ per_page: -1 },
		] );
		return cats && ! isResolving ? cats.map( formatTermName ) : undefined;
	} );

const el = document.createElement( 'div' );
const formatTermName = ( t: Term ): Term => {
	el.innerHTML = t.name;
	return { ...t, name: el.textContent ?? t.name };
};
