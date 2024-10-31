/**
 * External dependencies
 */
import UaParser from 'ua-parser-js';

/**
 * Internal dependencies
 */
import type { Attributes } from '../../../../../../packages/segmentation-rule-library/rules/operating-system/types';

export const type = 'nab/operating-system';

export function validate( attributes: Attributes ): boolean {
	const { condition, values } = attributes;

	const visitorOS = getVisitorOS();

	switch ( condition ) {
		case 'is-equal-to':
			return values.some( ( { value } ) => isSameOS( value, visitorOS ) );

		case 'is-not-equal-to':
			return values.every(
				( { value } ) => ! isSameOS( value, visitorOS )
			);
	} //end switch
} //end validate()

function getVisitorOS() {
	const parser = new UaParser();
	const operatingSystemData = parser.getOS();
	let osName = operatingSystemData.name;

	if ( 'Windows' === osName && operatingSystemData.version ) {
		osName += ' ' + operatingSystemData.version;
	} //end if

	if (
		'Mac OS' === osName &&
		operatingSystemData.version &&
		operatingSystemData.version.startsWith( '10' )
	) {
		osName += ' X';
	} //end if

	return osName;
} //end getVisitorOS()

function isSameOS( operatingSystemName: string, visitorOS?: string ) {
	if (
		'Windows' === operatingSystemName &&
		'string' === typeof visitorOS &&
		visitorOS.startsWith( 'Windows' )
	) {
		return true;
	} //end if

	return operatingSystemName === visitorOS;
} //end isSameOS()
