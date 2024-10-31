/**
 * Internal dependencies
 */
import type { Attributes } from '../../../../../../packages/segmentation-rule-library/rules/referring-url/types';

export const type = 'nab/referring-url';

export function validate( attributes: Attributes ): boolean {
	const { condition, value } = attributes;

	const referrer = document.referrer;

	switch ( condition ) {
		case 'is-any-of':
			return value
				.split( '\n' )
				.filter( ( url ) => !! url )
				.some( ( url ) => url === referrer );

		case 'is-none-of':
			return value
				.split( '\n' )
				.filter( ( url ) => !! url )
				.every( ( url ) => url !== referrer );

		case 'is-equal-to':
			return referrer === value;

		case 'is-not-equal-to':
			return referrer !== value;

		case 'contains':
			return !! referrer?.includes( value );

		case 'does-not-contain':
			return ! referrer || ! referrer.includes( value );
	} //end switch
} //end validate()
