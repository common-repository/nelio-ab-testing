/**
 * External dependencies
 */
import type {
	ConversionAction as CA,
	Dict,
	ExperimentId,
	ExperimentType,
	PageViewThrottleSettings,
	SegmentationRule,
	SiteId,
	Url,
} from '@nab/types';

// ========
// SETTINGS
// ========

export type Settings = {
	readonly alternativeUrls: ReadonlyArray< Url >;
	readonly ajaxUrl?: Url;
	readonly api: ApiSettings;
	readonly cookieTesting: false | number;
	readonly excludeBots: boolean;
	readonly experiments: ReadonlyArray< ExperimentSummary >;
	readonly forceECommerceSessionSync?: boolean;
	readonly gdprCookie: GdprCookieSetting;
	readonly heatmaps: ReadonlyArray< HeatmapSummary >;
	readonly hideQueryArgs: boolean;
	readonly ignoreTrailingSlash: boolean;
	readonly isStagingSite: boolean;
	readonly isTestedPostRequest: boolean;
	readonly maxCombinations: number;
	readonly numOfAlternatives: number;
	readonly optimizeXPath: boolean;
	readonly participationChance: number;
	readonly preloadQueryArgUrls: ReadonlyArray< PreloadQueryArgUrl >;
	readonly referrerParam: string;
	readonly segmentMatching: 'all' | 'some';
	readonly site: SiteId;
	readonly throttle: PageViewThrottleSettings;
	readonly timezone: string;
	readonly useSendBeacon: boolean;
	readonly version: string;
};

export type Session = Required< Omit< Settings, 'experiments' > > & {
	readonly alternative: number;
	readonly experiments: ReadonlyArray< Experiment >;
	readonly currentUrl: string;
	readonly untestedUrl: string;
};

export type ParamValue = string | number | boolean;

export type PreloadQueryArgUrl =
	| {
			readonly type: 'alt-urls';
			readonly altUrls: ReadonlyArray< Url >;
			readonly altCount: number;
	  }
	| {
			readonly type: 'scope';
			readonly scope: ReadonlyArray< UrlOrPartialUrl >;
			readonly altCount: number;
	  };

// ===========
// EXPERIMENTS
// ===========

export type ExperimentSummary =
	| ActiveExperimentSummary
	| InactiveExperimentSummary;

export type ActiveExperimentSummary = Omit<
	InactiveExperimentSummary,
	'active' | 'alternatives'
> & {
	readonly active: true;
	readonly alternatives:
		| ReadonlyArray< AlternativeSummary >
		| ReadonlyArray< ScriptAlternative >;
	readonly heatmapTracking: boolean;
	readonly pageViewTracking: 'header' | 'footer' | 'script';
	readonly inline?: {
		readonly load: 'header' | 'footer';
		readonly mode: 'unwrap' | 'visibility' | 'script';
	};
};

export type InactiveExperimentSummary = {
	readonly active: false;
	readonly id: ExperimentId;
	readonly type: ExperimentType[ 'name' ];
	readonly alternatives: ReadonlyArray< 0 >;
	readonly goals: ReadonlyArray< GoalSummary >;
	readonly segments: ReadonlyArray< SegmentSummary >;
	readonly segmentEvaluation: 'site' | 'tested-page';
};

export type Experiment = ActiveExperiment | InactiveExperiment;
export type ActiveExperiment = ActiveExperimentSummary & ExtraProps;
export type InactiveExperiment = InactiveExperimentSummary & ExtraProps;
type ExtraProps = {
	readonly alternative: number;
};

export type HeatmapSummary = {
	readonly id: ExperimentId;
	readonly participation: ReadonlyArray< SegmentationRule >;
};

// ===========
// EXP DETAILS
// ===========

export type AlternativeIndex = number;
export type AlternativeSummary = Dict;
export type ScriptAlternative = {
	readonly name: string;
	readonly run: (
		done: () => void,
		utils: {
			readonly showContent: () => void;
			readonly domReady: ( fn: () => unknown ) => void;
		}
	) => void;
};

export type GoalIndex = number;
export type GoalSummary = {
	readonly id: GoalIndex;
	readonly conversionActions: ReadonlyArray< ConversionAction >;
};

export type SegmentIndex = number;
export type SegmentSummary = {
	readonly id: SegmentIndex;
	readonly segmentationRules: Omit< ReadonlyArray< SegmentationRule >, 'id' >;
};

// ===========
// CONVERSIONS
// ===========

export type ConversionAction< A extends Dict = Dict > = Omit<
	CA< A >,
	'scope'
> & {
	readonly active: boolean;
};

export type ConvertibleAction< A extends Dict = Dict > =
	ConversionAction< A > & {
		readonly experiment: ExperimentId;
		readonly alternative: AlternativeIndex;
		readonly goal: GoalIndex;
	};

export type Convert = ( experimentId: ExperimentId, goalIndex: number ) => void;

export type ConvertingGoal = {
	readonly experiment: ExperimentId;
	readonly goal: GoalIndex;
};

export type GdprCookieSetting = {
	readonly name: string;
	readonly value: string;
};

// ============
// HELPER TYPES
// ============

type UrlOrPartialUrl = string;

type ApiSettings = {
	readonly mode: 'native' | 'rest' | 'domain-forwarding';
	readonly url: Url;
};
