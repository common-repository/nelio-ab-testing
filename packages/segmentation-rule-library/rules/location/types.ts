export type Attributes = {
	readonly condition: 'is-equal-to' | 'is-not-equal-to';
	readonly location: ReadonlyArray< Value >;
};

type Value = {
	readonly value: string;
	readonly label: string;
};
