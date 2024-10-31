/**
 * WordPress dependencies
 */
import type { SelectFunction as Select } from '@wordpress/data/build-types/types';

/**
 * External dependencies
 */
import type { Brand } from 'ts-brand';

/**
 * Internal dependencies
 */
import type { Dict, Url } from './utils';
import type { EntityId, EntityKindName } from './entities';
import type { Alternative, AlternativeId } from './alternatives';
import type { ConversionAction, Goal } from './conversions';
import type { Segment, SegmentationRule } from './segmentation';

// ================
// EXPERIMENT TYPES
// ================

export type ExperimentTypeName = string;

export type ExperimentType< C extends Dict = Dict, A extends Dict = C > = {
	readonly name: string;
	readonly title: string;
	readonly shortTitle?: string;
	readonly category: ExperimentCategory;
	readonly description: string;
	readonly icon: ( props?: Dict ) => JSX.Element;
	readonly help: {
		readonly original: string;
		readonly alternative: string;
	};
	readonly defaults: {
		readonly original: C;
		readonly alternative: A;
	};
	readonly views: {
		readonly original: ( props: ExperimentEditProps< C > ) => JSX.Element;
		readonly alternative: (
			props: ExperimentEditProps< A >
		) => JSX.Element;
	};
	readonly supports: Partial< {
		readonly alternativeApplication:
			| boolean
			| ( ( alts: Alternatives< C, A > ) => boolean );
		readonly alternativeEdition: {
			readonly type: 'external';
			readonly enabled?: ( control: C ) => boolean;
		};
		readonly alternativePreviewDialog: ( props: {
			readonly experimentId: ExperimentId;
			readonly alternativeId: AlternativeId;
			readonly attributes: A;
		} ) => JSX.Element;
		readonly automaticGoalSetup: (
			control: C
		) => ReadonlyArray< ConversionAction >;
		readonly scope: ScopeType;
		readonly presetAlternatives: (
			select: Select,
			collection: string
		) => ReadonlyArray< PresetOption > | boolean;
		readonly postTypes: EntityKindName | ReadonlyArray< EntityKindName >;
		readonly postTypeExceptions: string | ReadonlyArray< string >;
	} >;
	readonly checks: {
		readonly getControlError: (
			control: C,
			select: Select
		) => string | false;
		readonly getAlternativeError: (
			alternative: A,
			letter: string,
			control: C,
			select: Select
		) => string | false;
		readonly isAlternativePreviewDisabled?: (
			alternative: A,
			control: C,
			select: Select
		) => boolean;
		readonly isTestTypeEnabled?: ( select: Select ) => boolean;
	};
};

export type ExperimentEditProps< A extends Dict > = {
	readonly attributes: A;
	readonly setAttributes: ( attrs: Partial< A > ) => void;
	readonly disabled?: boolean;
	readonly experimentType: ExperimentTypeName;
};

export type ExperimentCategory = 'page' | 'global' | 'woocommerce' | 'other';

// ====================
// EXPERIMENT INSTANCES
// ====================

export type ExperimentId = 0 | Brand< number, 'ExperimentId' >;

export type Experiment< C extends Dict = Dict, A extends Dict = C > = {
	readonly id: ExperimentId;
	readonly type: ExperimentTypeName;
	readonly status:
		| 'draft'
		| 'ready'
		| 'scheduled'
		| 'running'
		| 'paused'
		| 'paused_draft'
		| 'finished'
		| 'trash';
	readonly name: string;
	readonly description: string;
	readonly startDate: string;
	readonly endDate: string | false;
	readonly endMode: 'manual' | 'duration' | 'page-views' | 'confidence';
	readonly endValue: number;
	readonly links: {
		readonly edit: string;
		readonly preview: string;
	};
	readonly alternatives: Alternatives< C, A >;
	readonly goals: ReadonlyArray< Goal >;
	readonly segmentEvaluation: 'site' | 'tested-page';
	readonly segments: ReadonlyArray< Segment >;
	readonly scope: ReadonlyArray< ScopeRule >;
};

export type Alternatives<
	C extends Dict = Dict,
	A extends Dict = C,
> = Readonly< [ Alternative< C >, ...Alternative< A >[] ] >;

export type Heatmap = Omit<
	Experiment,
	| 'alternatives'
	| 'goals'
	| 'links'
	| 'scope'
	| 'segmentEvaluation'
	| 'segments'
> & {
	readonly trackingMode: 'post' | 'url';
	readonly trackedPostId: EntityId;
	readonly trackedPostType: EntityKindName;
	readonly trackedUrl: Url;
	readonly links: {
		readonly edit: string;
		readonly heatmap: string;
		readonly preview: string;
	};
	readonly participationConditions: ReadonlyArray< SegmentationRule >;
};

// =====
// SCOPE
// =====

export type ScopeType =
	| 'custom'
	| 'custom-with-tested-post'
	| 'tested-post-with-consistency';

export type ScopeRuleId = Brand< string, 'ScopeRuleId' >;

export type ScopeRule = TestedPostScopeRule | CustomUrlScopeRule;

export type TestedPostScopeRule = {
	readonly id: ScopeRuleId;
	readonly attributes: {
		readonly type: 'tested-post';
	};
};

export type CustomUrlScopeRule = {
	readonly id: ScopeRuleId;
	readonly attributes: {
		readonly type: 'exact' | 'partial';
		readonly value: string;
	};
};

// =======
// HELPERS
// =======

type PresetOption = {
	readonly label: string;
	readonly value: string;
	readonly disabled?: boolean;
};
