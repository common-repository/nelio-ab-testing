/**
 * Internal dependencies
 */
import type { AlternativeId, AlternativeIndex } from './alternatives';
import type { GoalId } from './conversions';
import type { SegmentId } from './segmentation';
import type { SiteId } from './user';

// =================
// PROCESSED RESULTS
// =================

export type ResultStatus = 'testing' | 'winner' | 'possible-winner';

export type Results = ResultsData & {
	readonly segments: Partial< Record< SegmentId, SegmentResultsData > >;
};

export type AlternativeTrackingData = {
	readonly id: AlternativeId;
	readonly visits: number;
	readonly conversions: Partial< Record< GoalId, number > >;
	readonly conversionRates: Partial< Record< GoalId, number > >;
	readonly improvementFactors: Partial< Record< GoalId, number > >;
	readonly values: Partial< Record< GoalId, number > >;

	readonly uniqueVisits: number;
	readonly uniqueConversions: Partial< Record< GoalId, number > >;
	readonly uniqueConversionRates: Partial< Record< GoalId, number > >;
	readonly uniqueImprovementFactors: Partial< Record< GoalId, number > >;
	readonly uniqueValues: Partial< Record< GoalId, number > >;

	readonly timeline: ReadonlyArray< DayResults >;
};

export type GoalWinner = {
	readonly alternative: number;
	readonly confidence: number;
};

export type DayResults = {
	readonly date: Day;
	readonly visits: number;
	readonly conversions: Partial< Record< GoalId, number > >;
	readonly values: Partial< Record< GoalId, number > >;
	readonly uniqueVisits: number;
	readonly uniqueConversions: Partial< Record< GoalId, number > >;
	readonly uniqueValues: Partial< Record< GoalId, number > >;
};

// ===========
// CLOUD TYPES
// ===========

type CloudAlternativeKey = string; // /a[0-9]+/
type CloudConvValKey = string; // /val[0-9]+/
type CloudGoalKey = string; // /g[0-9]+/
type CloudSegmentKey = string; // /s[0-9]+/
type CloudGoalUniqueKey = string; // /ug[0-9]+/
type CloudConvValUniqueKey = string; // /uval[0-9]+/

export type CloudResults = {
	readonly site: SiteId;
	readonly experiment: string;
	readonly segments?: Record< CloudSegmentKey, CloudSegmentResults >;
	readonly results: Record< CloudGoalKey, CloudGoalResults >;
	readonly uniqueResults?: Record< CloudGoalKey, CloudGoalResults >;
} & Record< CloudAlternativeKey, CloudAlternativeResults >;

export type CloudAlternativeResults = {
	readonly v?: number;
	readonly c?: Record< CloudGoalKey, number >;
	readonly cr?: Record< CloudGoalKey, number >;
	readonly cv?: Record< CloudGoalKey, number >;
	readonly i?: Record< CloudGoalKey, number >;

	readonly uv?: number;
	readonly uc?: Record< CloudGoalKey, number >;
	readonly ucr?: Record< CloudGoalKey, number >;
	readonly ucv?: Record< CloudGoalKey, number >;
	readonly ui?: Record< CloudGoalKey, number >;

	readonly t?: ReadonlyArray< CloudDayResults >;
};

export type CloudGoalResults = {
	readonly status: 'win' | 'tie' | 'low-data';
	readonly winner: AlternativeIndex;
	readonly confidence: number;
	readonly data: ReadonlyArray< {
		readonly min: CloudAlternativeKey;
		readonly max: CloudAlternativeKey;
		readonly certainty: number;
	} >;
};

/* eslint-disable @typescript-eslint/no-duplicate-type-constituents */
export type CloudDayResults = {
	readonly d: Day;
	readonly v: number;
	readonly uv?: number;
} & Record< CloudGoalKey, number > &
	Record< CloudConvValKey, number > &
	Record< CloudGoalUniqueKey, number > &
	Record< CloudConvValUniqueKey, number >;
/* eslint-enable @typescript-eslint/no-duplicate-type-constituents */

export type CloudSegmentResults = {
	readonly results: Record< CloudGoalKey, CloudGoalResults >;
	readonly uniqueResults?: Record< CloudGoalKey, CloudGoalResults >;
} & Record< CloudAlternativeKey, CloudAlternativeResults >;

// ============
// HELPER TYPES
// ============

export type Day = string;

type ResultsData = {
	readonly winners: Partial< Record< GoalId, GoalWinner > >;
	readonly wasEnoughData: Partial< Record< GoalId, boolean > >;
	readonly alternatives: Record< AlternativeId, AlternativeTrackingData >;
	readonly winnersUnique?: Partial< Record< GoalId, GoalWinner > >;
	readonly wasEnoughDataUnique?: Partial< Record< GoalId, boolean > >;
};

type SegmentResultsData = ResultsData & {
	readonly id: SegmentId;
};
