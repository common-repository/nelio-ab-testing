/**
 * Internal dependencies
 */
import type { FieldId, Attributes } from './types';

export type Action = SetValueAction | SetAttributesAction;

export function setValue( field: FieldId, value: unknown ): SetValueAction {
	return {
		type: 'SET_FIELD_VALUE',
		field,
		value,
	};
} //end setFieldValue()

export function setAttributes(
	field: FieldId,
	attributes: Attributes
): SetAttributesAction {
	return {
		type: 'SET_FIELD_ATTRIBUTES',
		field,
		attributes,
	};
} //end setFieldAttributes()

// ============
// HELPER TYPES
// ============

type SetValueAction = {
	readonly type: 'SET_FIELD_VALUE';
	readonly field: FieldId;
	readonly value: unknown;
};

type SetAttributesAction = {
	readonly type: 'SET_FIELD_ATTRIBUTES';
	readonly field: FieldId;
	readonly attributes: Attributes;
};
