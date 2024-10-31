/**
 * External dependencies
 */
import type { ProductId, ProductSelection } from '@nab/types';

export type Attributes = ClassicAttributes | NewAttributes;

export type ClassicAttributes = {
	readonly type?: undefined;
	readonly anyProduct: boolean;
	readonly productId: ProductId;
};

export type NewAttributes = {
	readonly type: 'product-selection';
	readonly value: ProductSelection;
};
