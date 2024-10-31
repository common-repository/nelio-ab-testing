/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NAB_DATA } from '@nab/data';
import { store as NAB_SEGMENTS } from '@nab/segmentation-rules';
import type {
	SegmentationRule as SR,
	SegmentationRuleTypeName,
} from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';

export type SegmentationRuleProps = {
	readonly rule: SR;
};

export const SegmentationRule = ( {
	rule,
}: SegmentationRuleProps ): JSX.Element | null => {
	const experiment = useActiveExperiment();
	const segmentId = useActiveSegmentId();
	const ruleType = useSegmentationRuleType( rule.type );

	if ( ! ruleType || ! experiment || ! segmentId ) {
		return null;
	} //end if

	const attributes = {
		...ruleType.attributes,
		...rule.attributes,
	};

	const View = ruleType.view;
	const Icon = ruleType.icon;

	return (
		<div className="nab-segmentation-rule__view">
			{ !! Icon ? (
				<Icon className="nab-segmentation-rule__icon" />
			) : (
				<Dashicon
					className="nab-segmentation-rule__icon nab-segmentation-rule__icon--invalid"
					icon="warning"
				/>
			) }
			<div className="nab-segmentation-rule__actual-view">
				{ !! View ? (
					<View
						attributes={ attributes }
						experimentId={ experiment.id }
					/>
				) : (
					<span>
						{ _x(
							'Invalid segmentation rule.',
							'text',
							'nelio-ab-testing'
						) }
					</span>
				) }
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useActiveExperiment = () =>
	useSelect( ( select ) =>
		select( NAB_DATA ).getExperiment(
			select( NAB_DATA ).getPageAttribute( 'editor/activeExperiment' )
		)
	);

const useSegmentationRuleType = ( type: SegmentationRuleTypeName ) =>
	useSelect( ( select ) =>
		select( NAB_SEGMENTS ).getSegmentationRuleType( type )
	);

const useActiveSegmentId = () => {
	const activeSegment = useSelect( ( select ) =>
		select( NAB_DATA ).getPageAttribute( 'editor/activeSegment' )
	);
	const firstSegment = useActiveExperiment()?.segments[ 0 ]?.id;
	return activeSegment || firstSegment;
};
