/**
 * External dependencies
 */
import type { EntityId, TermId } from '@nab/types';

export type PostType = {
	readonly name: string;
	readonly slug: string;
	readonly viewable: boolean;
	readonly hierarchical: boolean;
	readonly labels: PostTypeLabels;
};

export type PostTypeLabels = {
	// eslint-disable-next-line camelcase
	readonly all_items: string;
	// eslint-disable-next-line camelcase
	readonly search_items: string;
	// eslint-disable-next-line camelcase
	readonly singular_name?: string;
};

export type Term = {
	readonly id: TermId;
	readonly slug: string;
	readonly name: string;
};

export type SelectResult< TItem, TId > =
	| {
			readonly finished: false;
			readonly items: ReadonlyArray< TItem >;
			readonly pendingItems: ReadonlyArray< TId >;
	  }
	| {
			readonly finished: true;
			readonly items: ReadonlyArray< TItem >;
			readonly missingItems: ReadonlyArray< TId >;
	  };

export type SearchQuery = {
	readonly search?: string;
	readonly exclude?: ReadonlyArray< EntityId | TermId >;
	readonly page?: number;
	// eslint-disable-next-line camelcase
	readonly per_page?: number;
	// eslint-disable-next-line camelcase
	readonly nelio_popups_search_by_title?: boolean;
};

export type QueryResult< T > =
	| {
			readonly finished: false;
	  }
	| {
			readonly finished: true;
			readonly items: ReadonlyArray< T >;
			readonly more: boolean;
	  };
