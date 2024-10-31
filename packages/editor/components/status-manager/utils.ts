/**
 * WordPress dependencies
 */
import { select as doSelect } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim } from 'lodash';
import { getConversionActionScopeError, getLetter, isEmpty } from '@nab/utils';
import type {
	Alternative,
	ConversionActionType,
	ConversionActionTypeName,
	Experiment,
	ExperimentType,
	Goal,
	Segment,
	SegmentationRuleType,
	SegmentationRuleTypeName,
} from '@nab/types';

type ExperimentSummary = Pick< Experiment, 'name' | 'goals' | 'segments' > & {
	readonly alternatives: ReadonlyArray< Alternative >;
	readonly control: Alternative;
	readonly type: ExperimentType;
};

type ConversionActionTypes = Record<
	ConversionActionTypeName,
	ConversionActionType
>;
type SegmentationRuleTypes = Record<
	SegmentationRuleTypeName,
	SegmentationRuleType
>;

export function shouldExperimentBeDraft(
	experiment: ExperimentSummary,
	conversionActionTypes: ConversionActionTypes,
	segmentationRuleTypes: SegmentationRuleTypes
): string | false {
	const { control, alternatives, goals, segments, name, type } = experiment;

	if ( ! name ) {
		return _x( 'Test is unnamed', 'text', 'nelio-ab-testing' );
	} //end if

	if ( alternatives.length < 2 ) {
		return _x(
			'Test doesn’t have any variants',
			'text',
			'nelio-ab-testing'
		);
	} //end if

	const errorWithTestedElement = type.checks.getControlError(
		control.attributes,
		doSelect
	);
	if ( errorWithTestedElement ) {
		return errorWithTestedElement;
	} //end if

	const [ , ...alts ] = alternatives;
	const errorWithAlternative: string | false = alts.reduce(
		( error: false | string, alt, index ) =>
			! error
				? type.checks.getAlternativeError(
						alt.attributes,
						getLetter( index + 1 ),
						control.attributes,
						doSelect
				  )
				: error,
		false
	);
	if ( errorWithAlternative ) {
		return errorWithAlternative;
	} //end if

	const errorWithGoals = areGoalsInvalid( goals, conversionActionTypes );
	if ( errorWithGoals ) {
		return errorWithGoals;
	} //end if

	const errorWithSegments = areSegmentsInvalid(
		segments,
		segmentationRuleTypes
	);
	if ( errorWithSegments ) {
		return errorWithSegments;
	} //end if

	return false;
} //end shouldExperimentBeDraft()

// =======
// HELPERS
// =======

function areGoalsInvalid(
	goals: ReadonlyArray< Goal >,
	conversionActionTypes: ConversionActionTypes
): string | false {
	if ( ! goals.length ) {
		return _x( 'Test doesn’t have any goals', 'text', 'nelio-ab-testing' );
	} //end if

	for ( let i = 0; i < goals.length; ++i ) {
		const goal = goals[ i ];
		if ( ! goal ) {
			continue;
		} //end if
		const errorWithGoal = isGoalInvalid( goal, i, conversionActionTypes );
		if ( errorWithGoal ) {
			return errorWithGoal;
		} //end if
	} //end for

	return false;
} //end areGoalsInvalid()

function isGoalInvalid(
	goal: Goal,
	goalIndex: number,
	conversionActionTypes: ConversionActionTypes
): string | false {
	if ( ! goal.conversionActions.length ) {
		return sprintf(
			/* translators: goal name */
			_x(
				'%s doesn’t have any conversion actions',
				'text',
				'nelio-ab-testing'
			),
			getGoalName( goal, goalIndex )
		);
	} //end if

	for ( let i = 0; i < goal.conversionActions.length; ++i ) {
		const conversionAction = goal.conversionActions[ i ];
		if ( ! conversionAction ) {
			continue;
		} //end if
		const conversionActionType =
			conversionActionTypes[ conversionAction.type ];
		if ( ! conversionActionType ) {
			return sprintf(
				/* translators: goal name */
				_x(
					'%s has one or more invalid conversion actions',
					'text',
					'nelio-ab-testing'
				),
				getGoalName( goal, goalIndex )
			);
		} //end if

		if (
			! isEmpty(
				conversionActionType.validate?.( conversionAction.attributes )
			) ||
			! isEmpty( getConversionActionScopeError( conversionAction.scope ) )
		) {
			return sprintf(
				/* translators: goal name, as in “Goal 2” or “Default Goal” */
				_x(
					'One or more conversion actions in %s are invalid',
					'text',
					'nelio-ab-testing'
				),
				getGoalName( goal, goalIndex )
			);
		} //end if
	} //end for

	return false;
} //end isGoalInvalid()

function getGoalName( goal: Goal, index: number ): string {
	let goalName = sprintf(
		/* translators: goal id */
		_x( 'Goal %d', 'text', 'nelio-ab-testing' ),
		index + 1
	);
	if ( 0 === index ) {
		goalName = _x( 'Default Goal', 'text', 'nelio-ab-testing' );
	} //end if

	if ( trim( goal.attributes.name ) ) {
		goalName = sprintf(
			/* translators: goal name */
			_x( 'Goal “%s”', 'text', 'nelio-ab-testing' ),
			trim( goal.attributes.name )
		);
	} //end if

	return goalName;
} //end getGoalName()

function areSegmentsInvalid(
	segments: ReadonlyArray< Segment >,
	segmentationRuleTypes: SegmentationRuleTypes
): string | false {
	for ( let i = 0; i < segments.length; ++i ) {
		const segment = segments[ i ];
		if ( ! segment ) {
			continue;
		} //end if
		const errorWithSegment = isSegmentInvalid(
			segment,
			i,
			segmentationRuleTypes
		);
		if ( errorWithSegment ) {
			return errorWithSegment;
		} //end if
	} //end for

	return false;
} //end areSegmentsInvalid()

function isSegmentInvalid(
	segment: Segment,
	segmentIndex: number,
	segmentationRuleTypes: SegmentationRuleTypes
) {
	if ( ! segment.segmentationRules.length ) {
		return sprintf(
			/* translators: segment name */
			_x(
				'%s doesn’t have any segmentation rules',
				'text',
				'nelio-ab-testing'
			),
			getSegmentName( segment, segmentIndex )
		);
	} //end if

	for ( let i = 0; i < segment.segmentationRules.length; ++i ) {
		const segmentationRule = segment.segmentationRules[ i ];
		if ( ! segmentationRule ) {
			continue;
		} //end if
		const segmentationRuleType =
			segmentationRuleTypes[ segmentationRule.type ];
		if ( ! segmentationRuleType ) {
			return sprintf(
				/* translators: segment name */
				_x(
					'%s has one or more invalid segmentation rules',
					'text',
					'nelio-ab-testing'
				),
				getSegmentName( segment, segmentIndex )
			);
		} //end if

		if (
			! isEmpty(
				segmentationRuleType.validate?.( segmentationRule.attributes )
			)
		) {
			return sprintf(
				/* translators: segment name, as in Segment 2” */
				_x(
					'One or more segmentation rules in %s are invalid',
					'text',
					'nelio-ab-testing'
				),
				getSegmentName( segment, segmentIndex )
			);
		} //end if
	} //end for

	return false;
} //end isSegmentInvalid()

function getSegmentName( segment: Segment, index: number ): string {
	let segmentName = sprintf(
		/* translators: segment id */
		_x( 'Segment %d', 'text', 'nelio-ab-testing' ),
		index + 1
	);

	if ( trim( segment.attributes.name ) ) {
		segmentName = sprintf(
			/* translators: segment name */
			_x( 'Segment “%s”', 'text', 'nelio-ab-testing' ),
			trim( segment.attributes.name )
		);
	} //end if

	return segmentName;
} //end getSegmentName()
