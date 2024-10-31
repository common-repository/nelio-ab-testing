export const DEFAULT_ATTRS: Attrs = {
	mode: 'redirection',
};

export type Attrs = {
	readonly mode: 'redirection' | 'cookie';
	readonly redirectIfCookieIsMissing?: boolean;
	readonly lockParticipationSettings?: boolean;
};

export type SetAttrs = ( attrs: Partial< Attrs > ) => void;
