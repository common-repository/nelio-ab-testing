/**
 * External dependencies
 */
import { values } from 'lodash';
import type {
	Dict,
	Maybe,
	SegmentationRuleType,
	SegmentationRuleTypeName,
	SegmentationRuleCategory,
	SegmentationRuleCategoryName,
} from '@nab/types';

/**
 * Internal dependencies
 */
import type { State } from './types';

export function getSegmentationRuleTypes(
	state: State
): ReadonlyArray< SegmentationRuleType > {
	return values( state.segmentationRuleTypes );
} //end getSegmentationRuleTypes()

type GetSegmentationRuleType = typeof _getSegmentationRuleType & {
	CurriedSignature: < T extends Dict = Dict >(
		name: SegmentationRuleTypeName
	) => Maybe< SegmentationRuleType< T > >;
};
export const getSegmentationRuleType =
	_getSegmentationRuleType as GetSegmentationRuleType;
function _getSegmentationRuleType< T extends Dict = Dict >(
	state: State,
	name: SegmentationRuleTypeName
): Maybe< SegmentationRuleType< T > > {
	return state.segmentationRuleTypes[ name ] as SegmentationRuleType< T >;
} //end _getSegmentationRuleType()

export function getSegmentationRuleTypeCategories(
	state: State
): ReadonlyArray< SegmentationRuleCategory > {
	return values( state.categories );
} //end getSegmentationRuleTypeCategories()

export function getSegmentationRuleTypeCategory(
	state: State,
	name: SegmentationRuleCategoryName
): Maybe< SegmentationRuleCategory > {
	return state.categories[ name ];
} //end getSegmentationRuleTypeCategory()
