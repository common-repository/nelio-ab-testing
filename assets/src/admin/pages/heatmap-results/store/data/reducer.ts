/**
 * External dependencies
 */
import { isEqual, mapValues } from 'lodash';
import type {
	AlternativeIndex,
	AnyAction,
	ConfettiOption,
	ConfettiType,
	Dict,
	HeatmapResolution,
	Maybe,
	RawHeatmapResults,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { INIT } from './config';
import { getConfettiFilterOptions } from '../../utils';

import type { DataAction as Action } from './actions';
import type {
	LoadAttemptsData,
	ProcessedAlternative,
	ResolutionResults,
	State,
} from './config';

export function reducer( state = INIT, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'RECEIVE_RAW_RESULTS':
		case 'SET_PROCESSED_RESULTS': {
			const alternative =
				state.byAlternative[ action.alternative ] ??
				DEFAULT_ALTERNATIVE;
			state = {
				...state,
				byAlternative: {
					...state.byAlternative,
					[ action.alternative ]: reduceAlternative(
						state,
						alternative,
						action
					),
				},
			};
			state = updateConfettiOptions( state );
			return state;
		} //end case

		case 'UPDATE_LOAD_ATTEMPTS':
		case 'SET_RAW_RESULT_STATUS':
		case 'SET_RAW_RESULT_PROGRESS':
		case 'MARK_RESULTS_AS_PROCESSING':
		case 'REQUEST_RESULTS_PROCESSING':
		case 'SET_PAGE_INFO': {
			const alternative =
				state.byAlternative[ action.alternative ] ??
				DEFAULT_ALTERNATIVE;
			return {
				...state,
				byAlternative: {
					...state.byAlternative,
					[ action.alternative ]: reduceAlternative(
						state,
						alternative,
						action
					),
				},
			};
		} //end default
	} //end switch
} //end actualReducer()

function reduceAlternative(
	state: State,
	alternative: ProcessedAlternative,
	action: Action
): ProcessedAlternative {
	switch ( action.type ) {
		case 'RECEIVE_RAW_RESULTS': {
			return {
				raw: action.data,
				byResolution: mapValues(
					alternative.byResolution,
					< R extends ResolutionResults >( r: R ): R => ( {
						...r,
						status: 'missing' === r.status ? 'missing' : 'outdated',
					} )
				),
				loadAttempts: alternative.loadAttempts,
			};
		} //end case

		case 'SET_RAW_RESULT_STATUS': {
			return {
				...alternative,
				raw: {
					...alternative.raw,
					status: action.status,
				},
			};
		} //end case

		case 'SET_RAW_RESULT_PROGRESS': {
			return {
				...alternative,
				raw: {
					...alternative.raw,
					progress: action.progress,
				},
			};
		} //end case

		case 'UPDATE_LOAD_ATTEMPTS': {
			return {
				...alternative,
				loadAttempts: {
					clicks: updateLoadAttempts(
						alternative.loadAttempts.clicks,
						action.clicks
					),
					scrolls: updateLoadAttempts(
						alternative.loadAttempts.scrolls,
						action.scrolls
					),
				},
			};
		} //end case

		case 'SET_PROCESSED_RESULTS': {
			if ( ! hasRawData( state, action.alternative ) ) {
				return alternative;
			} //end if
			const prevResults: ResolutionResults =
				alternative.byResolution[ action.resolution ];
			const results: ResolutionResults = {
				...prevResults,
				results: action.results,
				status: 'ready',
				confettiFilterOptions: getConfettiFilterOptions(
					action.results.clicks
				),
			};
			return {
				...alternative,
				byResolution: {
					...alternative.byResolution,
					[ action.resolution ]: results,
				},
			};
		} //end case

		case 'MARK_RESULTS_AS_PROCESSING': {
			if (
				! canProcessResults(
					state,
					action.alternative,
					action.resolution
				)
			) {
				return alternative;
			} //end if
			const prevStatus =
				alternative.byResolution[ action.resolution ].status;
			return {
				...alternative,
				byResolution: {
					...alternative.byResolution,
					[ action.resolution ]: {
						...alternative.byResolution[ action.resolution ],
						status:
							'missing' === prevStatus
								? 'initializing'
								: 'processing',
					},
				},
			};
		} //end case

		case 'REQUEST_RESULTS_PROCESSING': {
			if (
				! canProcessResults(
					state,
					action.alternative,
					action.resolution
				)
			) {
				return alternative;
			} //end if
			return {
				...alternative,
				byResolution: {
					...alternative.byResolution,
					[ action.resolution ]: {
						...alternative.byResolution[ action.resolution ],
						status: 'outdated',
					},
				},
			};
		} //end case

		case 'SET_PAGE_INFO': {
			const prevResults: ResolutionResults =
				alternative.byResolution[ action.resolution ];
			const results: ResolutionResults =
				prevResults.status === 'missing'
					? {
							...prevResults,
							page: action.page,
					  }
					: {
							...prevResults,
							page: action.page,
							status: 'outdated',
					  };
			return {
				...alternative,
				byResolution: {
					...alternative.byResolution,
					[ action.resolution ]: results,
				},
			};
		} //end case
	} //end switch
} //end reduceAlternative()

// =======
// HELPERS
// =======

const NO_PROCESSED_RESULTS: ResolutionResults = {
	page: {
		boundingBoxes: {},
		dimensions: { width: 0, bodyHeight: 0, iframeHeight: 0 },
	},
	status: 'missing',
};

const DEFAULT_ALTERNATIVE: ProcessedAlternative = {
	raw: {
		results: { clicks: [], scrolls: [] },
		status: { mode: 'missing' },
		progress: 0,
	},
	byResolution: {
		desktop: NO_PROCESSED_RESULTS,
		smartphone: NO_PROCESSED_RESULTS,
		tablet: NO_PROCESSED_RESULTS,
	},
	loadAttempts: {
		clicks: { count: 0, length: 0 },
		scrolls: { count: 0, length: 0 },
	},
};

function hasRawData( state: State, index: AlternativeIndex ) {
	const alternative = state.byAlternative[ index ] ?? DEFAULT_ALTERNATIVE;
	const rawStatus = alternative.raw.status.mode;
	return (
		rawStatus === 'still-loading' ||
		rawStatus === 'canceling' ||
		rawStatus === 'ready'
	);
} //end hasRawData()

function canProcessResults(
	state: State,
	index: AlternativeIndex,
	resolution: HeatmapResolution
): boolean {
	if ( ! hasRawData( state, index ) ) {
		return false;
	} //end if

	const alternative = state.byAlternative[ index ] ?? DEFAULT_ALTERNATIVE;
	const processedStatus = alternative.byResolution[ resolution ].status;
	if ( processedStatus === 'processing' ) {
		return false;
	} //end if

	return true;
} //end canProcessResults()

function updateConfettiOptions( state: State ): State {
	const allClicks = Object.values( state.byAlternative ).flatMap(
		( alt ) => alt.raw.results.clicks
	);
	const confettiFilterOptions = mapValues(
		getConfettiFilterOptions( allClicks ),
		( options ) =>
			mapValues( options, ( option ) => ( { ...option, value: 0 } ) )
	);

	if ( isEqual( state.confettiFilterOptions, confettiFilterOptions ) ) {
		return state;
	} //end if

	state = {
		confettiFilterOptions,
		byAlternative: mapValues( state.byAlternative, ( alternative ) => ( {
			...alternative,
			byResolution: mapValues(
				alternative.byResolution,
				( resolution ) =>
					! resolution.confettiFilterOptions
						? resolution
						: {
								...resolution,
								confettiFilterOptions:
									mergeConfettiFilterOptions(
										confettiFilterOptions,
										resolution.confettiFilterOptions
									),
						  }
			),
		} ) ),
	};
	return state;
} //end updateConfettiOptions()

function mergeConfettiFilterOptions(
	defaults: Partial< Record< ConfettiType, Dict< ConfettiOption > > >,
	current: Partial< Record< ConfettiType, Dict< ConfettiOption > > >
): Partial< Record< ConfettiType, Dict< ConfettiOption > > > {
	return mapValues(
		defaults,
		( options: Dict< ConfettiOption >, type: ConfettiType ) =>
			mapValues(
				options,
				( option, key ): ConfettiOption => ( {
					...option,
					value: current[ type ]?.[ key ]?.value ?? 0,
				} )
			)
	);
} //end mergeConfettiFilterOptions()

function updateLoadAttempts(
	attempts: LoadAttemptsData,
	data: Maybe< RawHeatmapResults >
): LoadAttemptsData {
	if ( ! data ) {
		return {
			...attempts,
			count: 1,
		};
	} //end if

	if ( ! data.more || attempts.length !== data.data.length ) {
		return {
			count: 1,
			length: data.data.length,
		};
	} //end if

	return {
		...attempts,
		count: attempts.count + 1,
	};
} //end updateLoadAttempts()
