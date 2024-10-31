/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PanelBody } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { useEffect } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NAB_DATA } from '@nab/data';
import { SegmentationRule as Condition } from '@nab/components';
import { Experiment, Heatmap, Maybe } from '@nab/types';
import { useActiveExperiment } from '../../hooks';

export const ParticipationConditions = (): JSX.Element | null => {
	const exp = useActiveExperiment();
	const conditions = hasConditions( exp ) ? exp.participationConditions : [];

	// NOTE. We need this effect to use the “SegmentationRule” component
	// from regular results page.
	const { setPageAttribute } = useDispatch( NAB_DATA );
	useEffect(
		() => void setPageAttribute( 'editor/activeSegment', 'default' ),
		[]
	);

	if ( ! conditions.length ) {
		return null;
	} //end if

	return (
		<PanelBody
			initialOpen={ false }
			className="nab-participation-conditions"
			title={ _x( 'Participation', 'text', 'nelio-ab-testing' ) }
		>
			<p>
				{ _x(
					'Only visitors who met all the following criteria contributed to this heatmap:',
					'text',
					'nelio-ab-testing'
				) }
			</p>
			{ conditions.map( ( condition ) => (
				<Condition key={ condition.id } rule={ condition } />
			) ) }
		</PanelBody>
	);
};

// =======
// HELPERS
// =======

const hasConditions = ( e: Maybe< Experiment | Heatmap > ): e is Heatmap =>
	!! e && 'participationConditions' in e;
