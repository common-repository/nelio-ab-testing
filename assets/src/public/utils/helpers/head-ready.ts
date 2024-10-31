/**
 * Internal dependencies
 */
import { domReady } from './dom-ready';

type Callback = () => unknown;

let isHeadReady = false;
const pending: Callback[] = [];
export const headReady = ( callback: Callback ): void =>
	isHeadReady ? void callback() : void pending.push( callback );

// =======
// HELPERS
// =======

const markHeadAsReady = () => {
	if ( isHeadReady ) {
		return;
	} //end if
	isHeadReady = true;
	pending.forEach( ( fn ) => fn() );
};

const checkHead = () => {
	if ( isHeadReady ) {
		return;
	} //end if
	if ( document.body !== null ) {
		return markHeadAsReady();
	} //end if
	setTimeout( checkHead, 100 );
};

checkHead();
domReady( markHeadAsReady );
