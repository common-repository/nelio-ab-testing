/**
 * External dependencies
 */
import type { ProductSelection } from '@nab/types';

export type ControlAttributes = {
	readonly productSelections: ReadonlyArray< ProductSelection >;
};

export type AlternativeAttributes = {
	readonly name: string;
	readonly discount: number;
	readonly overwritesExistingSalePrice: boolean;
};
