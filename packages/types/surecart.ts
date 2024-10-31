/**
 * Internal dependencies
 */
import type { GenericId } from './entities';

export type SureCartProductdId = GenericId;

export type SureCartProductSelection =
	| AllSureCartProducts
	| SomeSureCartProducts;

export type AllSureCartProducts = {
	readonly type: 'all-surecart-products';
};

export type SomeSureCartProducts = {
	readonly type: 'some-surecart-products';
	readonly value: SelectedSureCartProductdIds;
};

export type SelectedSureCartProductdIds = {
	readonly type: 'surecart-ids';
	readonly productIds: ReadonlyArray< SureCartProductdId >;
	readonly mode: 'or' | 'and';
	readonly excluded?: boolean;
};
