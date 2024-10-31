/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

const NRE = '(25[0-5]|2[0-4][0-9]|1[0-9]{2}|0?[0-9]?[0-9]|\\*)';
const IP_REGEXP = new RegExp( `^${ NRE }\\.${ NRE }\\.${ NRE }\\.${ NRE }$` );

export function validate( {
	values,
}: Attributes ): Partial< Record< keyof Attributes, string > > {
	if ( ! values.length ) {
		return {
			values: _x(
				'Please write a valid IP address',
				'user',
				'nelio-ab-testing'
			),
		};
	} //end if

	if ( values.every( isValidIP ) ) {
		return {};
	} //end if

	return {
		values: _x(
			'Please make sure all IP addresses are valid',
			'user',
			'nelio-ab-testing'
		),
	};
} //end validate()

function isValidIP( ipAddress: string ) {
	return IP_REGEXP.test( ipAddress );
} //end isValidIP()
