/**
 * Internal dependencies
 */
import type { PostId, TaxonomyName, TermId } from './wordpress';

export type DownloadId = PostId;

export type DownloadSelection = AllDownloads | SomeDownloads;

export type AllDownloads = {
	readonly type: 'all-downloads';
};

export type SomeDownloads = {
	readonly type: 'some-downloads';
	readonly value: SelectedDownloadIds | SelectedDownloadTaxonomies;
};

export type SelectedDownloadIds = {
	readonly type: 'download-ids';
	readonly downloadIds: ReadonlyArray< DownloadId >;
	readonly mode: 'or' | 'and';
	readonly excluded?: boolean;
};

export type SelectedDownloadTaxonomies = {
	readonly type: 'download-taxonomies';
	readonly value: ReadonlyArray< SelectedDownloadTerms >;
};

export type SelectedDownloadTerms = {
	readonly type: 'download-terms';
	readonly taxonomy: TaxonomyName;
	readonly termIds: ReadonlyArray< TermId >;
	readonly mode: 'or' | 'and';
	readonly excluded?: boolean;
};
