/**
 * WordPress dependencies.
 */
import { dispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';
import { store as NOTICES } from '@safe-wordpress/notices';

/**
 * External dependencies.
 */
import { omit, keys, mapValues, values, sortBy, reduce, reverse } from 'lodash';
import type { Dict } from '@nab/types';

/* eslint-disable @wordpress/i18n-no-flanking-whitespace */
const AND = _x( ' and ', 'text (2 item list)', 'nelio-ab-testing' );
const AND_PLUS = _x( ', and ', 'text (2+ item list)', 'nelio-ab-testing' );
const OR = _x( ' or ', 'text (2 item list)', 'nelio-ab-testing' );
const OR_PLUS = _x( ', or ', 'text (2+ item list)', 'nelio-ab-testing' );
/* eslint-enable @wordpress/i18n-no-flanking-whitespace */

export const hasHead = < T >( arr: ReadonlyArray< T > ): arr is [ T, ...T[] ] =>
	arr.length > 0;

export const isSingleton = < T >( arr: ReadonlyArray< T > ): arr is [ T ] =>
	arr.length === 1;

export const isMultiArray = < T >(
	arr: ReadonlyArray< T >
): arr is [ T, T, ...T[] ] => arr.length > 1;

export const isNumber = ( n: unknown ): n is number => 'number' === typeof n;

export function logError( n: unknown ): void {
	// eslint-disable-next-line no-console
	console.log( '[NAB]', n );
} //end logError()

export function listify(
	mode: 'and' | 'or',
	tokens: ReadonlyArray< string >
): string {
	if ( ! hasHead( tokens ) ) {
		return '';
	} //end if

	if ( ! hasAtLeastTwoItems( tokens ) ) {
		return tokens[ 0 ];
	} //end if

	const andor = (): string => {
		if ( 'and' === mode ) {
			return tokens.length === 2 ? AND : AND_PLUS;
		} //end if
		return tokens.length === 2 ? OR : OR_PLUS;
	};

	const [ z, y, ...x ] = reverse( tokens );
	return [ ...reverse( x ), `${ y }${ andor() }${ z }` ].join( ', ' );
} //end listify()

export async function createErrorNotice(
	error: unknown,
	defaultError?: string
): Promise< void > {
	if ( hasErrors( error ) ) {
		await dispatch( NOTICES ).createErrorNotice(
			values( error.errors )[ 0 ] ?? ''
		);
		return;
	} //end if

	if ( hasMessage( error ) ) {
		await dispatch( NOTICES ).createErrorNotice( error.message );
		return;
	} //end if

	if ( 'string' === typeof error ) {
		await dispatch( NOTICES ).createErrorNotice( error );
		return;
	} //end if

	const message =
		defaultError ?? _x( 'Unknown error', 'text', 'nelio-ab-testing' );
	await dispatch( NOTICES ).createErrorNotice( message );
} //end createErrorNotice()

export function omitUndefineds< T extends Dict >( obj: T ): T {
	return omit(
		obj,
		keys( obj ).filter( ( k ) => undefined === obj[ k ] )
	) as T;
} //end omitUndefineds()

export function sortObjectKeysUsingValue< T extends Record< string, string > >(
	obj: T
): T {
	const collection = mapValues( obj, ( value, key ) => ( { key, value } ) );
	const unsortedList = values( collection );
	const sortedList = sortBy( unsortedList, 'value' );
	return reduce(
		sortedList,
		( acc, { key, value } ) => {
			acc[ key ] = value;
			return acc;
		},
		{} as Record< string, string >
	) as T;
} //end sortObjectKeysUsingValue()

export function getLetter( index: number ): string {
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXY';
	if ( index >= letters.length ) {
		return 'Z';
	} //end if
	return letters.charAt( index );
} //end getLetter()

// =======
// HELPERS
// =======

const hasAtLeastTwoItems = < T >(
	arr: ReadonlyArray< T >
): arr is [ T, T, ...T[] ] => arr.length >= 2;

const hasErrors = ( x: unknown ): x is { errors: Record< string, string > } =>
	!! values( ( x as Dict ).errors )[ 0 ];

const hasMessage = ( x: unknown ): x is { message: string } =>
	!! x &&
	'object' === typeof x &&
	'string' === typeof ( x as Dict ).message &&
	!! ( x as Dict ).message;
