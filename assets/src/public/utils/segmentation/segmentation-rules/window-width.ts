/**
 * Internal dependencies
 */
import type { Attributes } from '../../../../../../packages/segmentation-rule-library/rules/window-width/types';

export const type = 'nab/window-width';

export function validate( attributes: Attributes ): boolean {
	const { condition, value, interval } = attributes;

	const currentWidth =
		window.innerWidth ||
		document.documentElement.clientWidth ||
		document.body.clientWidth;

	switch ( condition ) {
		case 'is-greater-than':
			return undefined !== value && currentWidth > value;

		case 'is-less-than':
			return undefined !== value && currentWidth < value;

		case 'between':
			return (
				'number' === typeof interval?.min &&
				'number' === typeof interval?.max &&
				interval.min <= currentWidth &&
				currentWidth <= interval.max
			);
	} //end switch
} //end validate()
