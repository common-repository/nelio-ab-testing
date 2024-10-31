/**
 * External dependencies
 */
import UaParser from 'ua-parser-js';

/**
 * Internal dependencies
 */
import type { Attributes } from '../../../../../../packages/segmentation-rule-library/rules/browser/types';

export const type = 'nab/browser';

export function validate( attributes: Attributes ): boolean {
	const { condition, values } = attributes;

	const visitorBrowser = getVisitorBrowser();

	switch ( condition ) {
		case 'is-equal-to':
			return values.some( ( { value } ) =>
				isSameBrowser( value, visitorBrowser )
			);

		case 'is-not-equal-to':
			return values.every(
				( { value } ) => ! isSameBrowser( value, visitorBrowser )
			);
	} //end switch
} //end validate()

function getVisitorBrowser() {
	const parser = new UaParser();
	const browserData = parser.getBrowser();
	return browserData.name;
} //end getVisitorBrowser()

function isSameBrowser( browserName: string, visitorBrowserName?: string ) {
	return browserName === visitorBrowserName;
} //end isSameBrowser()
