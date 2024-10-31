/**
 * WordPress dependencies
 */
import type {
	select as _select,
	dispatch as _dispatch,
} from '@safe-wordpress/data';
type Select = typeof _select;
type Dispatch = typeof _dispatch;

/**
 * Internal dependencies
 */
import './style.scss';
import {
	getCssSelector,
	highlightCssSelector,
	highlightHoveredElement,
} from './highlighter';

// NOTE. No @nab packages in front.
import type { store as dataStore } from '@nab/data';
const NAB_DATA = 'nab/data' as unknown as typeof dataStore;

function init() {
	if ( ! hasWordPressData( window.parent ) ) {
		console.error( 'Parent window doesn’t have expected API. Bye!' ); // eslint-disable-line
		return;
	} //end if

	window.addEventListener( 'message', reactToParentMessages, false );
	updateParentWithThisUrl();
} //end init()

type Message = {
	readonly data?:
		| { readonly type: 'explore' }
		| { readonly type: 'highlight'; readonly value: string };
};

function reactToParentMessages( message: Message ): void {
	if ( 'explore' === message.data?.type ) {
		document.addEventListener( 'mouseover', highlightHoveredElement );
		document.addEventListener(
			'click',
			( ev ) => {
				ev.preventDefault();
				const el = ev.target;
				if ( ! el ) {
					return;
				} //end if
				dispatchCssSelectorForHoveredElement( el as HTMLElement );
			},
			{ once: true }
		);
	} else {
		document.removeEventListener( 'mouseover', highlightHoveredElement );
	} //end if

	if ( 'highlight' === message.data?.type ) {
		highlightCssSelector( message.data.value, true );
	} //end if
} //end reactToParentMessages()

function dispatchCssSelectorForHoveredElement( element: HTMLElement ): void {
	if ( ! hasWordPressData( window.parent ) ) {
		return;
	} //end if

	const { select, dispatch } = window.parent.wp.data;
	const state = select( NAB_DATA ).getPageAttribute(
		'css-selector/cssSelectorFinderState'
	);
	if ( undefined === state ) {
		return;
	} //end if

	void dispatch( NAB_DATA ).setPageAttribute(
		'css-selector/cssSelectorFinderState',
		{
			...state,
			mode: 'css',
			isExploring: false,
			value: getCssSelector( element ).replace(
				'.nab-disabled-link',
				''
			),
		}
	);
} //end dispatchCssSelectorForHoveredElement()

function updateParentWithThisUrl() {
	if ( ! hasWordPressData( window.parent ) ) {
		return;
	} //end if

	const { select, dispatch } = window.parent.wp.data;
	const state = select( NAB_DATA ).getPageAttribute(
		'css-selector/cssSelectorFinderState'
	);
	if ( undefined === state ) {
		return;
	} //end if

	void dispatch( NAB_DATA ).setPageAttribute(
		'css-selector/cssSelectorFinderState',
		{
			...state,
			currentUrl: window.location.href, // phpcs:ignore
		}
	);
} //endupdateParentWithThisUrl()

type WordPressData = {
	readonly wp: {
		readonly data: {
			readonly select: Select;
			readonly dispatch: Dispatch;
		};
	};
};

function hasWordPressData( win: unknown ): win is WordPressData {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
	return !! ( win as any ).wp.data;
} //end hasWordPressData()

init();
