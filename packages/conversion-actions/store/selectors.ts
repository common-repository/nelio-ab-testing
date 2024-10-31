/**
 * External dependencies
 */
import { values } from 'lodash';
import type {
	ConversionActionType,
	ConversionActionTypeName,
	Dict,
	Maybe,
} from '@nab/types';

/**
 * Internal dependencies
 */
import type { State } from './types';

export function getConversionActionTypes(
	state: State
): ReadonlyArray< ConversionActionType > {
	return values( state.conversionActionTypes );
} //end getConversionActionTypes()

type GetConversionActionType = typeof _getConversionActionType & {
	CurriedSignature: < T extends Dict = Dict >(
		name: ConversionActionTypeName
	) => Maybe< ConversionActionType< T > >;
};
export const getConversionActionType =
	_getConversionActionType as GetConversionActionType;
function _getConversionActionType< T extends Dict = Dict >(
	state: State,
	name: ConversionActionTypeName
): Maybe< ConversionActionType< T > > {
	return state.conversionActionTypes[ name ] as ConversionActionType< T >;
} //end _getConversionActionType()
