declare module '@wordpress/core-data' {
	export * from '@wordpress/core-data/build-types';

	export type GetRecordsHttpQuery = {
		readonly search?: string;
		readonly exclude?: ReadonlyArray< number >;
		readonly page?: number;
		// eslint-disable-next-line camelcase
		readonly per_page?: number;
		readonly who?: 'authors';
		readonly context?: 'edit' | 'view';
	};

	export const store: import('@wordpress/data/build-types/types').StoreDescriptor<
		import('@wordpress/data/build-types/types').ReduxStoreConfig<
			any,
			typeof import('@wordpress/core-data/build-types/actions') & {
				readonly startResolution: ( fn: string, args: any[] ) => void;
				readonly finishResolution: ( fn: string, args: any[] ) => void;
			},
			typeof import('@wordpress/core-data/build-types/selectors') & {
				readonly hasFinishedResolution: (
					state: any,
					fn: string,
					args: any[]
				) => boolean;
				readonly hasResolutionFailed: (
					state: any,
					fn: string,
					args: any[]
				) => boolean;
				readonly isResolving: (
					state: any,
					fn: string,
					args: any[]
				) => boolean;
			}
		>
	>;
}
