/**
 * WordPress dependencies
 */
import { select } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { v4 as uuid } from 'uuid';
import type {
	Dict,
	Maybe,
	SegmentationRule,
	SegmentationRuleTypeName,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { store as NAB_SEGMENTS } from '../store';

/**
 * Creates a new segmentation rule of the given type using the given attributes.
 *
 * @param {string} typeName   the type of the new segmentation rule.
 * @param {Object} attributes the attributes of the new segmentation rule.
 *
 * @return {Object} an instance of the given segmentation rule.
 */
export function createSegmentationRule< T extends Dict = Dict >(
	typeName: SegmentationRuleTypeName,
	attributes?: Partial< T >
): Maybe< SegmentationRule< T > > {
	const { getSegmentationRuleType } = select( NAB_SEGMENTS );
	const segmentationRuleType = getSegmentationRuleType< T >( typeName );

	if ( ! segmentationRuleType ) {
		return undefined;
	} //end if

	return {
		id: uuid(),
		type: typeName,
		attributes: {
			...segmentationRuleType.attributes,
			...( attributes || {} ),
		},
	};
} //end createSegmentationRule()
