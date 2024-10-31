/**
 * Internal dependencies
 */
import { daysList } from './days';

export type Attributes = {
	readonly condition: 'is-equal-to' | 'is-not-equal-to';
	readonly values: ReadonlyArray< Value >;
};

export type Value = Distribute< Keys >;

type Dict = typeof daysList;
type Keys = keyof Dict;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Distribute< K > = K extends Keys
	? { readonly value: K; readonly label: Dict[ K ] }
	: never;
