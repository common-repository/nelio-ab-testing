/**
 * Internal dependencies
 */
import { getQueryArgs } from '../../url';
import type { Attributes } from '../../../../../../packages/segmentation-rule-library/rules/query-parameter/types';

export const type = 'nab/query-parameter';

export function validate( attributes: Attributes ): boolean {
	const { name, condition, value } = attributes;

	const actualValue = getQueryArgs( document.URL )[ name ];

	switch ( condition ) {
		case 'is-any-of':
			return value
				.split( '\n' )
				.filter( ( expected ) => !! expected )
				.some( ( expectedValue ) => expectedValue === actualValue );

		case 'is-none-of':
			return value
				.split( '\n' )
				.filter( ( expected ) => !! expected )
				.every( ( expectedValue ) => expectedValue !== actualValue );

		case 'is-equal-to':
			return actualValue === value;

		case 'is-not-equal-to':
			return actualValue !== value;

		case 'contains':
			return !! actualValue?.includes( value );

		case 'does-not-contain':
			return ! actualValue || ! actualValue.includes( value );

		case 'exists':
			return undefined !== actualValue;

		case 'does-not-exist':
			return undefined === actualValue;
	} //end switch
} //end validate()
