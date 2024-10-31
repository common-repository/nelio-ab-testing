/**
 * External dependencies
 */
import { keyBy, omit } from 'lodash';
import type { AnyAction } from '@nab/types';

/**
 * Internal dependencies
 */
import { INIT_STATE as IS } from '../config';

import type { State as FullState } from '../types';
type State = FullState[ 'experiment' ][ 'segmentation' ];

import type { SegmentationAction } from '../actions/segmentation';
import type { SetupEditor } from '../actions/editor';
type Action = SegmentationAction | SetupEditor;

const INIT_STATE = IS.experiment.segmentation;

export function segmentation( state = INIT_STATE, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end segmentation()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'ADD_SEGMENTS':
			return {
				...state,
				segments: {
					...state.segments,
					...keyBy( action.segments, 'id' ),
				},
			};

		case 'UPDATE_SEGMENT': {
			const oldSegment = state.segments[ action.segmentId ];
			if ( ! oldSegment ) {
				return state;
			} //end if

			return {
				...state,
				segments: {
					...state.segments,
					[ action.segmentId ]: {
						...oldSegment,
						attributes: {
							...oldSegment.attributes,
							...action.attributes,
						},
					},
				},
			};
		}

		case 'REMOVE_SEGMENTS':
			return {
				...state,
				segments: omit( state.segments, action.ids ),
			};

		case 'ADD_SEGMENTATION_RULES_INTO_SEGMENT':
			return {
				...state,
				rules: {
					...state.rules,
					[ action.segmentId ]: {
						...state.rules[ action.segmentId ],
						...keyBy( action.segmentationRules, 'id' ),
					},
				},
			};

		case 'REPLACE_SEGMENTATION_RULES_IN_SEGMENT':
			return {
				...state,
				rules: {
					...state.rules,
					[ action.segmentId ]: {
						...keyBy( action.segmentationRules, 'id' ),
					},
				},
			};

		case 'UPDATE_SEGMENTATION_RULE': {
			const segment = state.rules[ action.segmentId ];
			if ( ! segment ) {
				return state;
			} //end if

			const oldSegmentationRule = segment[ action.segmentationRuleId ];
			if ( ! oldSegmentationRule ) {
				return state;
			} //end if

			return {
				...state,
				rules: {
					...state.rules,
					[ action.segmentId ]: {
						...segment,
						[ action.segmentationRuleId ]: {
							...oldSegmentationRule,
							attributes: {
								...oldSegmentationRule.attributes,
								...action.attributes,
							},
						},
					},
				},
			};
		}

		case 'REMOVE_SEGMENTATION_RULES_FROM_SEGMENT':
			return {
				...state,
				rules: {
					...state.rules,
					[ action.segmentId ]: omit(
						state.rules[ action.segmentId ],
						action.segmentationRuleIds
					),
				},
			};

		case 'SET_SEGMENT_EVALUATION':
			return {
				...state,
				evaluation: action.strategy,
			};

		case 'SETUP_EDITOR':
			if ( 'nab/heatmap' === action.experiment.type ) {
				return state;
			} //end if

			return {
				evaluation: action.experiment.segmentEvaluation,
				rules: action.experiment.segments.reduce(
					( memo, segment ) => {
						memo[ segment.id ] = keyBy(
							segment.segmentationRules,
							'id'
						);
						return memo;
					},
					{} as State[ 'rules' ]
				),
				segments: keyBy(
					action.experiment.segments.map( ( segment ) =>
						omit( segment, 'segmentationRules' )
					),
					'id'
				),
			};
	} //end switch
} //end actualReducer()
