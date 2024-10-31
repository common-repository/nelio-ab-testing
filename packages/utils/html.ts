/**
 * WordPress dependencies
 */
import domReady, { Callback } from '@safe-wordpress/dom-ready';

export function appendSibling(
	newNode: HTMLElement,
	existingNode: HTMLElement
): void {
	if ( existingNode.parentNode ) {
		existingNode.parentNode.insertBefore(
			newNode,
			existingNode.nextSibling
		);
	} //end if
} //end appendSibling()

export function onElementReadyOrDomReadyTops(
	selector: string,
	fn: Callback
): void {
	const checkInterval = 100;
	let availableTime = 2000;

	const check = () => {
		if ( ! availableTime ) {
			domReady( fn );
			return;
		} //end if

		availableTime = Math.max( 0, availableTime - checkInterval );
		if ( ! document.querySelector( selector ) ) {
			setTimeout( check, checkInterval );
			return;
		} //end if

		fn();
	};

	check();
} //end onElementReadyOrDomReadyTops()
