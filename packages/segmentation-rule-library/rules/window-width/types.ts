export type Attributes = {
	readonly condition: 'is-greater-than' | 'is-less-than' | 'between';
	readonly value?: number;
	readonly interval: {
		readonly min?: number;
		readonly max?: number;
	};
};
