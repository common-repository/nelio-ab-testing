/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon } from '@safe-wordpress/components';
import { createInterpolateElement } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';

import { SegmentList } from '../segment-list';
import { SegmentationRuleList } from '../segmentation-rule-list';
import { useExperimentAttribute } from '../hooks';

export const SegmentationSection = (): JSX.Element | null => {
	const segments = useExperimentAttribute( 'segments' ) || [];

	if ( ! segments.length ) {
		return null;
	} //end if

	return (
		<div className="nab-segmentation-section">
			<h2>
				{ createInterpolateElement(
					sprintf(
						/* translators: dashicon */
						_x( '%s Segmentation', 'text', 'nelio-ab-testing' ),
						'<icon></icon>'
					),
					{
						icon: (
							<Dashicon
								className="nab-segmentation-section__title-icon"
								icon="groups"
							/>
						),
					}
				) }
			</h2>

			<div className="nab-segmentation-section__content">
				<SegmentList />

				<div className="nab-current-segment-info">
					<SegmentationRuleList />
				</div>
			</div>
		</div>
	);
};
