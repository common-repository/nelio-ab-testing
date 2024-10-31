export type Attributes = {
	readonly mode: 'exact' | 'partial' | 'start' | 'end' | 'regex';
	readonly value: string;
};
