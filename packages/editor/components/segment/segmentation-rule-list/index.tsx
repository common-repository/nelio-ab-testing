/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { createInterpolateElement } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { Dict, SegmentationRuleId } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { SegmentationRule } from '../segmentation-rule';
import { store as NAB_EDITOR } from '../../../store';

export const SegmentationRuleList = (): JSX.Element => {
	const segmentationRules = useActiveSegmentRules();
	const setRuleAttributes = useSetRuleAttributes();
	const removeRule = useRemoveRule();

	return (
		<div className="nab-segmentation-rule-list">
			{ !! segmentationRules.length && (
				<p key="segmentation-rule-explanation-1">
					{ _x(
						'A visitor participates in the test every time all of the following segmentation rules match:',
						'text',
						'nelio-ab-testing'
					) }
				</p>
			) }
			{ segmentationRules.map( ( rule ) => (
				<SegmentationRule
					key={ rule.id }
					rule={ rule }
					setAttributes={ ( attrs ) =>
						setRuleAttributes( rule.id, attrs )
					}
					remove={ () => removeRule( rule.id ) }
				/>
			) ) }
			{ ! segmentationRules.length && [
				<p
					key="segmentation-rule-explanation-1"
					className="nab-segmentation-rule-list__help"
				>
					{ _x(
						'Split tests are usually applied to all visitors. But you can narrow your audience using segmentation rules to target only a subset of your visitors.',
						'text',
						'nelio-ab-testing'
					) }
				</p>,
				<p
					key="segmentation-rule-explanation-2"
					className="nab-segmentation-rule-list__help"
				>
					{ createInterpolateElement(
						_x(
							'Use the buttons below to <strong>add the specific segmentation rules</strong> for this segment.',
							'user',
							'nelio-ab-testing'
						),
						{
							strong: <strong />,
						}
					) }
				</p>,
			] }
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

const useSetRuleAttributes = (): ( (
	ruleId: SegmentationRuleId,
	attrs: Dict
) => void ) => {
	const segmentId = useActiveSegment()?.id;
	const { updateSegmentationRule } = useDispatch( NAB_EDITOR );
	return ( ruleId, attrs ) =>
		segmentId ? updateSegmentationRule( segmentId, ruleId, attrs ) : noop;
};

const useRemoveRule = (): ( ( ruleId: SegmentationRuleId ) => void ) => {
	const segmentId = useActiveSegment()?.id;
	const { removeSegmentationRulesFromSegment } = useDispatch( NAB_EDITOR );
	return ( ruleId ) =>
		segmentId
			? removeSegmentationRulesFromSegment( segmentId, ruleId )
			: noop;
};

const noop = () => void null;
