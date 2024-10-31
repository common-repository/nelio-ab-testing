/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type {
	ConversionActionType,
	ConversionActionTypeName,
} from '@nab/types';

export type Action = AddConversionActionTypes | RemoveConversionActionTypes;

export function addConversionActionTypes(
	conversionActionTypes:
		| ConversionActionType
		| ReadonlyArray< ConversionActionType >
): AddConversionActionTypes {
	return {
		type: 'ADD_CONVERSION_ACTION_TYPES',
		conversionActionTypes: castArray( conversionActionTypes ),
	};
} //end addConversionActionTypes()

export function removeConversionActionTypes(
	names: ConversionActionTypeName | ReadonlyArray< ConversionActionTypeName >
): RemoveConversionActionTypes {
	return {
		type: 'REMOVE_CONVERSION_ACTION_TYPES',
		names: castArray( names ),
	};
} //end removeConversionActionTypes()

// ============
// HELPER TYPES
// ============

type AddConversionActionTypes = {
	readonly type: 'ADD_CONVERSION_ACTION_TYPES';
	readonly conversionActionTypes: ReadonlyArray< ConversionActionType >;
};

type RemoveConversionActionTypes = {
	readonly type: 'REMOVE_CONVERSION_ACTION_TYPES';
	readonly names: ReadonlyArray< ConversionActionTypeName >;
};
