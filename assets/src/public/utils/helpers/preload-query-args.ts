/**
 * Internal dependencies
 */
import { domReady } from './dom-ready';
import type { PreloadQueryArgUrl } from '../../types';

export const preloadQueryArgs = (
	config: ReadonlyArray< PreloadQueryArgUrl >
): void =>
	domReady( () => {
		doPreloadQueryArgs( config );
		fixSelfHashUrls();
	} );

// =======
// HELPERS
// =======

export const doPreloadQueryArgs = (
	config: ReadonlyArray< PreloadQueryArgUrl >
): void => {
	if ( ! config.length ) {
		return;
	} //end if

	// eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
	const matches = document.cookie.match( /nabAlternative=[0-9]+/ ) || [ '' ];
	const alt: number = Number.parseInt( matches[ 0 ].split( '=' )[ 1 ] ?? '' );
	if ( isNaN( alt ) ) {
		return;
	} //end if

	const site = document.location.protocol + '//' + document.location.hostname;
	const anchors = Array.from(
		document.querySelectorAll< HTMLAnchorElement >( 'a' )
	)
		.filter( ( a ) => a.href )
		.filter( ( a ) => typeof a.href === 'string' )
		.filter( ( a ) => 0 === a.href.indexOf( site ) )
		.filter( ( a ) => -1 === a.href.indexOf( '#' ) )
		.filter( ( a ) => -1 === a.href.indexOf( '/wp-content/' ) );

	config = [ ...config ].sort( ( x ) => ( x.type === 'alt-urls' ? -1 : 1 ) );
	anchors.forEach( preloadQueryArg( config, alt ) );
};

const fixSelfHashUrls = () => {
	const current = new URL( document.location.href );
	if ( ! /\bnab=/.test( current.search ) ) {
		return;
	} //end if

	current.hash = '';
	current.searchParams.delete( 'nab' );
	Array.from(
		document.querySelectorAll< HTMLAnchorElement >( 'a[href*="#"]' )
	)
		.filter( ( a ) => a.href )
		.filter( ( a ) => typeof a.href === 'string' )
		.filter( ( a ) => a.href.replace( /#.*$/, '' ) === current.href )
		.forEach( ( a ) => {
			a.href = a.href.replace( /^[^#]*#/, '#' );
		} );
};

const preloadQueryArg =
	( config: ReadonlyArray< PreloadQueryArgUrl >, alt: number ) =>
	( a: HTMLAnchorElement ): void => {
		if ( ! a.href || typeof a.href !== 'string' ) {
			return;
		} //end if

		if ( a.href.indexOf( 'nab=' ) !== -1 ) {
			return;
		} //end if

		const scopes = getMatchingScopes( config, a.href );
		if ( ! scopes.length ) {
			return;
		} //end if
		const altCount = Math.max( ...scopes.map( ( s ) => s.altCount ) );
		const nab = alt % altCount;
		const url = getAlternativeUrl( scopes, alt ) || a.href;
		a.href = url.includes( '?' )
			? `${ url }&nab=${ nab }`
			: `${ url }?nab=${ nab }`;
	};

function getMatchingScopes(
	config: ReadonlyArray< PreloadQueryArgUrl >,
	link: string
): ReadonlyArray< PreloadQueryArgUrl > {
	link = link.toLowerCase();
	return config.filter( ( s ) => {
		const scope = s.type === 'alt-urls' ? s.altUrls : s.scope;
		return scope.some( ( l ) =>
			isPartialUrl( l ) ? link.includes( getPart( l ) ) : link === l
		);
	} );
} //end isInScope()

function getAlternativeUrl(
	config: ReadonlyArray< PreloadQueryArgUrl >,
	nab: number
) {
	const scope = config.find( ( s ) => s.type === 'alt-urls' );
	return scope?.type === 'alt-urls'
		? scope.altUrls[ nab % scope.altCount ]
		: undefined;
} //end getAlternativeUrl()

function isPartialUrl( url: string ): boolean {
	return url.startsWith( '*' ) && url.endsWith( '*' );
} //end isPartialUrl()

function getPart( partialUrl: string ): string {
	return partialUrl.substring( 1, partialUrl.length - 1 );
} //end getPart()
