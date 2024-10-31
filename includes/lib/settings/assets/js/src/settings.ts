/**
 * External dependencies
 */
import queryString from 'qs';

const hasHead = < T >( arr: T[] ): arr is [ T, ...T[] ] => !! arr.length;

function addTabNameToUrl( url: string, tabName: string ): string {
	if ( ! tabName ) {
		return url.replace( /.?\btab=[^&]+/, '' );
	} //end if

	if ( /\btab=/.test( url ) ) {
		url = url.replace( /\btab=[^&]+/, 'tab=' + tabName );
	} else if ( 0 < url.indexOf( '?' ) ) {
		url += '&tab=' + tabName;
	} else {
		url = '?tab=' + tabName;
	} //end if

	return url;
} //end addTabNameToUrl()

// Fix help buttons.
Array.from(
	document.querySelectorAll< HTMLElement >( 'img.nelio-ab-testing-help' )
).forEach( ( help ) => {
	const explanation =
		help.parentElement?.parentElement?.querySelector< HTMLElement >(
			'div.setting-help'
		);
	if ( ! explanation ) {
		return;
	} //end if
	help.addEventListener( 'click', ( ev ) => {
		ev.preventDefault();
		if ( 'block' !== explanation.style.display ) {
			explanation.style.display = 'block';
		} else {
			explanation.style.display = 'none';
		} //end if
	} );
} );

// Beautify checkboxes that are close together.
Array.from(
	document.querySelectorAll< HTMLElement >( '.form-table tr' )
).forEach( ( row ) => {
	const name = ( row.querySelector( 'td, th' )?.textContent ?? '' ).replace(
		/\s+/g,
		''
	);
	if ( ! name ) {
		Array.from( row.children )
			.filter( ( el ): el is HTMLElement => 'style' in el )
			.forEach( ( el ) => {
				el.style.paddingTop = '0';
			} );
	} //end if
} );

// Tab management.
const tabs = Array.from(
	document.querySelectorAll< HTMLElement >( '.nav-tab' )
);
if ( hasHead( tabs ) ) {
	tabs.forEach( ( tab ) => tab.classList.remove( 'nav-tab-active' ) );

	const tabContents = Array.from(
		document.querySelectorAll< HTMLElement >( '.tab-content' )
	);
	tabContents.forEach( ( content ) => {
		content.style.display = 'none';
	} );

	// Get the current tab.
	const urlParams = queryString.parse(
		( window.location.search || '' ).replace( /^\?/, '' ) // phpcs:ignore
	);
	let currentTabId: string = urlParams.tab as string;
	if ( ! document.getElementById( currentTabId ) ) {
		currentTabId = tabs[ 0 ].id;
	} //end if

	const currentTab = document.getElementById( currentTabId );

	// Select the current tab.
	currentTab?.classList.add( 'nav-tab-active' );
	const tabContent = document.getElementById(
		`${ currentTabId }-tab-content`
	);
	if ( tabContent ) {
		tabContent.style.display = 'block';
	} //end if

	// Set the current tab name, no matter what.
	const url = addTabNameToUrl( window.location.href, currentTabId ); // phpcs:ignore
	tabs.forEach( ( tab ) =>
		tab.setAttribute( 'href', addTabNameToUrl( url, tab.id ) )
	);
	window.history.replaceState( {}, '', url );
} //end if
