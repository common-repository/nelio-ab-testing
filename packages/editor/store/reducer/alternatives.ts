/**
 * External dependencies
 */
import { difference, keyBy, map, omit, zip } from 'lodash';
import { isDefined, isEmpty } from '@nab/utils';
import type { AnyAction } from '@nab/types';

/**
 * Internal dependencies
 */
import { INIT_STATE as IS } from '../config';

import type { State as FullState } from '../types';
type State = FullState[ 'experiment' ][ 'alternatives' ];

import type { AlternativeAction } from '../actions/alternatives';
import type { SetupEditor } from '../actions/editor';
type Action = AlternativeAction | SetupEditor;

const INIT_STATE = IS.experiment.alternatives;

export function alternatives( state = INIT_STATE, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end alternatives()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'ADD_ALTERNATIVES':
			return {
				byId: {
					...state.byId,
					...keyBy( action.alternatives, 'id' ),
				},
				allIds: [
					...state.allIds,
					...map( action.alternatives, 'id' ),
				],
			};

		case 'REMOVE_ALTERNATIVES':
			return {
				byId: {
					control: state.byId.control,
					...omit( state.byId, action.ids ),
				},
				allIds: difference(
					state.allIds,
					action.ids.filter( ( id ) => id !== 'control' )
				),
			};

		case 'REPLACE_ALTERNATIVES': {
			const pairs = zip(
				action.oldIds,
				map( action.alternatives, 'id' )
			);
			return {
				byId: {
					control: state.byId.control,
					...omit( state.byId, action.oldIds ),
					...keyBy( action.alternatives, 'id' ),
				},
				allIds: [
					...state.allIds
						.map( ( id ) => {
							const r = pairs.find( ( p ) => p[ 0 ] === id );
							return r ? r[ 1 ] : id;
						} )
						.filter( isDefined ),
					...pairs
						.filter( ( p ) => ! p[ 0 ] )
						.map( ( p ) => p[ 1 ] )
						.filter( isDefined ),
				],
			};
		}

		case 'SET_ALTERNATIVE':
			if ( ! action.alternative || isEmpty( action.alternative ) ) {
				return state;
			} //end if

			if ( isEmpty( state.byId[ action.id ] ) ) {
				return state;
			} //end if

			return {
				...state,
				byId: {
					...state.byId,
					[ action.id ]: action.alternative,
				},
			};

		case 'SETUP_EDITOR':
			if ( 'nab/heatmap' === action.experiment.type ) {
				return INIT_STATE;
			} //end if

			return {
				byId: {
					control: state.byId.control,
					...keyBy( action.experiment.alternatives, 'id' ),
				},
				allIds: map( action.experiment.alternatives, 'id' ),
			};
	} //end switch
} //end actualReducer()
