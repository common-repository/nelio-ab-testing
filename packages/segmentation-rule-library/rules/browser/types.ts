/**
 * Internal dependencies
 */
import { browsersList } from './browsers';

export type Attributes = {
	readonly condition: 'is-equal-to' | 'is-not-equal-to';
	readonly values: ReadonlyArray< Value >;
};

export type Value = Distribute< Keys >;

type Dict = typeof browsersList;
type Keys = keyof Dict;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Distribute< K > = K extends Keys
	? { readonly value: K; readonly label: Dict[ K ] }
	: never;
