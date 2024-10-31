/**
 * Internal dependencies
 */
import type {
	ConversionAction,
	ConvertibleAction,
	ConvertingGoal,
	GoalSummary,
	Session,
} from '../types';

export function isGdprAccepted( session: Session ): boolean {
	const { gdprCookie } = session;

	if ( ! gdprCookie.name ) {
		return true;
	} //end if

	const matches = ( pattern: string, value: string ) => {
		const parts = pattern.split( '*' );
		return (
			value.startsWith( parts[ 0 ] ?? '' ) &&
			value.endsWith( parts[ parts.length - 1 ] ?? '' ) &&
			0 <=
				pattern
					.split( '*' )
					.reduce(
						( start, search ) =>
							start < 0 ? start : value.indexOf( search, start ),
						0
					)
		);
	};

	return document.cookie
		.split( ';' )
		.map( ( c ) => c.trim() )
		.map( ( c ) => c.split( '=' ) )
		.map( ( [ n, ...v ] ) => [ n, v.join( '=' ) ] )
		.filter(
			( c ): c is [ string, string ] =>
				c[ 0 ] !== undefined && c[ 1 ] !== undefined
		)
		.filter( ( [ n ] ) => matches( gdprCookie.name, n ) )
		.some(
			( [ _, v ] ) => ! gdprCookie.value || matches( gdprCookie.value, v )
		);
} //end isGdprAccepted()

export function getAllActions(
	experiments: Session[ 'experiments' ]
): ReadonlyArray< ConvertibleAction > {
	return experiments.reduce( ( result, experiment ) => {
		experiment?.goals.forEach( ( goal ) => {
			const relevantActions = goal.conversionActions.map(
				( action ) => ( {
					...action,
					experiment: experiment.id,
					alternative: experiment.alternative,
					goal: goal.id,
				} )
			);
			result = [ ...result, ...relevantActions ];
		} );

		return result;
	}, [] as ReadonlyArray< ConvertibleAction > );
} //end getAllActions()

export function getConvertingGoals(
	experiments: Session[ 'experiments' ],
	actionMatcher: ( act: ConversionAction ) => boolean
): ReadonlyArray< ConvertingGoal > {
	return experiments.reduce( ( result, experiment ) => {
		const relevantGoals = experiment.goals.filter( ( goal ) =>
			hasMatchingAction( goal, actionMatcher )
		);
		const eventsFromGoals = relevantGoals?.map( ( goal ) => ( {
			goal: goal.id,
			experiment: experiment.id,
		} ) );

		return eventsFromGoals ? [ ...result, ...eventsFromGoals ] : result;
	}, [] as ReadonlyArray< ConvertingGoal > );
} //end getConvertingGoals()

type Fn = () => void;
const onScrollDownFns: Fn[] = [];
export function onScrollDown( fn: Fn ): void {
	onScrollDownFns.push( fn );
	if ( 1 === onScrollDownFns.length ) {
		let maxScroll = window.scrollY + window.innerHeight;
		document.addEventListener( 'scroll', () => {
			const bottom = window.scrollY + window.innerHeight;
			if ( bottom <= maxScroll ) {
				return;
			} //end if
			maxScroll = bottom;
			onScrollDownFns.forEach( ( f ) => f() );
		} );
	} //end if
} //end onScrollDown()

// =======
// HELPERS
// =======

function hasMatchingAction(
	goal: GoalSummary,
	actionMatcher: ( action: ConversionAction ) => boolean
): boolean {
	return goal.conversionActions.reduce(
		( memo, action ) => memo || actionMatcher( action ),
		false
	);
} //end hasMatchingAction()
