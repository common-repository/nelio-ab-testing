/**
 * WordPress dependencies
 */
import { _x, sprintf } from '@safe-wordpress/i18n';
import { Component, isValidElement } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { difference, isFunction } from 'lodash';
import type { ConversionActionScope, Dict, Maybe } from '@nab/types';

/**
 * Returns the error (if any) in the given conversion action scope.
 *
 * @param scope ConversionActionScope the scope.
 *
 * @return string|undefined the error (if any)
 */
export function getConversionActionScopeError(
	scope: ConversionActionScope
): Maybe< string > {
	switch ( scope.type ) {
		case 'all-pages':
			return undefined;

		case 'test-scope':
			return undefined;

		case 'php-function':
			return undefined;

		case 'post-ids':
			return ! scope.ids.length
				? _x(
						'Please write one or more post IDs',
						'user',
						'nelio-ab-testing'
				  )
				: undefined;

		case 'urls':
			return ! scope.regexes.length
				? _x(
						'Please write one or more URLs',
						'user',
						'nelio-ab-testing'
				  )
				: undefined;
	} //end switch
} //end getConversionActionScopeError()

/**
 * Function that checks if the parameter is a valid icon.
 *
 * @param {*} icon Parameter to be checked.
 *
 * @return {boolean} True if the parameter is a valid icon and false otherwise.
 */
export function isValidIcon(
	icon: unknown
): icon is () => JSX.Element | Component {
	return (
		!! icon &&
		( isValidElement( icon as Dict ) ||
			isFunction( icon ) ||
			icon instanceof Component )
	);
} //end isValidIcon()

/**
 * Checks whether the regular expression is invalid or not. If it is, returns the issue.
 *
 * @param {string} regex the regular expression to test.
 *
 * @return {boolean|string} if the regular expression is invalid, it returns a string describing why it's wrong. Otherwise, it returns false;
 */
export function isRegExpInvalid( regex: string ): string | false {
	try {
		new RegExp( regex );
	} catch ( e ) {
		return sprintf(
			/* translators: error triggered by JavaScript when compiling regular expression */
			_x( 'Invalid regular expression. %s', 'text', 'nelio-ab-testing' ),
			e
		);
	} //end try

	return false;
} //end isRegExpInvalid()

/**
 * Checks whether the given string can be a fragment of a URL or not.
 *
 * @param {string} urlFragment a string that's supposed to be a partial URL.
 *
 * @return {boolean|string} if the url fragment is invalid, it returns a string describing why it's wrong. Otherwise, it returns false;
 */
export function isUrlFragmentInvalid( urlFragment: string ): string | false {
	if ( / /.test( urlFragment ) ) {
		return _x( 'Value contains spaces.', 'user', 'nelio-ab-testing' );
	} //end if

	if ( /[^A-Za-z0-9-._~:/?#[\]@!$&'()*+,;=]/.test( urlFragment ) ) {
		return _x(
			'Value contains characters that can’t be found in a URL',
			'text',
			'nelio-ab-testing'
		);
	} //end if

	return false;
} //end isUrlFragmentInvalid()

/**
 * Checks whether the given string can be a valid URL or not.
 *
 * @param {string} url a string that's supposed to be an URL.
 *
 * @return {boolean|string} if the url is invalid, it returns a string describing why it's wrong. Otherwise, it returns false;
 */
export function isUrlInvalid( url: string ): string | false {
	const pattern = new RegExp(
		'' +
			'^(https?:\\/\\/)?' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
			'(\\#[-a-z\\d_]*)?$',
		'i'
	); // fragment locator

	if ( ! pattern.test( url ) ) {
		return _x( 'Value is not a valid URL', 'text', 'nelio-ab-testing' );
	} //end if

	return false;
} //end isUrlInvalid()

export function getLocalUrlError( url = '', homeUrl?: string ): string | false {
	if ( ! homeUrl ) {
		return false;
	} //end if

	if ( 0 !== url.indexOf( homeUrl ) ) {
		return sprintf(
			/* translators: a URL */
			_x(
				'Please type in a URL that starts with your WordPress home URL (%s)',
				'user',
				'nelio-ab-testing'
			),
			homeUrl
		);
	} //end if

	if ( isUrlFragmentInvalid( url.replace( homeUrl, '' ) ) ) {
		return _x(
			'Please type in a valid URL to track',
			'user',
			'nelio-ab-testing'
		);
	} //end if

	return false;
} //end getLocalUrlError()

export const isDefined = < T >( value: Maybe< T > ): value is T =>
	undefined !== value;

const EMPTY_VALUES: unknown[] = [ 0, 0.0, '', false, null, undefined ];
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isEmpty( value: unknown ): boolean {
	if ( EMPTY_VALUES.includes( value ) ) {
		return true;
	} //end if

	if ( hasLengthFunction( value ) && 0 === value.length() ) {
		return true;
	} //end if

	if ( value && 'object' === typeof value ) {
		return 0 === Object.keys( value ).length;
	} //end if

	return false;
} //end isEmpty()

export function areEqual< T >(
	arr1: ReadonlyArray< T >,
	arr2: ReadonlyArray< T >
): boolean {
	return arr1.length === arr2.length && isEmpty( difference( arr1, arr2 ) );
} //end areEqual()

// =======
// HELPERS
// =======

const hasLengthFunction = ( v: unknown ): v is { length: () => number } =>
	!! v && 'object' === typeof v && 'length' in v && 'function' === v.length;
