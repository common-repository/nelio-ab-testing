/**
 * External dependencies
 */
import { createAlternative, createGoal } from '@nab/utils';
import type {
	Alternative,
	AlternativeId,
	AnyAction,
	Experiment,
	Maybe,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { ExperimentAction as Action } from '../actions/experiment';

type State = FullState[ 'experiments' ];

export function experiments(
	state = INIT_STATE.experiments,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end experiments()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'RECEIVE_EXPERIMENT':
			return {
				...state,
				[ action.key ]: {
					...action.experiment,
					alternatives: maybeAddDefaultAlternatives(
						action.experiment.alternatives
					),
					goals: action.experiment.goals || [ createGoal() ],
					segments: action.experiment.segments || [],
				},
			};

		case 'CHANGE_LAST_APPLIED_ALTERNATIVE':
			const experiment: Maybe< Experiment > =
				state[ action.experimentId ];
			if ( ! experiment ) {
				return state;
			} //end if

			return {
				...state,
				[ action.experimentId ]: {
					...experiment,
					alternatives: experiment.alternatives.map(
						isLastApplied( action.alternativeId )
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
					) as any as Experiment[ 'alternatives' ],
				},
			};
	} //end switch
} //end actualReducer()

// =======
// HELPERS
// =======

const isLastApplied = ( aid: AlternativeId ) =>
	function < T extends Alternative >( a: T ): T {
		return { ...a, isLastApplied: a.id === aid };
	};

// TODO. Improve these types.
function maybeAddDefaultAlternatives< T extends Experiment[ 'alternatives' ] >(
	alternatives: T
): T {
	const defaultOriginal = createAlternative( 'control' );
	const defaultFirstAlt = createAlternative();

	if ( ! alternatives ) {
		return [ defaultOriginal, defaultFirstAlt ] as unknown as T;
	} //end if

	if ( alternatives[ 0 ].id !== 'control' ) {
		return [ defaultOriginal, ...alternatives ] as unknown as T;
	} //end if

	if ( 1 === alternatives.length ) {
		return [ alternatives[ 0 ], defaultFirstAlt ] as unknown as T;
	} //end if

	return alternatives;
} //end maybeAddDefaultAlternatives()
