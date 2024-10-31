/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { DropdownMenu } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NAB_SEGMENTS } from '@nab/segmentation-rules';
import type {
	SegmentationRule,
	SegmentationRuleCategory,
	SegmentationRuleCategoryName,
	SegmentationRuleTypeName,
} from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';

export type SegmentationRuleTypeCategoryProps = {
	readonly category: SegmentationRuleCategory;
	readonly createSegmentationRule: ( type: SegmentationRuleTypeName ) => void;
	readonly segmentationRules: ReadonlyArray< SegmentationRule >;
};

export const SegmentationRuleTypeCategory = ( {
	category,
	createSegmentationRule,
	segmentationRules,
}: SegmentationRuleTypeCategoryProps ): JSX.Element | null => {
	const segmentationRuleTypes = useSegmentationRuleTypes( category.name );
	const Icon = category.icon;

	if ( ! segmentationRuleTypes.length ) {
		return null;
	} //end if

	return (
		<li
			key={ category.name }
			className="nab-segmentation-rule-type-category"
		>
			<DropdownMenu
				icon={ <Icon /> }
				className="nab-segmentation-rule-type-category__item"
				label={ category.title }
				controls={ segmentationRuleTypes.map(
					( { name, title, icon: TypeIcon, singleton } ) => ( {
						title,
						icon: <TypeIcon />,
						isDisabled:
							singleton &&
							segmentationRules.some(
								( rule ) => rule.type === name
							),
						onClick: () => createSegmentationRule( name ),
					} )
				) }
				toggleProps={ {
					className: 'nab-segmentation-rule-type-category__toggle',
					disabled: segmentationRuleTypes.every(
						( { name, singleton } ) =>
							singleton &&
							segmentationRules.some(
								( rule ) => rule.type === name
							)
					),
				} }
				menuProps={ {
					className: 'nab-segmentation-rule-type-category__menu',
				} }
			/>
		</li>
	);
};

// =====
// HOOKS
// =====

const useSegmentationRuleTypes = ( catName: SegmentationRuleCategoryName ) =>
	useSelect( ( select ) => {
		const ruleTypes =
			select( NAB_SEGMENTS ).getSegmentationRuleTypes() || [];
		return ruleTypes.filter( ( { category } ) => category === catName );
	} );
