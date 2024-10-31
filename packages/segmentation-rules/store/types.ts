/**
 * External dependencies
 */
import type {
	SegmentationRuleCategory,
	SegmentationRuleCategoryName,
	SegmentationRuleType,
	SegmentationRuleTypeName,
} from '@nab/types';

export type State = {
	readonly segmentationRuleTypes: Record<
		SegmentationRuleTypeName,
		SegmentationRuleType
	>;
	readonly categories: Record<
		SegmentationRuleCategoryName,
		SegmentationRuleCategory
	>;
};
