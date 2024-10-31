/**
 * Internal dependencies
 */
import type { Maybe, SiteId, Url } from '@nab/types';

/**
 * Internal dependencies
 */
import type { Settings } from '../../../types';

export const getSettings = (): Maybe< Required< Settings > > => {
	const win = window as unknown;
	if ( ! hasSettings( win ) ) {
		return;
	} //end if

	const settings = win.nabSettings;
	return {
		alternativeUrls: [],
		ajaxUrl: '' as Url,
		api: { mode: 'native', url: '' as Url },
		cookieTesting: false,
		excludeBots: true,
		experiments: [],
		forceECommerceSessionSync: false,
		gdprCookie: { name: '', value: '' },
		heatmaps: [],
		hideQueryArgs: false,
		ignoreTrailingSlash: true,
		isStagingSite: false,
		isTestedPostRequest: false,
		maxCombinations: 2,
		numOfAlternatives: 0,
		optimizeXPath: true,
		participationChance: 100,
		preloadQueryArgUrls: [],
		referrerParam: '',
		segmentMatching: 'all',
		site: '' as SiteId,
		timezone: '',
		useSendBeacon: true,
		version: 'unknown',
		...settings,
		throttle: {
			global: fixThrottleWait( settings.throttle?.global ),
			woocommerce: fixThrottleWait( settings.throttle?.woocommerce ),
		},
	};
};

// ========
// INTERNAL
// ========

const hasSettings = (
	win: unknown
): win is { nabSettings: Partial< Settings > } =>
	!! win && 'object' === typeof win && 'nabSettings' in win;

function fixThrottleWait( wait = 0 ): number {
	return Math.max( 0, Math.min( 10, wait ) );
} //end fixThrottleWait()
