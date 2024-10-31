/**
 * External dependencies
 */
import 'es6-symbol';
import type { Dict, ExperimentId } from '@nab/types';

/**
 * Internal dependencies
 */
import { initConversionTracking } from './conversions';
import { initHeatmapTracking } from './heatmaps';
import { initDefaultListeners } from './listeners';
import { sendConversions, sendViews } from './sync';
import { isGdprAccepted } from './utils';
import {
	domReady,
	getActiveExperiments,
	logIf,
	logOnce,
} from '../utils/helpers';
import { cleanOldSegments } from '../utils/segmentation';
import type { ConvertingGoal, GoalIndex, Session } from '../types';
import { addCookieListener, removeCookieListener } from '../utils/cookies';

let isTrackingEnabled = false;
let pendingEvents: ReadonlyArray< PendingEvent > = [];

let isContentReady = false;
let pendingCallbacks: ReadonlyArray< () => void > = [];

export function exportTrackingApi(): void {
	const nab = initExports( 'awaiting-session' );
	( window as unknown as Dict ).nab = nab;
} //end exportTrackingApi()

export function markContentAsReady(): void {
	isContentReady = true;
	pendingCallbacks.forEach( ( callback ) => callback() );
	pendingCallbacks = [];
} //end markContentAsReady()

export function maybeStartTracking(
	session: Session,
	trackViews: boolean
): void {
	let wasGdprMissing = false;
	const id = addCookieListener( () => {
		if ( ! isGdprAccepted( session ) ) {
			wasGdprMissing = true;
			logOnce( 'Awaiting GDPR cookie…' );
			const nab = initExports( 'awaiting-gdpr' );
			( window as unknown as Dict ).nab = nab;
			return;
		} //end if
		logIf( wasGdprMissing, 'GDPR ready!' );
		removeCookieListener( id );
		startTracking( session, trackViews );
	} );
} //end maybeStartTracking()

// ========
// INTERNAL
// ========

function startTracking( session: Session, trackViews: boolean ) {
	domReady( () => {
		const experimentIds = session.experiments.map( ( e ) => e.id );
		cleanOldSegments( experimentIds );

		const nab = initExports( session );
		( window as unknown as Dict ).nab = nab;
		enableTracking( session );

		if ( trackViews ) {
			trackHeaderViews( session );
			trackFooterViews( session );
		} //end if

		initDefaultListeners( convert( session ) );
		initConversionTracking( session );
		initHeatmapTracking( session );
	} );
} //end startTracking()

type PendingEvent =
	| {
			readonly type: 'view';
			readonly experimentIds:
				| ExperimentId
				| ReadonlyArray< ExperimentId >;
	  }
	| {
			readonly type: 'trigger';
			readonly eventName: string;
	  }
	| {
			readonly type: 'convert';
			readonly experiment: ExperimentId | ReadonlyArray< ConvertingGoal >;
			readonly goal?: GoalIndex;
	  };

const initExports = (
	session: Session | 'awaiting-session' | 'awaiting-gdpr'
) => ( {
	view: ( experimentIds: unknown ): void => {
		if (
			! isExperimentId( experimentIds ) &&
			! isExperimentIdArray( experimentIds )
		) {
			throw new Error(
				'Invalid Argument Type. Positive integer or array of positive integers expected.'
			);
		} //end if

		if (
			! isTrackingEnabled ||
			session === 'awaiting-session' ||
			session === 'awaiting-gdpr'
		) {
			pendingEvents = [
				...pendingEvents,
				{ type: 'view', experimentIds },
			];
			return;
		} //end if
		view( session )( experimentIds );
	},

	trigger: ( eventName: unknown ): void => {
		if ( 'string' !== typeof eventName ) {
			throw new Error( 'Invalid Argument Type. String expected.' );
		} //end if

		if ( session === 'awaiting-gdpr' ) {
			return;
		} //end if

		if ( ! isTrackingEnabled || session === 'awaiting-session' ) {
			pendingEvents = [
				...pendingEvents,
				{ type: 'trigger', eventName },
			];
			return;
		} //end if
		trigger( session )( eventName );
	},

	convert: ( experiment: unknown, goal: unknown = 0 ): void => {
		if ( ! isExperimentId( experiment ) ) {
			throw new Error(
				'Invalid Argument Type. Positive integer expected.'
			);
		} //end if

		if ( ! isNonNegativeInteger( goal ) ) {
			throw new Error(
				'Invalid Argument Type. Non-negative integer expected.'
			);
		} //end if

		if ( session === 'awaiting-gdpr' ) {
			return;
		} //end if

		if ( ! isTrackingEnabled || session === 'awaiting-session' ) {
			pendingEvents = [
				...pendingEvents,
				{ type: 'convert', experiment, goal },
			];
			return;
		} //end if
		convert( session )( experiment, goal );
	},

	session: () => session,

	ready: ( callback: unknown ) => {
		if ( ! isFunction( callback ) ) {
			throw new Error( 'Invalid Argument Type. Function expected.' );
		} //end if

		if ( ! isContentReady ) {
			pendingCallbacks = [ ...pendingCallbacks, callback ];
			return;
		} //end if
		callback();
	},
} );

const view =
	( session: Session ) =>
	( expIds: ExperimentId | ReadonlyArray< ExperimentId > ) => {
		const experimentIds = Array.isArray( expIds ) ? expIds : [ expIds ];
		if ( ! experimentIds.length ) {
			return;
		} //end if

		sendViews( experimentIds, session );
	};

const trigger = ( session: Session ) => ( eventName: string ) => {
	const { experiments } = session;
	const events = experiments.reduce( ( memo, experiment ) => {
		experiment.goals.forEach( ( goal, index ) => {
			const hasCustomEventAction = goal.conversionActions.reduce(
				( found, { type, attributes = {} } ) =>
					found ||
					( 'nab/custom-event' === type &&
						eventName === attributes.eventName ),
				false
			);
			if ( hasCustomEventAction ) {
				memo = [ ...memo, { experiment: experiment.id, goal: index } ];
			} //end if
		} );
		return memo;
	}, [] as ReadonlyArray< ConvertingGoal > );

	sendConversions( events, session );
};

const convert =
	( session: Session ) =>
	(
		experiment: ExperimentId | ReadonlyArray< ConvertingGoal >,
		goal?: GoalIndex
	) => {
		let events: ReadonlyArray< ConvertingGoal > = [];
		if ( isExperimentId( experiment ) ) {
			if ( undefined !== goal ) {
				events = [ { experiment, goal } ];
			} //end if
		} else {
			events = experiment;
		} //end if

		sendConversions(
			events.map( ( ev ) => ( {
				experiment: ev.experiment,
				goal: ev.goal,
			} ) ),
			session
		);
	};

const enableTracking = ( session: Session ) => {
	isTrackingEnabled = true;
	pendingEvents.forEach( ( ev ) => {
		if ( ev.type === 'view' ) {
			view( session )( ev.experimentIds );
		} else if ( ev.type === 'trigger' ) {
			trigger( session )( ev.eventName );
		} else {
			convert( session )( ev.experiment, ev.goal );
		} //end if
	} );
	pendingEvents = [];
};

const trackHeaderViews = ( session: Session ): void => {
	view( session )(
		getActiveExperiments( session )
			.filter( ( e ) => e.pageViewTracking === 'header' )
			.map( ( e ) => e.id )
	);

	view( session )( session.heatmaps.map( ( e ) => e.id ) );
};

const trackFooterViews = ( session: Session ): void => {
	const footerIds = getFooterViews();
	view( session )( footerIds );
};

const getFooterViews = (): ReadonlyArray< ExperimentId > =>
	( ( window as unknown as Dict )
		.nabFooterViews as ReadonlyArray< ExperimentId > ) || [];

const isFunction = ( f: unknown ): f is () => void => 'function' === typeof f;

const isExperimentId = ( n: unknown ): n is ExperimentId =>
	isNonNegativeInteger( n ) && n > 0;

const isExperimentIdArray = ( a: unknown ): a is ExperimentId[] =>
	Array.isArray( a ) && a.every( isExperimentId );

const isNonNegativeInteger = ( n: unknown ): n is number =>
	'number' === typeof n && n >= 0 && Math.round( n ) === n;
