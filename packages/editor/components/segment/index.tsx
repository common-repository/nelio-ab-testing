/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, TextControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';
import { useSelect, useDispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { createSegmentationRule as createSegmentationRuleWithDefaults } from '@nab/segmentation-rules';
import type { SegmentationRuleTypeName } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { SegmentationRuleList } from './segmentation-rule-list';
import { SegmentationRuleTypeCategoryList } from './segmentation-rule-type-category-list';
import { store as NAB_EDITOR } from '../../store';

export type SegmentProps = {
	readonly name: string;
	readonly setName: ( name: string ) => void;
	readonly removeSegment?: () => void;
};

export const Segment = ( {
	name,
	setName,
	removeSegment,
}: SegmentProps ): JSX.Element => {
	const activeSegmentRules = useActiveSegmentRules();
	const createSegmentationRule = useSegmentationRuleCreator();

	return (
		<div className="nab-current-segment-info">
			<div className="nab-current-segment-info__header">
				<TextControl
					placeholder={ _x(
						'Name your segment…',
						'user',
						'nelio-ab-testing'
					) }
					value={ name }
					onChange={ ( value ) => setName( value ) }
				/>
				{ !! removeSegment && (
					<Button
						variant="tertiary"
						isDestructive
						className="nab-current-segment-info__delete-button"
						onClick={ removeSegment }
					>
						{ _x(
							'Delete',
							'command (segment)',
							'nelio-ab-testing'
						) }
					</Button>
				) }
			</div>

			<SegmentationRuleList />
			<SegmentationRuleTypeCategoryList
				segmentationRules={ activeSegmentRules }
				createSegmentationRule={ createSegmentationRule }
			/>
		</div>
	);
};

// =====
// HOOKS
// =====

const useActiveSegment = () =>
	useSelect( ( select ) => select( NAB_EDITOR ).getActiveSegment() );

const useActiveSegmentRules = () => {
	const activeSegment = useActiveSegment();
	return useSelect( ( select ) => {
		const { getSegmentationRules } = select( NAB_EDITOR );
		return activeSegment?.id
			? getSegmentationRules( activeSegment.id ) || []
			: [];
	} );
};

const useSegmentationRuleCreator = () => {
	const { addSegmentationRulesIntoSegment } = useDispatch( NAB_EDITOR );
	const activeSegment = useActiveSegment();
	return ( type: SegmentationRuleTypeName ) => {
		if ( ! activeSegment ) {
			return;
		} //end if
		const rule = createSegmentationRuleWithDefaults( type );
		if ( rule ) {
			void addSegmentationRulesIntoSegment( activeSegment.id, rule );
		} //end if
	};
};
