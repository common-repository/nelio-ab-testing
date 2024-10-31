/**
 * WordPress dependencies
 */
import { useSelect } from '@safe-wordpress/data';
import { store as CORE } from '@safe-wordpress/core-data';
import type {
	Post,
	Type as PostType,
	Taxonomy,
} from '@safe-wordpress/core-data';

/**
 * External dependencies
 */
import { every, filter, find, map } from 'lodash';
import type { EntityId, EntityKindName, Maybe, TermId } from '@nab/types';

/**
 * Internal dependencies
 */
import type { QueryResult, SearchQuery, SelectResult, Term } from './types';

type Kind = 'postType' | 'taxonomy';

export function usePostTypes(): ReadonlyArray< PostType > {
	const postTypes = useAllPostTypes();
	return filter( postTypes, ( p ) => p.viewable && 'nelio_popup' !== p.slug );
} //end usePostTypes()

export function useTaxonomies(
	postType?: EntityKindName
): ReadonlyArray< Taxonomy > {
	const taxonomies = useAllTaxonomies();
	return filter(
		taxonomies,
		( t ) => ! postType || t.types.includes( postType )
	);
} //end useTaxonomies()

export function useEntityKind< K extends Kind >(
	kind: K,
	name: string
): Maybe< K extends 'postType' ? PostType : Taxonomy > {
	const postTypes = useAllPostTypes();
	const taxonomies = useAllTaxonomies();
	const types: ReadonlyArray< PostType | Taxonomy > =
		'postType' === kind ? postTypes : taxonomies;
	return find( types, { slug: name } ) as Maybe<
		K extends 'postType' ? PostType : Taxonomy
	>;
} //end useEntityKind()

export function useEntityRecordSearch< K extends Kind >(
	kind: K,
	name: string,
	query: SearchQuery
): QueryResult< K extends 'postType' ? Post : Term > {
	query = { per_page: 10, ...query };

	const records = useSelect(
		( select ): ReadonlyArray< Post > | ReadonlyArray< Term > =>
			// @ts-expect-error Term is a custom type, but it should work.
			select( CORE ).getEntityRecords( kind, name, query ) || []
	);

	const hasFinished = useSelect( ( select ) =>
		select( CORE ).hasFinishedResolution( 'getEntityRecords', [
			kind,
			name,
			query,
		] )
	);

	if ( ! hasFinished ) {
		return { finished: false };
	} //end if

	const items: ReadonlyArray< Post > | ReadonlyArray< Term > =
		'postType' === kind
			? records.filter( isPost )
			: map( records.filter( isTerm ), formatTermName );
	return {
		finished: true,
		items: items as ReadonlyArray< K extends 'postType' ? Post : Term >,
		more: query.per_page === items.length,
	};
} //end useEntityRecordSearch()

export function useEntityRecords< K extends Kind >(
	kind: K,
	name: string,
	itemIds: ReadonlyArray< K extends 'postType' ? EntityId : TermId >
): SelectResult<
	K extends 'postType' ? Post : Term,
	K extends 'postType' ? EntityId : TermId
> {
	itemIds = itemIds ?? [];

	const records = useSelect( ( select ) => {
		const { getEntityRecord } = select( CORE );
		return itemIds.map(
			( itemId ): Maybe< Post | Term > =>
				getEntityRecord( kind, name, itemId )
		);
	} );

	const finishedStatuses = useSelect( ( select ) => {
		const { hasFinishedResolution } = select( CORE );
		return itemIds.map( ( itemId ) =>
			hasFinishedResolution( 'getEntityRecord', [ kind, name, itemId ] )
		);
	} );

	const hasFinished = every( finishedStatuses );
	const items: ReadonlyArray< Post > | ReadonlyArray< Term > =
		'postType' === kind
			? records.filter( isPost )
			: map( records.filter( isTerm ), formatTermName );
	const loadedItemIds = items.map(
		( { id } ) => id as K extends 'postType' ? EntityId : TermId
	);
	const pendingItems = itemIds.filter(
		( id ) => ! loadedItemIds.includes( id )
	);

	const result: SelectResult< Post | Term, EntityId | TermId > = ! hasFinished
		? { finished: false, items, pendingItems }
		: { finished: true, items, missingItems: pendingItems };

	return result as SelectResult<
		K extends 'postType' ? Post : Term,
		K extends 'postType' ? EntityId : TermId
	>;
} // end useEntityRecords()

// =======
// HELPERS
// =======

const useAllPostTypes = (): ReadonlyArray< PostType > =>
	useSelect(
		( select ): ReadonlyArray< PostType > =>
			select( CORE ).getEntityRecords( 'root', 'postType', {
				per_page: -1,
			} ) || []
	);

const useAllTaxonomies = () =>
	filter(
		useSelect(
			( select ): ReadonlyArray< Taxonomy > =>
				select( CORE ).getEntityRecords( 'root', 'taxonomy', {
					per_page: -1,
				} ) || []
		),
		( t ) => t.visibility.public
	);

const isPost = ( p?: unknown ): p is Post =>
	!! p &&
	'object' === typeof p &&
	'id' in p &&
	!! p.id &&
	'slug' in p &&
	!! p.slug &&
	'type' in p &&
	!! p.type &&
	'title' in p &&
	'object' === typeof p.title &&
	!! p.title &&
	'raw' in p.title &&
	!! p.title.raw;

const isTerm = ( t?: unknown ): t is Term =>
	!! t &&
	'object' === typeof t &&
	'id' in t &&
	'slug' in t &&
	'name' in t &&
	!! t.id &&
	!! t.slug &&
	!! t.name;

const el = document.createElement( 'div' );
const formatTermName = ( term: Term ): Term => {
	el.innerHTML = term.name;
	return { ...term, name: el.textContent ?? term.name };
};
