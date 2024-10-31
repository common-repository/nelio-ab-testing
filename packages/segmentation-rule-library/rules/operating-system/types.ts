/**
 * Internal dependencies
 */
import { operatingSystemList } from './operating-systems';

export type Attributes = {
	readonly condition: 'is-equal-to' | 'is-not-equal-to';
	readonly values: ReadonlyArray< Value >;
};

export type Value = Distribute< OS >;

type OS = ( typeof operatingSystemList )[ number ];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Distribute< U > = U extends any
	? { readonly value: U; readonly label: U }
	: never;
