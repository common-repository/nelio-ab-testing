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
	values,
}: Attributes ): Partial< Record< keyof Attributes, string > > {
	if ( isEmpty( values ) ) {
		return {
			values: _x(
				'Please select one or more browsers',
				'user',
				'nelio-ab-testing'
			),
		};
	} //end if

	return {};
} //end validate()
