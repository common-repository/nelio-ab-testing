/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	Dashicon,
	ExternalLink,
	SelectControl,
} from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { createInterpolateElement } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { findIndex } from 'lodash';
import { usePluginSetting } from '@nab/data';
import { addFreeTracker } from '@nab/utils';
import type { Dict, Segment as RealSegment, SegmentId } from '@nab/types';
type Segment = Omit< RealSegment, 'segmentationRules' >;

/**
 * Internal dependencies
 */
import './style.scss';
import { useExperimentAttribute } from '../hooks';
import { Segment as SegmentView } from '../segment';
import { SegmentList } from '../segment-list';
import { store as NAB_EDITOR } from '../../store';

export const SegmentationSection = (): JSX.Element => {
	const [ segment, updateActiveSegment ] = useActiveSegment();
	const [ status ] = useExperimentAttribute( 'status' );
	const [ segmentEvaluation, setSegmentEvaluation ] = useSegmentEvaluation();
	const isSubscribed = !! usePluginSetting( 'subscription' );
	const globalSegmentEvaluation = usePluginSetting( 'segmentEvaluation' );
	const isExperimentPaused = ( status || '' ).includes( 'paused' );

	const removeActiveSegment = useActiveSegmentRemover();
	const canSegmentBeRemoved = ! isExperimentPaused;

	return (
		<div className="nab-edit-experiment__segmentation-section">
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

				{ 'custom' === globalSegmentEvaluation && (
					<div className="nab-edit-experiment-segmentation-section__strategy">
						<SelectControl
							value={ segmentEvaluation }
							options={ [
								{
									value: 'site' as const,
									label: _x(
										'Evaluate on Site Landing',
										'command',
										'nelio-ab-testing'
									),
								},
								{
									value: 'tested-page' as const,
									label: _x(
										'Evaluate on Tested Pages',
										'text',
										'nelio-ab-testing'
									),
								},
							] }
							onChange={ setSegmentEvaluation }
						/>
					</div>
				) }
			</h2>

			{ isSubscribed ? (
				<div className="nab-edit-experiment-segmentation-section__content">
					<SegmentList />
					{ segment ? (
						<SegmentView
							name={ segment.attributes.name }
							setName={ ( name ) =>
								updateActiveSegment( {
									...segment.attributes,
									name,
								} )
							}
							removeSegment={
								canSegmentBeRemoved
									? removeActiveSegment
									: undefined
							}
						/>
					) : (
						<p className="nab-edit-experiment-segmentation-section__content--empty">
							{ _x(
								'Add a new segment to narrow your tested audience and target only a subset of your visitors.',
								'user',
								'nelio-ab-testing'
							) }
						</p>
					) }
				</div>
			) : (
				<div className="nab-edit-experiment-segmentation-section__content nab-edit-experiment-segmentation-section__content--free">
					<p>
						{ _x(
							'All your visitors participate in this test. Segmentation allows you to narrow your tested audience and target only a subset of your visitors.',
							'user',
							'nelio-ab-testing'
						) }
					</p>
					<div className="nab-edit-experiment-segmentation-section__content-action">
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
								'Subscribe to Unlock Segmentation',
								'user',
								'nelio-ab-testing'
							) }
						</ExternalLink>
					</div>
				</div>
			) }
		</div>
	);
};

// =====
// HOOKS
// =====

const useActiveSegment = () => {
	const segment = useSelect( ( select ) =>
		select( NAB_EDITOR ).getActiveSegment()
	);

	const { updateSegment: doUpdate } = useDispatch( NAB_EDITOR );
	const updateSegment = ( attributes: Dict ) => {
		if ( segment?.id ) {
			void doUpdate( segment.id, attributes );
		} //end if
	};

	return [ segment, updateSegment ] as const;
};

const useActiveSegmentRemover = () => {
	const [ segment ] = useActiveSegment();
	const segments = useSelect( ( select ) =>
		select( NAB_EDITOR ).getSegments()
	);

	const { removeSegments, setActiveSegment } = useDispatch( NAB_EDITOR );

	if ( ! segment ) {
		return () => null;
	} //end if

	return () => {
		const nextSegment = getAdjacentSegment( segments, segment.id );
		if ( nextSegment ) {
			void setActiveSegment( nextSegment.id );
		} //end if
		void removeSegments( segment.id );
	};
};

const useSegmentEvaluation = () => {
	const segmentEvaluation = useSelect( ( select ) =>
		select( NAB_EDITOR ).getSegmentEvaluation()
	);
	const { setSegmentEvaluation } = useDispatch( NAB_EDITOR );
	return [ segmentEvaluation, setSegmentEvaluation ] as const;
};

// =======
// HELPERS
// =======

function getAdjacentSegment(
	segments: ReadonlyArray< Segment >,
	segmentId: SegmentId
): Segment | false {
	const index = findIndex( segments, { id: segmentId } );
	return segments[ index + 1 ] || segments[ index - 1 ] || false;
} //end getAdjacentSegment()
