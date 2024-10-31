/**
 * External dependencies
 */
import type {
	ConversionActionType,
	ConversionActionTypeName,
} from '@nab/types';

export type State = {
	readonly conversionActionTypes: Record<
		ConversionActionTypeName,
		ConversionActionType
	>;
};
