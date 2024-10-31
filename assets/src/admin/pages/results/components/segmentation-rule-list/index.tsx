/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { find } from 'lodash';
import { SegmentationRule } from '@nab/components';
import { usePageAttribute } from '@nab/data';

/**
 * Internal dependencies
 */
import { useExperimentAttribute } from '../hooks';

export const SegmentationRuleList = (): JSX.Element | null => {
	const status = useExperimentAttribute( 'status' );
	const segmentationRules = useSegmentationRules();
	const [ activeSegmentId ] = usePageAttribute(
		'editor/activeSegment',
		'default'
	);
	const segments = useExperimentAttribute( 'segments' ) || [];
	const isDefaultSegment =
		'default' === activeSegmentId && 1 < segments.length;

	if ( ! segmentationRules.length && ! isDefaultSegment ) {
		return null;
	} //end if

	if ( isDefaultSegment ) {
		return (
			<>
				{ 'running' === status ? (
					<p>
						{ _x(
							'Results from visitors that belong to any segment.',
							'text',
							'nelio-ab-testing'
						) }
					</p>
				) : (
					<p>
						{ _x(
							'Results from visitors that belonged to any segment.',
							'text',
							'nelio-ab-testing'
						) }
					</p>
				) }
			</>
		);
	} //end if

	return (
		<>
			{ 'running' === status ? (
				<p>
					{ _x(
						'Results from visitors that match all of the following segmentation rules:',
						'text',
						'nelio-ab-testing'
					) }
				</p>
			) : (
				<p>
					{ _x(
						'Results from visitors that matched all of the following segmentation rules:',
						'text',
						'nelio-ab-testing'
					) }
				</p>
			) }
			<div className="nab-segmentation-rule-list">
				{ segmentationRules.map( ( rule ) => (
					<SegmentationRule key={ rule.id } rule={ rule } />
				) ) }
			</div>
		</>
	);
};

// =====
// HOOKS
// =====

const useSegmentationRules = () => useActiveSegment()?.segmentationRules || [];

const useActiveSegment = () => {
	const segments = useExperimentAttribute( 'segments' ) || [];
	const [ activeSegmentId ] = usePageAttribute(
		'editor/activeSegment',
		'default'
	);
	if ( 'default' === activeSegmentId && segments.length === 1 ) {
		return segments[ 0 ];
	} //end if
	return find( segments, { id: activeSegmentId } );
};
