/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim } from 'lodash';
import { isUrlFragmentInvalid } from '@nab/utils';

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
				'Please write the exact name for the URL parameter',
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
				'Please write a value for the URL parameter',
				'user',
				'nelio-ab-testing'
			),
		};
	} //end if

	switch ( condition ) {
		case 'contains':
		case 'does-not-contain':
		case 'is-equal-to':
		case 'is-not-equal-to': {
			const isInvalid = isUrlFragmentInvalid( value );
			return isInvalid ? { value: isInvalid } : {};
		} //end case

		case 'is-any-of':
		case 'is-none-of': {
			const isInvalid = value
				.split( '\n' )
				.map( isUrlFragmentInvalid )
				.filter( ( x ) => !! x )[ 0 ];
			return isInvalid ? { value: isInvalid } : {};
		} //end case
	} //end switch
} //end validate()
