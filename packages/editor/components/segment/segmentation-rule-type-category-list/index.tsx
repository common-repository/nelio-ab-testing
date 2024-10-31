/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { ExternalLink } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { usePluginSetting } from '@nab/data';
import { store as NAB_SEGMENTS } from '@nab/segmentation-rules';
import { addFreeTracker } from '@nab/utils';
import type { SegmentationRule, SegmentationRuleTypeName } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { SegmentationRuleTypeCategory } from '../segmentation-rule-type-category';

export type SegmentationRuleTypeCategoryListProps = {
	readonly createSegmentationRule: ( type: SegmentationRuleTypeName ) => void;
	readonly segmentationRules: ReadonlyArray< SegmentationRule >;
};

export const SegmentationRuleTypeCategoryList = ( {
	createSegmentationRule,
	segmentationRules,
}: SegmentationRuleTypeCategoryListProps ): JSX.Element => {
	const segmentationRuleTypeCategories = useSegmentationRuleTypeCategories();
	const isSubscribed = !! usePluginSetting( 'subscription' );

	if ( ! isSubscribed ) {
		return (
			<div className="nab-segmentation-rule-type-list">
				<ExternalLink
					className="components-button is-secondary"
					href={ addFreeTracker(
						_x(
							'https://neliosoftware.com/testing/pricing/',
							'text',
							'nelio-ab-testing'
						)
					) }
				>
					{ _x(
						'Subscribe to Use Segmentation Rules',
						'user',
						'nelio-ab-testing'
					) }
				</ExternalLink>
			</div>
		);
	} //end if

	return (
		<ul className="nab-segmentation-rule-type-category-list">
			{ segmentationRuleTypeCategories.map( ( category ) => (
				<SegmentationRuleTypeCategory
					key={ category.name }
					category={ category }
					createSegmentationRule={ createSegmentationRule }
					segmentationRules={ segmentationRules }
				/>
			) ) }
		</ul>
	);
};

// =====
// HOOKS
// =====

const useSegmentationRuleTypeCategories = () =>
	useSelect(
		( select ) =>
			select( NAB_SEGMENTS ).getSegmentationRuleTypeCategories() || []
	);
