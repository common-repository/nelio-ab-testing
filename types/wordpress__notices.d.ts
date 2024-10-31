// NOTE. This applies to WP6.3.
// WPNotice has an invalid type for status,
// making it incompatible with NoticeList from
// @wordpress/components.

import * as actions from '@wordpress/notices/build-types/store/actions';

type Selectors = {
	readonly getNotices: () => {
		readonly id: string;
		readonly content: string;
		readonly status?: 'warning' | 'success' | 'error' | 'info';
	}[];
};

declare module '@wordpress/notices' {
	export const store: import('@wordpress/data/build-types/types').StoreDescriptor<
		import('@wordpress/data/build-types/types').ReduxStoreConfig<
			any,
			typeof actions,
			Selectors
		>
	>;
}
