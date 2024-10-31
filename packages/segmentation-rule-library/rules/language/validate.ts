/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { isEmpty } from '@nab/utils';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export function validate( {
	language,
}: Attributes ): Partial< Record< keyof Attributes, string > > {
	if ( isEmpty( language ) ) {
		return {
			language: _x(
				'Please select one or more languages',
				'user',
				'nelio-ab-testing'
			),
		};
	} //end if

	return {};
} //end validate()
