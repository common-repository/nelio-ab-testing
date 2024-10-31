/**
 * External dependencies
 */
import { values } from 'lodash';
import type {
	AlternativeTrackingData,
	AlternativeId,
	GoalId,
	ExperimentId,
	Maybe,
	ResultStatus,
	Results,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { differenceInDays } from '../utils';
import { getDefaultGoal, getExperiment } from './experiment';
import { getPageAttribute } from './page';
import { getPluginSetting } from './settings';
import { State } from '../types';

export function getExperimentResults(
	state: State,
	key?: ExperimentId
): Maybe< Results > {
	return key ? state.results[ key ] : undefined;
} //end getExperimentResults()

export function getWinnersInExperiment(
	state: State,
	key: ExperimentId
): Maybe< Results[ 'winners' ] > {
	const results = getExperimentResults( state, key );
	if ( ! results ) {
		return;
	} //end if

	const areResultsUnique = areUniqueResultsVisible( state, key );
	const activeSegment =
		getPageAttribute( state, 'editor/activeSegment' ) ?? 'default';

	const winnerKey = areResultsUnique ? 'winnersUnique' : 'winners';
	return activeSegment === 'default'
		? results[ winnerKey ]
		: results.segments[ activeSegment ]?.[ winnerKey ];
} //end getWinnersInExperiment()

export function getAlternativeResultsInExperiment(
	state: State,
	key: ExperimentId
): Maybe< ReadonlyArray< AlternativeTrackingData > > {
	const results = getExperimentResults( state, key );
	if ( ! results ) {
		return;
	} //end if

	const activeSegment =
		getPageAttribute( state, 'editor/activeSegment' ) ?? 'default';
	return activeSegment === 'default'
		? values( results.alternatives )
		: values( results.segments[ activeSegment ]?.alternatives );
} //end getAlternativeResultsInExperiment()

export function getPageViews( state: State, key: ExperimentId ): number {
	const areResultsUnique = areUniqueResultsVisible( state, key );
	return areResultsUnique
		? getUniquePageViews( state, key )
		: getTotalPageViews( state, key );
} //end getPageViews()

export function getTotalPageViews( state: State, key: ExperimentId ): number {
	const results = getExperimentResults( state, key );
	if ( ! results?.alternatives ) {
		return 0;
	} //end if

	const activeSegment =
		getPageAttribute( state, 'editor/activeSegment' ) ?? 'default';
	const resultsOfAlternatives =
		activeSegment === 'default'
			? values( results.alternatives )
			: values( results.segments[ activeSegment ]?.alternatives );
	return resultsOfAlternatives.reduce(
		( memo, alternative ) => memo + alternative.visits,
		0
	);
} //end getTotalPageViews()

export function getUniquePageViews( state: State, key: ExperimentId ): number {
	const results = getExperimentResults( state, key );
	if ( ! results?.alternatives ) {
		return 0;
	} //end if

	const activeSegment =
		getPageAttribute( state, 'editor/activeSegment' ) ?? 'default';
	const resultsOfAlternatives =
		activeSegment === 'default'
			? values( results.alternatives )
			: values( results.segments[ activeSegment ]?.alternatives );
	return resultsOfAlternatives.reduce(
		( memo, alternative ) => memo + alternative.uniqueVisits,
		0
	);
} //end getUniquePageViews()

export function getAlternativePageViews(
	state: State,
	experimentId: ExperimentId,
	alternativeId: AlternativeId
): number {
	const results = getExperimentResults( state, experimentId );
	if ( ! results?.alternatives ) {
		return 0;
	} //end if

	const activeSegment =
		getPageAttribute( state, 'editor/activeSegment' ) ?? 'default';

	const alternative =
		activeSegment === 'default'
			? results.alternatives[ alternativeId ]
			: results.segments[ activeSegment ]?.alternatives[ alternativeId ];
	if ( ! alternative ) {
		return 0;
	} //end if

	const areResultsUnique = areUniqueResultsVisible( state, experimentId );
	return areResultsUnique ? alternative.uniqueVisits : alternative.visits;
} //end getAlternativePageViews()

export function getConversions(
	state: State,
	key: ExperimentId,
	goalId?: GoalId
): number {
	const results = getExperimentResults( state, key );
	if ( ! results || ! results.alternatives ) {
		return 0;
	} //end if

	const gid = goalId ?? getDefaultGoal( state, key )?.id ?? '';
	if ( ! gid ) {
		return 0;
	} //end if

	const areResultsUnique = areUniqueResultsVisible( state, key );
	const activeSegment =
		getPageAttribute( state, 'editor/activeSegment' ) ?? 'default';
	const resultsOfAlternatives =
		activeSegment === 'default'
			? values( results.alternatives )
			: values( results.segments[ activeSegment ]?.alternatives );

	return resultsOfAlternatives.reduce(
		( memo, alternative ) =>
			memo +
			( ( areResultsUnique
				? alternative.uniqueConversions[ gid ]
				: alternative.conversions[ gid ] ) || 0 ),
		0
	);
} //end getConversions()

export function getTotalRevenue(
	state: State,
	key: ExperimentId,
	goalId?: GoalId
): number {
	const results = getExperimentResults( state, key );
	if ( ! results || ! results.alternatives ) {
		return 0;
	} //end if

	const gid = goalId ?? getDefaultGoal( state, key )?.id ?? '';
	if ( ! gid ) {
		return 0;
	} //end if

	const areResultsUnique = areUniqueResultsVisible( state, key );
	const activeSegment =
		getPageAttribute( state, 'editor/activeSegment' ) ?? 'default';
	const resultsOfAlternatives =
		activeSegment === 'default'
			? values( results.alternatives )
			: values( results.segments[ activeSegment ]?.alternatives );

	return resultsOfAlternatives.reduce(
		( memo, alternative ) =>
			memo +
			( ( areResultsUnique
				? alternative.uniqueValues[ gid ]
				: alternative.values[ gid ] ) ?? 0 ),
		0
	);
} //end getTotalRevenue()

export function getDaysRunning( state: State, key: ExperimentId ): number {
	const experiment = getExperiment( state, key );
	if ( ! experiment ) {
		return 0;
	} //end if

	const startDate = experiment.startDate;
	let endDate = '';
	if ( 'finished' === experiment.status ) {
		endDate = experiment.endDate || '';
	} //end if

	return differenceInDays( startDate, endDate );
} //end getDaysRunning()

export function getExperimentResultsStatus(
	state: State,
	key: ExperimentId,
	goalId?: GoalId
): Maybe< ResultStatus > {
	const results = getExperimentResults( state, key );
	if ( ! results ) {
		return;
	} //end if

	const gid = goalId ?? getDefaultGoal( state, key )?.id ?? '';
	if ( ! gid ) {
		return;
	} //end if

	const requiredConfidence = getPluginSetting( state, 'minConfidence' );
	if ( ! requiredConfidence ) {
		return;
	} //end if

	const areResultsUnique = areUniqueResultsVisible( state, key );
	const activeSegment =
		getPageAttribute( state, 'editor/activeSegment' ) ?? 'default';

	const winnerKey = areResultsUnique ? 'winnersUnique' : 'winners';

	const winner =
		activeSegment === 'default'
			? results[ winnerKey ]?.[ gid ]
			: results.segments[ activeSegment ]?.[ winnerKey ]?.[ gid ];
	if ( ! winner ) {
		return 'testing';
	} else if ( winner.confidence >= requiredConfidence ) {
		return 'winner';
	} //end if
	return 'possible-winner';
} //end getExperimentResultsStatus()

export function getWinnerAlternative(
	state: State,
	key: ExperimentId,
	goalId?: GoalId
): Maybe< number > {
	const results = getExperimentResults( state, key );
	if ( ! results ) {
		return;
	} //end if

	const gid = goalId ?? getDefaultGoal( state, key )?.id ?? '';
	if ( ! gid ) {
		return;
	} //end if

	const requiredConfidence = getPluginSetting( state, 'minConfidence' );
	if ( ! requiredConfidence ) {
		return;
	} //end if

	const areResultsUnique = areUniqueResultsVisible( state, key );
	const activeSegment =
		getPageAttribute( state, 'editor/activeSegment' ) ?? 'default';

	const winnerKey = areResultsUnique ? 'winnersUnique' : 'winners';

	const winner =
		activeSegment === 'default'
			? results[ winnerKey ]?.[ gid ]
			: results.segments[ activeSegment ]?.[ winnerKey ]?.[ gid ];
	if ( ! winner || winner.confidence < requiredConfidence ) {
		return;
	} //end if

	return winner.alternative;
} //end getWinnerAlternative()

export function getConversionRatesOfAlternativesInGoal(
	state: State,
	key: ExperimentId,
	goalId?: GoalId
): Maybe< ReadonlyArray< number > > {
	const results = getExperimentResults( state, key );
	if ( ! results ) {
		return;
	} //end if

	const gid = goalId ?? getDefaultGoal( state, key )?.id;
	if ( ! gid ) {
		return;
	} //end if

	const areResultsUnique = areUniqueResultsVisible( state, key );
	const activeSegment =
		getPageAttribute( state, 'editor/activeSegment' ) ?? 'default';
	const resultsOfAlternatives =
		activeSegment === 'default'
			? values( results.alternatives )
			: values( results.segments[ activeSegment ]?.alternatives );

	return resultsOfAlternatives.map( ( alternative ) =>
		areResultsUnique
			? alternative.uniqueConversionRates[ gid ] || 0
			: alternative.conversionRates[ gid ] || 0
	);
} //end getConversionRatesOfAlternativesInGoal()

export function getRevenuesOfAlternativesInGoal(
	state: State,
	key: ExperimentId,
	goalId?: GoalId
): Maybe< ReadonlyArray< number > > {
	const results = getExperimentResults( state, key );
	if ( ! results ) {
		return;
	} //end if

	const gid = goalId ?? getDefaultGoal( state, key )?.id ?? '';
	if ( ! gid ) {
		return;
	} //end if

	const areResultsUnique = areUniqueResultsVisible( state, key );
	const activeSegment =
		getPageAttribute( state, 'editor/activeSegment' ) ?? 'default';
	const resultsOfAlternatives =
		activeSegment === 'default'
			? values( results.alternatives )
			: values( results.segments[ activeSegment ]?.alternatives );

	return resultsOfAlternatives.map( ( alternative ) =>
		areResultsUnique
			? alternative.uniqueValues[ gid ] || 0
			: alternative.values[ gid ] || 0
	);
} //end getRevenuesOfAlternativesInGoal()

export function getResultsOfAlternatives(
	state: State,
	key: ExperimentId
): Maybe< Results[ 'alternatives' ] > {
	const results = getExperimentResults( state, key );
	if ( ! results ) {
		return;
	} //end if

	const activeSegment =
		getPageAttribute( state, 'editor/activeSegment' ) ?? 'default';
	return activeSegment === 'default'
		? results.alternatives
		: results.segments[ activeSegment ]?.alternatives;
} //end getResultsOfAlternatives()

export function areUniqueResultsVisible(
	state: State,
	key: ExperimentId
): boolean {
	const shouldShowUniqueResults =
		getPageAttribute( state, 'editor/shouldShowUniqueResults' ) ?? false;
	return shouldShowUniqueResults && areUniqueResultsAvailable( state, key );
} //end areUniqueResultsVisible()

export function areUniqueResultsAvailable(
	state: State,
	key: ExperimentId
): boolean {
	const results = getExperimentResults( state, key );
	return values( results?.alternatives ).some( ( a ) => a.uniqueVisits > 0 );
} //end areUniqueResultsAvailable()
