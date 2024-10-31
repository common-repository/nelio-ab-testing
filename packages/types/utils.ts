/**
 * External dependencies
 */
import type { Brand } from 'ts-brand';

// =======
// GENERIC
// =======

export type Dict< T = unknown > = Record< string, T >;

export type Maybe< T > = T | undefined;

export type Coords = {
	readonly x: number;
	readonly y: number;
};

export type Dims = {
	readonly height: number;
	readonly width: number;
};

export type AnyAction = Dict & {
	readonly type: string;
};

export type Url = Brand< string, 'Url' >;

export type BoundingBox = {
	readonly top: number;
	readonly left: number;
	readonly width: number;
	readonly height: number;
};

// =========
// API FETCH
// =========

export type PaginatedResults< T > = {
	readonly results: T;
	readonly pagination: {
		readonly more: boolean;
		readonly pages: number;
	};
};

// ======
// STORES
// ======

/* eslint-disable @typescript-eslint/no-explicit-any */
export type WithResolverSelect<
	S extends Record< string, ( ...args: any[] ) => any >,
	RS extends Record< string, ( ...args: any[] ) => any >,
> = S & {
	readonly isResolving: ResolverSelect< RS >;
	readonly hasFinishedResolution: ResolverSelect< RS >;
	readonly hasResolutionFailed: ResolverSelect< RS >;
};

export type WithResolverDispatch<
	S extends Record< string, ( ...args: any[] ) => any >,
	RS extends Record< string, ( ...args: any[] ) => any >,
> = S & {
	readonly invalidateResolution: ResolverDispatch< RS >;
};

type ResolverSelect< RS extends Record< string, ( ...args: any[] ) => any > > =
	< K extends keyof RS >(
		state: unknown,
		fn: K,
		args?: Parameters< RS[ NoInfer< K > ] >
	) => boolean;

type ResolverDispatch<
	RS extends Record< string, ( ...args: any[] ) => any >,
> = < K extends keyof RS >(
	fn: K,
	args?: Parameters< RS[ NoInfer< K > ] >
) => boolean;
