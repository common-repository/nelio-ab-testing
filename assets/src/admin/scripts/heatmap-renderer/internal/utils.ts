/**
 * Internal dependencies
 */
import { getDocumentHeight as _getDocumentHeight } from '../../../../public/utils/helpers/get-document-height';

const MAX_DESKTOP_HEIGHT = 100_000;

export const getDocumentHeight = (): number => {
	const pairs = Array.from(
		document.querySelectorAll( '.nab-overlay-element' )
	)
		.map( ( el ) => [ el.parentElement, el ] )
		.filter(
			( pair ): pair is [ HTMLElement, HTMLElement ] => !! pair[ 0 ]
		);

	pairs.forEach( ( [ p, c ] ) => p.removeChild( c ) );
	const height = Math.min( _getDocumentHeight(), MAX_DESKTOP_HEIGHT );
	pairs.forEach( ( [ p, c ] ) => p.appendChild( c ) );
	return height;
};

export function createOverlayElement< T extends HTMLElement = HTMLElement >(
	type: string
): T {
	const el = document.createElement( type );
	el.className = 'nab-overlay-element';
	el.style.position = 'absolute';
	el.style.left = '0px';
	el.style.top = '0px';
	el.style.zIndex = '999999';
	maximizeElement( el );

	return el as T;
} //end createOverlayElement()

export function maximizeElement( el: HTMLElement ): void {
	const width = document.body.clientWidth;
	const height = getDocumentHeight();

	el.style.width = `${ width }px`;
	el.style.height = `${ height }px`;

	if ( isHTMLCanvas( el ) ) {
		el.width = width;
		el.height = height;
	} //end if
} //end maximizeElement()

const isHTMLCanvas = ( el: HTMLElement ): el is HTMLCanvasElement =>
	'canvas' === el.nodeName.toLowerCase();
