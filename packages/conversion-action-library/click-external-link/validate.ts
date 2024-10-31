/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { isRegExpInvalid, isUrlFragmentInvalid } from '@nab/utils';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export function validate(
	attributes: Attributes
): Partial< Record< keyof Attributes, string > > {
	const { mode, value } = attributes;

	if ( ! value ) {
		return {
			value: _x(
				'Please write the expected value',
				'user',
				'nelio-ab-testing'
			),
		};
	} //end if

	if ( 'regex' === mode ) {
		const error = isRegExpInvalid( value );
		return error ? { value: error } : {};
	} //end if

	const error = isUrlFragmentInvalid( value );
	return error ? { value: error } : {};
} //end validate()
