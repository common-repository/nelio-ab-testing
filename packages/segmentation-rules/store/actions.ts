/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type {
	SegmentationRuleCategory,
	SegmentationRuleCategoryName,
	SegmentationRuleType,
	SegmentationRuleTypeName,
} from '@nab/types';

export type Action =
	| AddSegmentationRuleTypes
	| RemoveSegmentationRuleTypes
	| AddSegmentationRuleTypeCategories
	| RemoveSegmentationRuleTypeCategories;

export function addSegmentationRuleTypes(
	segmentationRuleTypes:
		| SegmentationRuleType
		| ReadonlyArray< SegmentationRuleType >
): AddSegmentationRuleTypes {
	return {
		type: 'ADD_SEGMENTATION_RULE_TYPES',
		segmentationRuleTypes: castArray( segmentationRuleTypes ),
	};
} //end addSegmentationRuleTypes()

export function removeSegmentationRuleTypes(
	names: SegmentationRuleTypeName | ReadonlyArray< SegmentationRuleTypeName >
): RemoveSegmentationRuleTypes {
	return {
		type: 'REMOVE_SEGMENTATION_RULE_TYPES',
		names: castArray( names ),
	};
} //end removeSegmentationRuleTypes()

export function addSegmentationRuleTypeCategories(
	categories:
		| SegmentationRuleCategory
		| ReadonlyArray< SegmentationRuleCategory >
): AddSegmentationRuleTypeCategories {
	return {
		type: 'ADD_SEGMENTATION_RULE_TYPE_CATEGORIES',
		categories: castArray( categories ),
	};
} //end addSegmentationRuleTypeCategories()

export function removeSegmentationRuleTypeCategories(
	names:
		| SegmentationRuleCategoryName
		| ReadonlyArray< SegmentationRuleCategoryName >
): RemoveSegmentationRuleTypeCategories {
	return {
		type: 'REMOVE_SEGMENTATION_RULE_TYPE_CATEGORIES',
		names: castArray( names ),
	};
} //end removeSegmentationRuleTypeCategories()

// ============
// HELPER TYPES
// ============

type AddSegmentationRuleTypes = {
	readonly type: 'ADD_SEGMENTATION_RULE_TYPES';
	readonly segmentationRuleTypes: ReadonlyArray< SegmentationRuleType >;
};

type RemoveSegmentationRuleTypes = {
	readonly type: 'REMOVE_SEGMENTATION_RULE_TYPES';
	readonly names: ReadonlyArray< SegmentationRuleTypeName >;
};

type AddSegmentationRuleTypeCategories = {
	readonly type: 'ADD_SEGMENTATION_RULE_TYPE_CATEGORIES';
	readonly categories: ReadonlyArray< SegmentationRuleCategory >;
};

type RemoveSegmentationRuleTypeCategories = {
	readonly type: 'REMOVE_SEGMENTATION_RULE_TYPE_CATEGORIES';
	readonly names: ReadonlyArray< SegmentationRuleCategoryName >;
};
