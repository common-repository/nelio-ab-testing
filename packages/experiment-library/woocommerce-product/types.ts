/**
 * External dependencies
 */
import type { ProductId } from '@nab/types';

export type ControlAttributes = {
	readonly postId: ProductId;
	readonly postType: 'product';
	readonly disablePriceTesting?: true;
};

export type AlternativeAttributes = {
	readonly name: string;
	readonly postId: ProductId;
};
