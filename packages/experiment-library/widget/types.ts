// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type ControlAttributes = {};

export type AlternativeAttributes = {
	readonly name: string;
	readonly sidebars: ReadonlyArray< AlternativeSidebar >;
};

export type AlternativeSidebar = {
	readonly id: string;
	readonly control: string;
};
