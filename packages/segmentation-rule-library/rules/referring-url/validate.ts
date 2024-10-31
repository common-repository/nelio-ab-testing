/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim } from 'lodash';

/**
 * Internal dependencies
 */
import { isUrlFragmentInvalid, isUrlInvalid } from '@nab/utils';
import type { Attributes } from './types';

export function validate( {
	condition,
	value: originalValue,
}: Attributes ): Partial< Record< keyof Attributes, string > > {
	const value = originalValue
		.split( '\n' )
		.map( trim )
		.filter( ( v ) => !! v )
		.join( '\n' );

	if ( ! value ) {
		return {
			value: _x(
				'Please write a value for the referring URL',
				'user',
				'nelio-ab-testing'
			),
		};
	} //end if

	switch ( condition ) {
		case 'is-equal-to':
		case 'is-not-equal-to':
			const a = isUrlInvalid( value );
			return a ? { value: a } : {};

		case 'contains':
		case 'does-not-contain':
			const b = isUrlFragmentInvalid( value );
			return b ? { value: b } : {};

		case 'is-any-of':
		case 'is-none-of':
			const error = value
				.split( '\n' )
				.map( isUrlInvalid )
				.filter( ( e ) => !! e )[ 0 ];
			return error ? { value: error } : {};
	} //end switch
} //end validate()
