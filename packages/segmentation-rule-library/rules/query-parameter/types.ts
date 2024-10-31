export type Attributes = {
	readonly name: string;
	readonly condition:
		| 'is-any-of'
		| 'is-none-of'
		| 'is-equal-to'
		| 'is-not-equal-to'
		| 'contains'
		| 'does-not-contain'
		| 'exists'
		| 'does-not-exist';
	readonly value: string;
};
