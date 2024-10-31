/**
 * Internal dependencies
 */
import { sendConversions } from './sync';
import { getAllActions, getConvertingGoals } from './utils';
import { domReady } from '../utils/helpers';
import type { ConvertibleAction, Session } from '../types';

export function initConversionTracking( session: Session ): void {
	domReady( () => addActionListeners( session ) );
	domReady( () => sendConvertingPageViews( session ) );
} //end initConversionTracking()

type ActionListener = ( action: ConvertibleAction ) => false | void;
const actionListeners: ActionListener[] = [];
export function addActionTypeListeners( al: ActionListener ): void {
	actionListeners.push( al );
} //end addActionTypeListeners()

// =======
// HELPERS
// =======

function addActionListeners( session: Session ) {
	getAllActions( session.experiments )
		.filter( ( action ) => action.active )
		.filter( ( action ) => 'nab/page-view' !== action.type )
		.forEach( ( action ) =>
			actionListeners.forEach( ( addListeners ) =>
				addListeners( action )
			)
		);
} //end addActionListeners()

function sendConvertingPageViews( session: Session ) {
	const { experiments } = session;

	const events = getConvertingGoals(
		experiments,
		( action ) => action.active && 'nab/page-view' === action.type
	);
	sendConversions( events, session );
} //end sendConvertingPageViews()
