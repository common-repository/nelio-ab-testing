/**
 * Internal dependencies
 */
import { getSegmentationGeoData } from '../index';
import type { Attributes } from '../../../../../../packages/segmentation-rule-library/rules/ip-address/types';

export const type = 'nab/ip-address';

export function validate( attributes: Attributes ): boolean {
	const { condition, values } = attributes;

	const geoData = getSegmentationGeoData();
	const visitorIp = geoData.ipAddress;
	if ( 'string' !== typeof visitorIp ) {
		return false;
	} //end if

	switch ( condition ) {
		case 'is-equal-to':
			return values.some( ( ipPattern ) =>
				matches( visitorIp, ipPattern )
			);

		case 'is-not-equal-to':
			return values.every(
				( ipPattern ) => ! matches( visitorIp, ipPattern )
			);
	} //end switch
} //end validate()

function matches( ip: string, pattern: string ) {
	const re = pattern.replace( '*', '\\d?\\d?\\d' ).replace( '.', '\\.' );
	return new RegExp( re ).test( ip );
} //end matches()
