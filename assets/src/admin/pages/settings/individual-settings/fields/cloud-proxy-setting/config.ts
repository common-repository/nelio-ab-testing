export const DEFAULT_ATTRS: Attrs = {
	mode: 'disabled',
	isCheckingStatus: false,
	value: '',
	domain: '',
	domainStatus: 'disabled',
	dnsValidation: {},
};

export type Attrs = {
	readonly mode: 'disabled' | 'domain-forwarding' | 'rest';
	readonly isCheckingStatus: boolean;
	readonly value: string;
	readonly domain: string;
	readonly domainStatus:
		| 'disabled'
		| 'missing-forward'
		| 'cert-validation-pending'
		| 'cert-validation-success'
		| 'success';
	readonly dnsValidation: {
		readonly recordName?: string;
		readonly recordValue?: string;
	};
};

export type SetAttrs = ( attrs: Partial< Attrs > ) => void;
