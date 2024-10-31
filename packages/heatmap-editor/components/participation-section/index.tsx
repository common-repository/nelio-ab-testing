/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon, ExternalLink } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { createInterpolateElement } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { usePluginSetting } from '@nab/data';
import { store as NAB_EDITOR } from '@nab/editor';
import { addFreeTracker } from '@nab/utils';
import { createSegmentationRule as createSegmentationRuleWithDefaults } from '@nab/segmentation-rules';
import type {
	Dict,
	SegmentationRuleId,
	SegmentationRuleTypeName,
} from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { SegmentationRule } from '../../../editor/components/segment/segmentation-rule';
import { SegmentationRuleTypeCategoryList } from '../../../editor/components/segment/segmentation-rule-type-category-list';

export const ParticipationSection = (): JSX.Element => {
	const isSubscribed = !! usePluginSetting( 'subscription' );

	return (
		<div className="nab-edit-experiment__participation-section">
			<Title />
			{ isSubscribed ? (
				<ParticipationConditions />
			) : (
				<SubscriptionRequiredMessage />
			) }
		</div>
	);
};

// ============
// HELPER VIEWS
// ============

const Title = () => (
	<h2>
		{ createInterpolateElement(
			sprintf(
				/* translators: dashicon */
				_x( '%s Participation', 'text', 'nelio-ab-testing' ),
				'<icon></icon>'
			),
			{
				icon: (
					<Dashicon
						className="nab-participation-section__title-icon"
						icon="groups"
					/>
				),
			}
		) }
	</h2>
);

const SubscriptionRequiredMessage = () => (
	<div className="nab-edit-experiment-participation-section__content nab-edit-experiment-participation-section__content--free">
		<p>
			{ _x(
				'All your visitors participate in this heatmap. Participation settings allow you to narrow your tested audience and target only a subset of your visitors.',
				'user',
				'nelio-ab-testing'
			) }
		</p>
		<div className="nab-edit-experiment-participation-section__content-action">
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
					'Subscribe to Unlock Participation Settings',
					'user',
					'nelio-ab-testing'
				) }
			</ExternalLink>
		</div>
	</div>
);

const ParticipationConditions = () => {
	const { conditions, createCondition, updateCondition, removeCondition } =
		useParticipationConditions();

	return (
		<div className="nab-edit-experiment-participation-section__content">
			<p>
				{ ! conditions.length
					? _x(
							'All visitors will contribute to this heatmap. If you want to limit participation to a subset of visitors, use the actions below:',
							'text',
							'nelio-ab-testing'
					  )
					: _x(
							'Only visitors who meet all the following criteria will contribute to this heatmap:',
							'text',
							'nelio-ab-testing'
					  ) }
			</p>
			<div className="nab-edit-experiment-participation-section__conditions">
				{ conditions.map( ( condition ) => (
					<SegmentationRule
						key={ condition.id }
						rule={ condition }
						setAttributes={ ( attrs ) =>
							updateCondition( condition.id, attrs )
						}
						remove={ () => removeCondition( condition.id ) }
					/>
				) ) }
			</div>
			<SegmentationRuleTypeCategoryList
				segmentationRules={ conditions }
				createSegmentationRule={ createCondition }
			/>
		</div>
	);
};

// =====
// HOOKS
// =====

const useParticipationConditions = () => {
	const conditions = useSelect(
		( select ) =>
			select( NAB_EDITOR ).getHeatmapAttribute(
				'participationConditions'
			) ?? []
	);

	const { setHeatmapData } = useDispatch( NAB_EDITOR );

	return {
		conditions,

		createCondition: ( type: SegmentationRuleTypeName ) => {
			const rule = createSegmentationRuleWithDefaults( type );
			if ( rule ) {
				void setHeatmapData( {
					participationConditions: [ ...conditions, rule ],
				} );
			} //end if
		},

		updateCondition: ( id: SegmentationRuleId, attrs: Dict ) =>
			void setHeatmapData( {
				participationConditions: conditions.map( ( c ) =>
					c.id === id
						? { ...c, attributes: { ...c.attributes, ...attrs } }
						: c
				),
			} ),

		removeCondition: ( id: SegmentationRuleId ) =>
			void setHeatmapData( {
				participationConditions: conditions.filter(
					( c ) => c.id !== id
				),
			} ),
	};
};
