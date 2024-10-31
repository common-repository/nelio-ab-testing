/**
 * External dependencies
 */
import { values } from 'lodash';
import createSelector from 'rememo';
import type { Segment, SegmentId, SegmentationRule } from '@nab/types';
import { isDefined } from '@nab/utils';

/**
 * Internal dependencies.
 */
import type { State } from '../types';

export const getSegments = createSelector(
	( state: State ): ReadonlyArray< Omit< Segment, 'segmentationRules' > > =>
		values( state.experiment.segmentation.segments ).filter( isDefined ),
	( state: State ) => [ state.experiment.segmentation.segments ]
);

export const getSegmentationRules = createSelector(
	( state: State, segmentId: SegmentId ): ReadonlyArray< SegmentationRule > =>
		values( state.experiment.segmentation.rules[ segmentId ] ),
	( state: State, segmentId: SegmentId ) => [
		state.experiment.segmentation.rules,
		segmentId,
	]
);

export function getSegmentEvaluation( state: State ): 'site' | 'tested-page' {
	return state.experiment.segmentation.evaluation;
} //end getSegmentEvaluation()
