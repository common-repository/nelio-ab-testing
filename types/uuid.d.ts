declare module 'uuid' {
	export type Uuid = string & { __type__: 'Uuid' };
	export const v4: <T extends string = Uuid>() => T;
}
