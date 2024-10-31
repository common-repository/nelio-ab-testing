export type Attributes = {
	readonly condition:
		| 'is-any-of'
		| 'is-none-of'
		| 'is-equal-to'
		| 'is-not-equal-to'
		| 'contains'
		| 'does-not-contain';
	readonly value: string;
};
