/**
 * External dependencies
 */
import { range } from 'lodash';
import { getLetter } from '@nab/utils';

type TooltipContext< R > = {
	readonly raw: R;
	readonly dataset: {
		readonly label: string;
	};
};

// TODO. This is a workaround... I don’t know how to do it better.
export function isTooltipContext< R >( x: unknown ): x is TooltipContext< R > {
	return !! x;
} //end isTooltipContext()

export const generateNLabels = ( count: number ): ReadonlyArray< string > =>
	range( count ).map( getLetter );
