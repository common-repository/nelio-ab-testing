export type State = {
	readonly values: Record< FieldId, unknown >;
	readonly attributes: Record< FieldId, Attributes >;
};

export type FieldId = string;

export type Attributes = Record< string, unknown >;
