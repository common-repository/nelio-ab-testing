/**
 * Internal dependencies
 */
import type { ExperimentId, GoalId, SegmentId } from '@nab/types';
import type { State } from './types';

export const INIT_STATE: State = {
	editor: {
		activeGoalId: '' as GoalId,
		activeSegmentId: '' as SegmentId,
		alternativePreviewerUrl: '',
		draftStatusRationale: '',
		hasExperimentBeenRecentlySaved: false,
		isExperimentBeingSaved: false,
	},

	experiment: {
		alternatives: {
			byId: {
				control: {
					id: 'control',
					attributes: {},
					links: { edit: '', heatmap: '', preview: '' },
				},
			},
			allIds: [],
		},

		conversionActions: {},

		data: {
			id: 0 as ExperimentId,
			type: '',
			status: 'draft',
			name: '',
			description: '',
			startDate: '',
			endDate: '',
			endMode: 'manual',
			endValue: 0,
			isTestedElementInvalid: false,
			links: {
				edit: '',
				preview: '',
			},
		},

		goals: {},

		scope: {},

		segmentation: {
			evaluation: 'tested-page',
			rules: {},
			segments: {},
		},
	},
};
