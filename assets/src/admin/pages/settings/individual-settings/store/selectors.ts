/**
 * External dependencies
 */
import type { Maybe } from '@nab/types';

/**
 * Internal dependencies
 */
import type { State, FieldId, Attributes } from './types';

type GetValue = typeof _getValue & {
	CurriedSignature: < T >( fieldId: FieldId ) => Maybe< T >;
};
export const getValue = _getValue as GetValue;
function _getValue< T >( state: State, fieldId: FieldId ): Maybe< T > {
	return state.values[ fieldId ] as T;
} //end _getValue()

type GetAttributes = typeof _getAttributes & {
	CurriedSignature: < A extends Attributes = Attributes >(
		fieldId: FieldId
	) => Maybe< A >;
};
export const getAttributes = _getAttributes as GetAttributes;
function _getAttributes< A extends Attributes = Attributes >(
	state: State,
	fieldId: FieldId
): Maybe< A > {
	return state.attributes[ fieldId ] as Maybe< A >;
} //end _getAttributes()
