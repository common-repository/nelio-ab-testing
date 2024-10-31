/**
 * Internal dependencies
 */
import type { SiteId, SubscriptionPlan } from './user';
import type { Url } from './utils';

export type PluginSettings = {
	readonly adminUrl: Url;
	readonly apiUrl: Url;
	readonly areAutoTutorialsEnabled: boolean;
	readonly areSubscriptionControlsDisabled: boolean;
	readonly capabilities: ReadonlyArray< NabCapability >;
	readonly goalTracking: 'all-pages' | 'test-scope' | 'custom';
	readonly homeUrl: Url;
	readonly isCookieTestingEnabled: boolean;
	readonly maxCombinations: number;
	readonly minConfidence: number;
	readonly minSampleSize: number;
	readonly segmentEvaluation: 'site' | 'tested-page' | 'custom';
	readonly siteId: SiteId;
	readonly subscription: SubscriptionPlan | false;
	readonly themeSupport: {
		readonly menus: boolean;
		readonly widgets: boolean;
	};
};

export type NabCapability =
	| 'edit_nab_experiments'
	| 'delete_nab_experiments'
	| 'start_nab_experiments'
	| 'stop_nab_experiments'
	| 'pause_nab_experiments'
	| 'resume_nab_experiments'
	| 'read_nab_results'
	| 'manage_nab_options'
	| 'manage_nab_account';
