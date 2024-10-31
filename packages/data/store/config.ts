/**
 * External dependencies
 */
import type { SiteId, Url } from '@nab/types';

/**
 * Internal dependencies
 */
import type { State } from './types';

export const INIT_STATE: State = {
	entities: {
		config: [],
		data: {},
	},

	experiments: {},

	fastspring: {
		currency: 'USD',
		products: [],
		subscriptionId: '',
	},

	media: {},

	page: {
		isLocked: false,
		sidebarDimensions: {
			top: 0,
			height: '100vh',
			applyFix: true,
		},
	},

	results: {},

	settings: {
		today: '2013-01-01',
		menus: {},
		nelio: {
			adminUrl: '/wp-admin/' as Url,
			apiUrl: '' as Url,
			areAutoTutorialsEnabled: true,
			areSubscriptionControlsDisabled: false,
			capabilities: [],
			goalTracking: 'all-pages',
			homeUrl: '/' as Url,
			isCookieTestingEnabled: false,
			maxCombinations: 24,
			minConfidence: 95,
			minSampleSize: 100,
			segmentEvaluation: 'site',
			siteId: '' as SiteId,
			subscription: false,
			themeSupport: {
				menus: false,
				widgets: false,
			},
		},
		plugins: [],
		templateContexts: {},
		templates: {},
		themes: {},
		ecommerce: {
			woocommerce: {
				currency: 'USD',
				currencyPosition: 'before',
				currencySymbol: '$',
				decimalSeparator: '.',
				numberOfDecimals: 2,
				orderStatuses: [],
				thousandsSeparator: ',',
			},
			edd: {
				currency: 'USD',
				currencyPosition: 'before',
				currencySymbol: '$',
				decimalSeparator: '.',
				numberOfDecimals: 2,
				orderStatuses: [],
				thousandsSeparator: ',',
			},
		},
	},

	siteQuota: undefined,
};
