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
import type { Attributes } from './types';

export function validate( {
	name,
	condition,
	value: originalValue,
}: Attributes ): Partial< Record< keyof Attributes, string > > {
	if ( ! name ) {
		return {
			name: _x(
				'Please write the exact name for the cookie',
				'user',
				'nelio-ab-testing'
			),
		};
	} //end if

	if ( 'exists' === condition || 'does-not-exist' === condition ) {
		return {};
	} //end if

	const value = originalValue
		.split( '\n' )
		.map( trim )
		.filter( ( v ) => !! v )
		.join( '\n' );

	if ( ! value ) {
		return {
			value: _x(
				'Please write a value for the cookie',
				'user',
				'nelio-ab-testing'
			),
		};
	} //end if

	switch ( condition ) {
		case 'contains':
		case 'does-not-contain':
		case 'is-any-of':
		case 'is-equal-to':
		case 'is-none-of':
		case 'is-not-equal-to':
			return {};
	} //end switch
} //end validate()
