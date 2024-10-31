/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type {
	Segment,
	SegmentationRule,
	SegmentationRuleId,
	SegmentId,
} from '@nab/types';

export type SegmentationAction =
	| AddSegments
	| RemoveSegments
	| UpdateSegment
	| AddSegmentationRulesIntoSegment
	| ReplaceSegmentationRulesInSegment
	| RemoveSegmentationRulesFromSegment
	| UpdateSegmentationRule
	| SetSegmentEvaluation;

export function addSegments(
	segments: Segment | ReadonlyArray< Segment >
): AddSegments {
	return {
		type: 'ADD_SEGMENTS',
		segments: castArray( segments ),
	};
} //end addSegments()

export function removeSegments(
	ids: SegmentId | ReadonlyArray< SegmentId >
): RemoveSegments {
	return {
		type: 'REMOVE_SEGMENTS',
		ids: castArray( ids ),
	};
} //end removeSegments()

export function updateSegment(
	segmentId: SegmentId,
	attributes: Partial< Segment[ 'attributes' ] >
): UpdateSegment {
	return {
		type: 'UPDATE_SEGMENT',
		segmentId,
		attributes,
	};
} //end updateSegment()

export function addSegmentationRulesIntoSegment(
	segmentId: SegmentId,
	segmentationRules: SegmentationRule | ReadonlyArray< SegmentationRule >
): AddSegmentationRulesIntoSegment {
	return {
		type: 'ADD_SEGMENTATION_RULES_INTO_SEGMENT',
		segmentId,
		segmentationRules: castArray( segmentationRules ),
	};
} //end addSegmentationRulesIntoSegment()

export function replaceSegmentationRulesInSegment(
	segmentId: SegmentId,
	segmentationRules: SegmentationRule | ReadonlyArray< SegmentationRule >
): ReplaceSegmentationRulesInSegment {
	return {
		type: 'REPLACE_SEGMENTATION_RULES_IN_SEGMENT',
		segmentId,
		segmentationRules: castArray( segmentationRules ),
	};
} //end replaceSegmentationRulesInSegment()

export function removeSegmentationRulesFromSegment(
	segmentId: SegmentId,
	segmentationRuleIds:
		| SegmentationRuleId
		| ReadonlyArray< SegmentationRuleId >
): RemoveSegmentationRulesFromSegment {
	return {
		type: 'REMOVE_SEGMENTATION_RULES_FROM_SEGMENT',
		segmentId,
		segmentationRuleIds: castArray( segmentationRuleIds ),
	};
} //end removeSegmentationRulesFromSegment()

export function updateSegmentationRule(
	segmentId: SegmentId,
	segmentationRuleId: SegmentationRuleId,
	attributes: Partial< SegmentationRule[ 'attributes' ] >
): UpdateSegmentationRule {
	return {
		type: 'UPDATE_SEGMENTATION_RULE',
		segmentId,
		segmentationRuleId,
		attributes,
	};
} //end updateSegmentationRule()

export function setSegmentEvaluation(
	strategy: 'site' | 'tested-page'
): SetSegmentEvaluation {
	return {
		type: 'SET_SEGMENT_EVALUATION',
		strategy,
	};
} //end setSegmentEvaluation()

// =====
// TYPES
// =====

type AddSegments = {
	readonly type: 'ADD_SEGMENTS';
	readonly segments: ReadonlyArray< Segment >;
};

type RemoveSegments = {
	readonly type: 'REMOVE_SEGMENTS';
	readonly ids: ReadonlyArray< SegmentId >;
};

type UpdateSegment = {
	readonly type: 'UPDATE_SEGMENT';
	readonly segmentId: SegmentId;
	readonly attributes: Partial< Segment[ 'attributes' ] >;
};

type AddSegmentationRulesIntoSegment = {
	readonly type: 'ADD_SEGMENTATION_RULES_INTO_SEGMENT';
	readonly segmentId: SegmentId;
	readonly segmentationRules: ReadonlyArray< SegmentationRule >;
};

type ReplaceSegmentationRulesInSegment = {
	readonly type: 'REPLACE_SEGMENTATION_RULES_IN_SEGMENT';
	readonly segmentId: SegmentId;
	readonly segmentationRules: ReadonlyArray< SegmentationRule >;
};

type RemoveSegmentationRulesFromSegment = {
	readonly type: 'REMOVE_SEGMENTATION_RULES_FROM_SEGMENT';
	readonly segmentId: SegmentId;
	readonly segmentationRuleIds: ReadonlyArray< SegmentationRuleId >;
};

type UpdateSegmentationRule = {
	readonly type: 'UPDATE_SEGMENTATION_RULE';
	readonly segmentId: SegmentId;
	readonly segmentationRuleId: SegmentationRuleId;
	readonly attributes: Partial< SegmentationRule[ 'attributes' ] >;
};

type SetSegmentEvaluation = {
	readonly type: 'SET_SEGMENT_EVALUATION';
	readonly strategy: 'site' | 'tested-page';
};
