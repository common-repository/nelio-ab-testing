/**
 * WordPress dependencies
 */
import { dispatch, select, subscribe } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { keyBy, find } from 'lodash';
import { getDate, format, date as formatDate } from '@nab/date';
import { getValue, setValue } from '@nab/utils';
import type {
	AlternativeId,
	AlternativeTrackingData,
	CloudAlternativeResults,
	CloudDayResults,
	CloudResults,
	CloudSegmentResults,
	DayResults,
	Goal,
	Experiment,
	Results,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { store } from './index';
import type { State } from './types';

export function syncPageAttributeWithLocalStore<
	Attr extends keyof State[ 'page' ],
>( attr: Attr, defaultValue: State[ 'page' ][ Attr ] ): void {
	void dispatch( store ).setPageAttribute(
		attr,
		getValue( attr, defaultValue )
	);
	let prevValue = select( store ).getPageAttribute( attr ) ?? defaultValue;
	subscribe( () => {
		const value = select( store ).getPageAttribute( attr ) ?? defaultValue;
		if ( value === prevValue ) {
			return;
		} //end if
		prevValue = value;
		setValue( attr, value );
	}, store );
} //end syncPageAttributeWithLocalStore()

export function differenceInDays(
	d1: string | Date,
	d2: string | Date
): number {
	if ( 'string' === typeof d1 ) {
		d1 = new Date( d1 );
	} //end if

	if ( 'string' === typeof d2 ) {
		d2 = new Date( d2 );
	} //end if

	const now = new Date();
	if ( ! d1 || isNaN( d1.getTime() ) ) {
		d1 = now;
	} //end if

	if ( ! d2 || isNaN( d2.getTime() ) ) {
		d2 = now;
	} //end if

	const diffTime = Math.abs( d2.getTime() - d1.getTime() );
	return Math.ceil( diffTime / ( 1000 * 60 * 60 * 24 ) );
} //end differenceInDays()

export function processResult(
	data: CloudResults,
	experiment: Experiment
): Results {
	return {
		winners: extractWinnersInfo( data.results || {}, experiment.goals ),
		wasEnoughData: extractWhetherThereWasEnoughData(
			data.results || {},
			experiment.goals
		),
		alternatives: extractAlternativesInfo( data, experiment ),
		segments: processResultOfSegments( data, experiment ),
		...( data.uniqueResults && {
			winnersUnique: extractWinnersInfo(
				data.uniqueResults || {},
				experiment.goals
			),
			wasEnoughDataUnique: extractWhetherThereWasEnoughData(
				data.uniqueResults || {},
				experiment.goals
			),
		} ),
	};
} //end processResult

function processResultOfSegments(
	data: CloudResults,
	experiment: Experiment
): Results[ 'segments' ] {
	const { segments } = experiment;
	const EMPTY_SEGMENT_RESULTS = { results: {} };

	return keyBy(
		segments.map( ( segment, index ) => ( {
			winners: extractWinnersInfo(
				data.segments?.[ `s${ index + 1 }` ]?.results || {},
				experiment.goals
			),
			wasEnoughData: extractWhetherThereWasEnoughData(
				data.segments?.[ `s${ index + 1 }` ]?.results || {},
				experiment.goals
			),
			alternatives: extractAlternativesInfo(
				data.segments?.[ `s${ index + 1 }` ] || EMPTY_SEGMENT_RESULTS,
				experiment
			),
			...( data.segments?.[ `s${ index + 1 }` ]?.uniqueResults && {
				winnersUnique: extractWinnersInfo(
					data.segments?.[ `s${ index + 1 }` ]?.uniqueResults || {},
					experiment.goals
				),
				wasEnoughDataUnique: extractWhetherThereWasEnoughData(
					data.segments?.[ `s${ index + 1 }` ]?.uniqueResults || {},
					experiment.goals
				),
			} ),
			id: segment.id,
		} ) ),
		'id'
	);
} //end processResultOfSegments()

function extractWinnersInfo(
	results: CloudSegmentResults[ 'results' ],
	goals: ReadonlyArray< Goal >
): Results[ 'winners' ] {
	const winners: Results[ 'winners' ] = {};
	const numberOfGoals = goals.length;

	for ( let i = 0; i < numberOfGoals; ++i ) {
		const goal = goals[ i ];
		if ( ! goal ) {
			continue;
		} //end if
		const goalId = goal.id;
		const data = results[ `g${ i }` ] || false;

		if ( data && 'win' === data.status ) {
			winners[ goalId ] = {
				alternative: data.winner,
				confidence: data.confidence,
			};
		} //end if
	} //end for

	return winners;
} //end extractWinnersInfo()

function extractWhetherThereWasEnoughData(
	results: CloudSegmentResults[ 'results' ],
	goals: ReadonlyArray< Goal >
): Results[ 'wasEnoughData' ] {
	const enoughData: Results[ 'wasEnoughData' ] = {};
	const numberOfGoals = goals.length;

	for ( let i = 0; i < numberOfGoals; ++i ) {
		const goal = goals[ i ];
		if ( ! goal ) {
			continue;
		} //end if
		const goalId = goal.id;
		const data = results[ `g${ i }` ];
		enoughData[ goalId ] = 'low-data' !== data?.status;
	} //end for

	return enoughData;
} //end extractWhetherThereWasEnoughData()

function extractAlternativesInfo(
	data: CloudSegmentResults,
	experiment: Experiment
): Results[ 'alternatives' ] {
	const { alternatives } = experiment;
	const endDate =
		'finished' === experiment.status
			? getDate( experiment.endDate || '' )
			: new Date();
	const formattedEndDate = formatDate( 'Y-m-d', endDate );

	return {
		control: setAlternativeTrackingData( {}, 'control', '', '', [] ),
		...keyBy(
			alternatives.map( ( alternative, index ) =>
				setAlternativeTrackingData(
					data[ `a${ index }` ] || {},
					alternative.id,
					experiment.startDate,
					formattedEndDate,
					experiment.goals
				)
			),
			'id'
		),
	};
} //end extractAlternativesInfo()

function setAlternativeTrackingData(
	data: CloudAlternativeResults,
	id: AlternativeId,
	startDate: string,
	endDate: string,
	goals: ReadonlyArray< Goal >
): AlternativeTrackingData {
	return {
		id,
		visits: data.v || 0,
		values: fixConversionValues( data.cv, goals ),
		conversions: fixConversionCounts( data.c, goals ),
		conversionRates: fixConversionRates( data.cr, goals ),
		improvementFactors: fixImprovementFactors( data.i, goals ),

		uniqueVisits: data.uv || 0,
		uniqueValues: fixConversionValues( data.ucv, goals ),
		uniqueConversions: fixConversionCounts( data.uc, goals ),
		uniqueConversionRates: fixConversionRates( data.ucr, goals ),
		uniqueImprovementFactors: fixImprovementFactors( data.ui, goals ),

		timeline: fixTimelineData( data.t, startDate, endDate, goals ),
	};
} //end setAlternativeTrackingData()

function fixConversionValues(
	values: CloudAlternativeResults[ 'cv' ],
	goals: ReadonlyArray< Goal >
): AlternativeTrackingData[ 'conversions' ] {
	const result: AlternativeTrackingData[ 'conversions' ] = {};
	const numberOfGoals = goals.length;

	for ( let i = 0; i < numberOfGoals; ++i ) {
		const goal = goals[ i ];
		if ( ! goal ) {
			continue;
		} //end if
		const goalId = goal.id;
		result[ goalId ] = values?.[ `g${ i }` ] || 0;
	} //end for

	return result;
} //end fixConversionValues()

function fixConversionCounts(
	conversions: CloudAlternativeResults[ 'c' ],
	goals: ReadonlyArray< Goal >
): AlternativeTrackingData[ 'conversions' ] {
	const result: AlternativeTrackingData[ 'conversions' ] = {};
	const numberOfGoals = goals.length;

	for ( let i = 0; i < numberOfGoals; ++i ) {
		const goal = goals[ i ];
		if ( ! goal ) {
			continue;
		} //end if
		const goalId = goal.id;
		result[ goalId ] = conversions?.[ `g${ i }` ] || 0;
	} //end for

	return result;
} //end fixConversionCounts()

function fixConversionRates(
	conversionRates: CloudAlternativeResults[ 'cr' ],
	goals: ReadonlyArray< Goal >
): AlternativeTrackingData[ 'conversionRates' ] {
	const result: AlternativeTrackingData[ 'conversionRates' ] = {};
	const numberOfGoals = goals.length;

	for ( let i = 0; i < numberOfGoals; ++i ) {
		const goal = goals[ i ];
		if ( ! goal ) {
			continue;
		} //end if
		const goalId = goal.id;
		const cr = conversionRates?.[ `g${ i }` ] || 0;
		result[ goalId ] = Math.round( cr * 100 ) / 100 || 0;
	} //end for

	return result;
} //end fixConversionRates()

function fixImprovementFactors(
	improvementFactors: CloudAlternativeResults[ 'i' ],
	goals: ReadonlyArray< Goal >
): AlternativeTrackingData[ 'improvementFactors' ] {
	const result: AlternativeTrackingData[ 'improvementFactors' ] = {};
	const numberOfGoals = goals.length;

	for ( let i = 0; i < numberOfGoals; ++i ) {
		const goal = goals[ i ];
		if ( ! goal ) {
			continue;
		} //end if
		const goalId = goal.id;
		const factor = improvementFactors?.[ `g${ i }` ] || 0;
		result[ goalId ] = Math.round( factor * 100 ) / 100 || 0;
	} //end for

	return result;
} //end fixImprovementFactors()

function fixTimelineData(
	timeline: CloudAlternativeResults[ 't' ],
	startDate: string,
	endDate: string,
	goals: ReadonlyArray< Goal >
): AlternativeTrackingData[ 'timeline' ] {
	const result: DayResults[] = [];
	const day = getDate( startDate );
	let dayLabel;

	do {
		dayLabel = format( 'Y-m-d', day );
		const cloudDayResults = findDayResults( timeline, dayLabel );
		const dayResults = fixDayResults( cloudDayResults, goals );
		result.push( dayResults );
		day.setDate( day.getDate() + 1 );
	} while ( endDate > dayLabel );

	return result;
} //end fixTimelineData()

function findDayResults(
	timeline: CloudAlternativeResults[ 't' ],
	date: string
): CloudDayResults {
	const result = find( timeline, { d: date } ) || {};
	// TODO. Don’t know why I need the cast :-(
	return { v: 0, ...result, d: date } as CloudDayResults;
} //end findDayResults()

function fixDayResults(
	data: CloudDayResults,
	goals: ReadonlyArray< Goal >
): DayResults {
	const result: DayResults = {
		visits: data.v || 0,
		date: data.d,
		conversions: {},
		values: {},
		uniqueVisits: data.uv || 0,
		uniqueConversions: {},
		uniqueValues: {},
	};

	const numberOfGoals = goals.length;
	for ( let i = 0; i < numberOfGoals; ++i ) {
		const goal = goals[ i ];
		if ( ! goal ) {
			continue;
		} //end if
		const goalId = goal.id;
		result.conversions[ goalId ] = data[ `g${ i }` ] || 0;
		result.values[ goalId ] = data[ `val${ i }` ] || 0;
		result.uniqueConversions[ goalId ] = data[ `ug${ i }` ] || 0;
		result.uniqueValues[ goalId ] = data[ `uval${ i }` ] || 0;
	} //end for

	return result;
} //end fixDayResults()
