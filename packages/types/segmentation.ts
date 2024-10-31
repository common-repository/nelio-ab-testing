/**
 * External dependencies
 */
import type { Brand } from 'ts-brand';

/**
 * Internal dependencies
 */
import type { ExperimentId } from './experiments';
import type { Dict } from './utils';

// ========
// SEGMENTS
// ========

export type SegmentId = 'default' | Brand< string, 'SegmentId' >;

export type Segment = {
	readonly id: SegmentId;
	readonly attributes: {
		readonly name: string;
	};
	readonly segmentationRules: ReadonlyArray< SegmentationRule >;
};

// =======================
// SEGMENTATION RULE TYPES
// =======================

export type SegmentationRuleTypeName = string;

export type SegmentationRuleType< A extends Dict = Dict > = {
	readonly name: SegmentationRuleTypeName;
	readonly category: SegmentationRuleCategoryName;
	readonly title: string;
	readonly attributes: A;
	readonly icon: ( props?: Dict ) => JSX.Element;
	readonly edit: ( props: SREditProps< A > ) => JSX.Element;
	readonly view: ( props: SRViewProps< A > ) => JSX.Element;
	readonly validate?: ( attrs: A ) => Partial< Record< keyof A, string > >;
	readonly singleton: boolean;
};

export type SREditProps< A extends Dict = Dict > = SRViewProps< A > & {
	readonly errors: Partial< Record< keyof A, string > >;
	readonly setAttributes: ( attrs: Partial< A > ) => void;
};

export type SRViewProps< A extends Dict = Dict > = {
	readonly attributes: A;
	readonly experimentId: ExperimentId;
};

// ============================
// SEGMENTATION RULE CATEGORIES
// ============================

export type SegmentationRuleCategoryName = string;

export type SegmentationRuleCategory = {
	readonly name: SegmentationRuleCategoryName;
	readonly title: string;
	readonly icon: () => JSX.Element;
};

// ===========================
// SEGMENTATION RULE INSTANCES
// ===========================

export type SegmentationRuleId = Brand< string, 'SegmentationRuleId' >;

export type SegmentationRule< A extends Dict = Dict > = {
	readonly id: SegmentationRuleId;
	readonly type: SegmentationRuleTypeName;
	readonly attributes: A;
};
