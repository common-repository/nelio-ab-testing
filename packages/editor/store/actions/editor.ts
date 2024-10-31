/**
 * External dependencies
 */
import type { Experiment, GoalId, SegmentId } from '@nab/types';

export type EditorAction =
	| SetActiveGoal
	| SetActiveSegment
	| SetExperimentAsBeingSaved
	| SetDraftStatusRationale
	| SetExperimentAsRecentlySaved
	| SetupEditor
	| OpenAlternativePreviewer
	| CloseAlternativePreviewer;

export type SetupEditor = {
	readonly type: 'SETUP_EDITOR';
	readonly experiment: Experiment;
};

export function setupEditor( experiment: Experiment ): SetupEditor {
	return {
		type: 'SETUP_EDITOR',
		experiment,
	};
} //end setupEditor()

export function setActiveGoal( goalId: GoalId ): SetActiveGoal {
	return {
		type: 'SET_ACTIVE_GOAL',
		goalId,
	};
} //end setActiveGoal()

export function setActiveSegment( segmentId: SegmentId ): SetActiveSegment {
	return {
		type: 'SET_ACTIVE_SEGMENT',
		segmentId,
	};
} //end setActiveSegment()

export function setExperimentAsBeingSaved(
	status: boolean
): SetExperimentAsBeingSaved {
	return {
		type: 'SET_EXPERIMENT_AS_BEING_SAVED',
		status,
	};
} //end setExperimentAsBeingSaved()

export function setDraftStatusRationale(
	rationale: string
): SetDraftStatusRationale {
	return {
		type: 'SET_DRAFT_STATUS_RATIONALE',
		rationale,
	};
} //end setDraftStatusRationale()

export function setExperimentAsRecentlySaved(): SetExperimentAsRecentlySaved {
	return {
		type: 'SET_EXPERIMENT_AS_RECENTLY_SAVED',
	};
} //end setExperimentAsBeingSaved()

export function openAlternativePreviewer(
	url: string
): OpenAlternativePreviewer {
	return {
		type: 'OPEN_ALTERNATIVE_PREVIEWER',
		url,
	};
} //end openAlternativePreviewer()

export function closeAlternativePreviewer(): CloseAlternativePreviewer {
	return {
		type: 'CLOSE_ALTERNATIVE_PREVIEWER',
	};
} //end closeAlternativePreviewer()

// =====
// TYPES
// =====

type SetActiveGoal = {
	readonly type: 'SET_ACTIVE_GOAL';
	readonly goalId: GoalId;
};

type SetActiveSegment = {
	readonly type: 'SET_ACTIVE_SEGMENT';
	readonly segmentId: SegmentId;
};

type SetExperimentAsBeingSaved = {
	readonly type: 'SET_EXPERIMENT_AS_BEING_SAVED';
	readonly status: boolean;
};

type SetDraftStatusRationale = {
	readonly type: 'SET_DRAFT_STATUS_RATIONALE';
	readonly rationale: string;
};

type SetExperimentAsRecentlySaved = {
	readonly type: 'SET_EXPERIMENT_AS_RECENTLY_SAVED';
};

type OpenAlternativePreviewer = {
	readonly type: 'OPEN_ALTERNATIVE_PREVIEWER';
	readonly url: string;
};

type CloseAlternativePreviewer = {
	readonly type: 'CLOSE_ALTERNATIVE_PREVIEWER';
};
