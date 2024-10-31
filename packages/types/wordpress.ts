/**
 * External dependencies
 */
import type { Brand } from 'ts-brand';

/**
 * Internal dependencies
 */
export type MediaId = 0 | Brand< number, 'MediaId' >;

export type PostId = 0 | Brand< number, 'PostId' >;

// ==========
// TAXONOMIES
// ==========

export type TaxonomyName = string;

export type TermId = 0 | Brand< number, 'TermId' >;

export type Term = {
	readonly id: TermId;
	readonly name: string;
};
