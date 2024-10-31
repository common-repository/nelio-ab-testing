/**
 * External dependencies
 */
import type {
	Alternative,
	AlternativeId,
	ConversionAction,
	ConversionActionId,
	Experiment,
	Goal,
	GoalId,
	Heatmap,
	ScopeRule,
	ScopeRuleId,
	Segment,
	SegmentId,
	SegmentationRule,
	SegmentationRuleId,
} from '@nab/types';

export type State = {
	readonly editor: {
		readonly activeGoalId: GoalId;
		readonly activeSegmentId: SegmentId;
		readonly alternativePreviewerUrl: string;
		readonly draftStatusRationale: string;
		readonly hasExperimentBeenRecentlySaved: boolean;
		readonly isExperimentBeingSaved: boolean;
	};

	readonly experiment: {
		readonly alternatives: {
			readonly byId: Partial< Record< AlternativeId, Alternative > >;
			readonly allIds: ReadonlyArray< AlternativeId >;
		};

		readonly conversionActions: Partial<
			Record< GoalId, Record< ConversionActionId, ConversionAction > >
		>;

		readonly data: ExperimentData;

		readonly goals: Partial<
			Record< GoalId, Omit< Goal, 'conversionActions' > >
		>;

		readonly scope: Partial< Record< ScopeRuleId, ScopeRule > >;

		readonly segmentation: {
			readonly evaluation: Experiment[ 'segmentEvaluation' ];
			readonly rules: Partial<
				Record<
					SegmentId,
					Record< SegmentationRuleId, SegmentationRule >
				>
			>;

			readonly segments: Partial<
				Record< SegmentId, Omit< Segment, 'segmentationRules' > >
			>;
		};
	};
};

export type ExperimentAttributes = Omit<
	Experiment,
	'alternatives' | 'goals' | 'segmentEvaluation' | 'segments' | 'scope'
>;

export type HeatmapAttributes = Partial< Omit< Heatmap, keyof Experiment > >;

export type ExperimentData = ExperimentAttributes &
	HeatmapAttributes & {
		readonly isTestedElementInvalid: boolean;
	};
