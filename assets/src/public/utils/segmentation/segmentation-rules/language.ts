/**
 * Internal dependencies
 */
import type { Attributes } from '../../../../../../packages/segmentation-rule-library/rules/language/types';

export const type = 'nab/language';

export function validate( attributes: Attributes ): boolean {
	const { condition, language } = attributes;

	const currentLanguage = ( window.navigator.language || '' ).toLowerCase();

	switch ( condition ) {
		case 'is-equal-to':
			return language.some( ( { value } ) =>
				currentLanguage.startsWith( value )
			);

		case 'is-not-equal-to':
			return language.every(
				( { value } ) => ! currentLanguage.startsWith( value )
			);
	} //end switch
} //end validate()
