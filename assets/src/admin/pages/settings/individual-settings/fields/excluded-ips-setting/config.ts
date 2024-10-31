export const DEFAULT_ATTRS: Attrs = {
	ips: [],
};

export type Attrs = {
	readonly ips: ReadonlyArray< string >;
	readonly shouldForceUpdate?: true;
};

export type SetAttrs = ( attrs: Partial< Attrs > ) => void;
