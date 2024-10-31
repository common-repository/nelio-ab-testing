/**
 * Internal dependencies
 */
import { getSegmentationGeoData } from '../index';
import type { Attributes } from '../../../../../../packages/segmentation-rule-library/rules/location/types';

export const type = 'nab/location';

export function validate( attributes: Attributes ): boolean {
	const { condition, location } = attributes;

	const geoData = getSegmentationGeoData();
	const visitorLocation = geoData.location;
	if ( 'string' !== typeof visitorLocation ) {
		return false;
	} //end if

	switch ( condition ) {
		case 'is-equal-to':
			return location.some( ( { value } ) =>
				visitorLocation.startsWith( value )
			);

		case 'is-not-equal-to':
			return location.every(
				( { value } ) => ! visitorLocation.startsWith( value )
			);
	} //end switch
} //end validate()
