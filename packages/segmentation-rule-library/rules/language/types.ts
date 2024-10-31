/**
 * Internal dependencies
 */
import { languageList } from '@nab/utils';

export type Attributes = {
	readonly condition: 'is-equal-to' | 'is-not-equal-to';
	readonly language: ReadonlyArray< Value >;
};

type Dict = typeof languageList;
type Keys = keyof Dict;
type Value = Distribute< Keys >;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Distribute< K > = K extends Keys
	? { readonly value: K; readonly label: Dict[ K ] }
	: never;
