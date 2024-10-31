/**
 * Internal dependencies
 */
import { getDocumentHeight } from './utils';
import { domReady } from '../../../../public/utils/helpers';

const SCROLL_STEP_IN_PX = 1000;

let _isPageReady = false;
export const isPageReady = (): boolean => _isPageReady;

let prq: ( () => void )[] = [];
export const onPageReady = ( cb: () => void ): void =>
	void ( isPageReady() ? cb() : prq.push( cb ) );

let _once = false;
export const loadAssets = (): void => {
	if ( _once ) {
		return;
	} //end if
	_once = true;
	domReady( () => void doLoadPage() );
};

// =======
// HELPERS
// =======

async function doLoadPage() {
	fetchLazyLoadImages();
	await scanPage();
	await wait( 2000 );
	markPageAsLoaded();
} //end doLoadPage()

function fetchLazyLoadImages(): void {
	const images = Array.from(
		document.querySelectorAll< HTMLElement >( 'img[data-src]' )
	).reverse();
	images.forEach( ( img ) => {
		const src = img.getAttribute( 'data-src' );
		if ( src ) {
			img.setAttribute( 'src', src );
		} //end if
	} );
} //end fetchLazyLoadImages()

async function scanPage(): Promise< void > {
	const height = getDocumentHeight();

	for ( let i = SCROLL_STEP_IN_PX; i < height; i += SCROLL_STEP_IN_PX ) {
		window.scrollTo( 0, i );
		await wait( 100 );
	} //end for

	window.scrollTo( 0, 0 );
} //end scanPage()

function wait( ms: number ): Promise< void > {
	return new Promise( ( resolve ) => setTimeout( resolve, ms ) );
} //end wait()

function markPageAsLoaded(): void {
	_isPageReady = true;
	prq.forEach( ( f ) => f() );
	prq = [];
} //end markPageAsLoaded();
