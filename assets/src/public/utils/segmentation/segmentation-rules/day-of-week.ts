/**
 * Internal dependencies
 */
import type { Attributes } from '../../../../../../packages/segmentation-rule-library/rules/day-of-week/types';

export const type = 'nab/day-of-week';

export function validate( attributes: Attributes ): boolean {
	const DAYS = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];
	const { condition, values } = attributes;

	const visitorDay = new Date().getDay();

	switch ( condition ) {
		case 'is-equal-to':
			return values.some( ( { value } ) => value === DAYS[ visitorDay ] );

		case 'is-not-equal-to':
			return values.every(
				( { value } ) => value !== DAYS[ visitorDay ]
			);
	} //end switch
} //end validate()
