/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * WordPress dependencies
 */
export * from '@wordpress/data';
import {
	register as doRegister,
	resolveSelect as doResolveSelect,
	subscribe as doSubscribe,
	useSelect as doUseSelect,
} from '@wordpress/data';
import type {
	MapSelect,
	StoreDescriptor,
	UseSelectReturn,
} from '@wordpress/data/build-types/types';

// ==========
// TYPESCRIPT
// ==========

// register should exist.
export function register( store: StoreDescriptor< any > ): void {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	doRegister( store );
} //end register()

// subscribe should exist.
export function subscribe(
	listener: () => void,
	store?: StoreDescriptor< any > | string
): () => void {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
	return doSubscribe( listener, store );
} //end subscribe()

// useSelect should properly infer types, but it doesn’t, so we manually fix it.
export function useSelect< T extends MapSelect | StoreDescriptor< any > >(
	mapSelect: T,
	dependencies?: unknown[]
): UseSelectReturn< T > {
	// @ts-expect-error Dependencies are optional
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return doUseSelect< T >( mapSelect, dependencies );
} //end useSelect()

// resolveSelect should properly infer types, but it doesn’t, so we manually fix it.
export function resolveSelect< T extends StoreDescriptor< any > >(
	key: T
): ResolvableSelectors< UseSelectReturn< T > > {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
	return doResolveSelect( key );
} //end resolveSelect()

type ResolvableSelectors<
	S extends Record< string, ( ...args: any[] ) => any >,
> = {
	readonly [ K in keyof S ]: S[ K ] extends {
		PromisedSignature: ( ...args: any[] ) => any;
	}
		? S[ K ][ 'PromisedSignature' ]
		: S[ K ] extends ( ...args: infer A ) => infer R
		? ( ...args: A ) => Promise< R >
		: never;
};
