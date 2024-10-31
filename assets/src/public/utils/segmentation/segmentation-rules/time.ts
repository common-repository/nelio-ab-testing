/**
 * Internal dependencies
 */
import type { Attributes } from '../../../../../../packages/segmentation-rule-library/rules/time/types';

export const type = 'nab/time';

export function validate( attributes: Attributes ): boolean {
	const PERIODS = [
		'00-02',
		'02-04',
		'04-06',
		'06-08',
		'08-10',
		'10-12',
		'12-14',
		'14-16',
		'16-18',
		'18-20',
		'20-22',
		'22-24',
	];
	const { condition, values } = attributes;

	const visitorHour = new Date().getHours();
	const visitorPeriod = Math.floor( visitorHour / 2 );

	switch ( condition ) {
		case 'is-equal-to':
			return values.some(
				( { value } ) => value === PERIODS[ visitorPeriod ]
			);

		case 'is-not-equal-to':
			return values.every(
				( { value } ) => value !== PERIODS[ visitorPeriod ]
			);
	} //end switch
} //end validate()
