export const DEFAULT_ATTRS: Attrs = {
	name: '',
	value: '',
	_placeholder: '',
};

export type Attrs = {
	readonly name: string;
	readonly value: string;
	readonly _placeholder: string;
};

export type SetAttrs = ( attrs: Partial< Attrs > ) => void;
