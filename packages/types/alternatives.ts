/**
 * External dependencies
 */
import type { Brand } from 'ts-brand';

/**
 * Internal dependencies
 */
import type { Dict } from './utils';

export type AlternativeId = 'control' | Brand< string, 'AlternativeId' >;
export type AlternativeIndex = number;

export type Alternative< A extends Dict = Dict > = {
	readonly id: AlternativeId;
	readonly attributes: A & {
		readonly name?: string;
	};
	readonly base?: AlternativeId;
	readonly isLastApplied?: boolean;
	readonly links: {
		readonly edit: string;
		readonly heatmap: string;
		readonly preview: string;
	};
};
