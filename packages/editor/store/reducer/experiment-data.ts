/**
 * External dependencies
 */
import { omit } from 'lodash';
import type { AnyAction } from '@nab/types';

/**
 * Internal dependencies
 */
import { INIT_STATE as IS } from '../config';

import type { State as FullState } from '../types';
type State = FullState[ 'experiment' ][ 'data' ];

import type { ExperimentDataAction } from '../actions/experiment-data';
import type { SetupEditor } from '../actions/editor';
type Action = ExperimentDataAction | SetupEditor;

const INIT_STATE = IS.experiment.data;

export function data( state = INIT_STATE, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end data()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'UPDATE_EXPERIMENT_DATA':
			return {
				...state,
				...action.attributes,
			};

		case 'SET_TESTED_ELEMENT_AS_INVALID':
			return {
				...state,
				isTestedElementInvalid: !! action.invalid,
			};

		case 'SETUP_EDITOR':
			return {
				...state,
				...omit( action.experiment, [
					'alternatives',
					'goals',
					'scope',
					'segments',
				] ),
			};
	} //end switch
} //end actualReducer()
