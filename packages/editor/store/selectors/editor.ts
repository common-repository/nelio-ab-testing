/**
 * External dependencies
 */
import { filter, map, values } from 'lodash';
import type { Goal, Maybe, Segment } from '@nab/types';

/**
 * Internal dependencies.
 */
import type { State } from '../types';

export function isExperimentBeingSaved( state: State ): boolean {
	return !! state.editor.isExperimentBeingSaved;
} //end isExperimentBeingSaved()

export function hasExperimentBeenRecentlySaved( state: State ): boolean {
	return !! state.editor.hasExperimentBeenRecentlySaved;
} //end hasExperimentBeenRecentlySaved()

export function getActiveGoal(
	state: State
): Maybe< Omit< Goal, 'conversionActions' > > {
	return (
		state.experiment.goals[ state.editor.activeGoalId ] ||
		values( state.experiment.goals )[ 0 ]
	);
} //end getActiveGoal()

export function getActiveGoalIndex( state: State ): number {
	return (
		map( state.experiment.goals, 'id' ).indexOf(
			state.editor.activeGoalId
		) || 0
	);
} //end getActiveGoalIndex()

export function getActiveSegment(
	state: State
): Maybe< Omit< Segment, 'segmentationRules' > > {
	return filter( state.experiment.segmentation.segments, {
		id: state.editor.activeSegmentId,
	} )[ 0 ];
} //end getActiveSegment()

export function getActiveSegmentIndex( state: State ): number {
	return (
		map( state.experiment.segmentation.segments, 'id' ).indexOf(
			state.editor.activeSegmentId
		) || 0
	);
} //end getActiveSegmentIndex()

export function getDraftStatusRationale( state: State ): Maybe< string > {
	if ( ! state.experiment || ! state.experiment.data ) {
		return;
	} //end if

	const isDraft = [ 'draft', 'paused_draft' ].includes(
		state.experiment.data.status
	);
	if ( ! isDraft ) {
		return;
	} //end if

	return state.editor.draftStatusRationale;
} //end getDraftStatusRationale()

export function getAlternativePreviewerUrl( state: State ): string {
	return state.editor.alternativePreviewerUrl;
} //end getAlternativePreviewerUrl()
