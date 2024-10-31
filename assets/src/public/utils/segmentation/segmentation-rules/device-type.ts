/**
 * External dependencies
 */
import UaParser from 'ua-parser-js';

/**
 * Internal dependencies
 */
import type { Attributes } from '../../../../../../packages/segmentation-rule-library/rules/device-type/types';

export const type = 'nab/device-type';

export function validate( attributes: Attributes ): boolean {
	const { condition, values } = attributes;

	const parser = new UaParser();
	const visitorDeviceType = parser.getDevice().type || 'desktop';

	switch ( condition ) {
		case 'is-equal-to':
			return values.some( ( { value } ) => value === visitorDeviceType );

		case 'is-not-equal-to':
			return values.every( ( { value } ) => value !== visitorDeviceType );
	} //end switch
} //end validate()
