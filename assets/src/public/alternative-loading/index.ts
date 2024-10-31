/**
 * Internal dependencies
 */
import { applyAutoInlineExperiments } from './apply-auto-inline-experiments';
import { headReady, flow, log, preloadQueryArgs } from '../utils/helpers';
import { areSegmentsValid } from '../utils/segmentation';
import {
	addQueryArgs,
	getQueryArg,
	getQueryArgs,
	removeArgsAndHash,
	removeQueryArgs,
	removeTestingArgs,
} from '../utils/url';
import type { ActiveExperiment, Session } from '../types';

export async function loadAlternative( session: Session ): Promise< boolean > {
	if ( false === session.cookieTesting && ! areSegmentsValid( session ) ) {
		log( 'Invalid segmentation' );
		await loadUntestedControl();
		return false;
	} //end if

	if ( wasCookieTestingUpdated( session ) ) {
		await refresh( session );
		return false;
	} //end if

	const targetUrl = getExpectedAlternativeUrl( session );
	await loadPage( session, targetUrl );
	await applyAutoInlineExperiments( session.experiments );
	removeOverlay();
	return true;
} //end loadAlternative()

export const loadUntestedControl = (): Promise< void > =>
	new Promise( ( resolve ) => {
		const url = document.location.href;
		const args = getQueryArgs( url );
		if ( args.nab === undefined ) {
			removeOverlay();
			return resolve();
		} //end if
		document.location.href = removeTestingArgs( url );
	} );

// =======
// HELPERS
// =======

function wasCookieTestingUpdated( session: Session ) {
	return (
		session.cookieTesting !== false &&
		'nabforce' in getQueryArgs( session.currentUrl )
	);
} //end wasCookieTestingUpdated()

function getExpectedAlternativeUrl( session: Session ): string {
	if ( session.numOfAlternatives <= 1 ) {
		return session.untestedUrl;
	} //end if

	const urls = session.alternativeUrls;
	const nab = session.alternative % session.numOfAlternatives;
	if ( urls.length <= 1 ) {
		return addQueryArgs( session.untestedUrl, { nab } );
	} //end if

	// @ts-expect-error “urls” is not empty and the index is always within range.
	const expectedAlternativeUrl: string = urls[ nab % urls.length ];
	return flow(
		( url ) => addMissingArguments( url, session.referrerParam ),
		( url ) => maybeAddHash( url ),
		( url ) => addQueryArgs( url, { nab } )
	)( expectedAlternativeUrl );
} //end getExpectedAlternativeUrl()

const loadPage = ( session: Session, targetUrl: string ): Promise< void > =>
	new Promise( ( resolve ) => {
		const validateCurrentUrl = () => {
			cleanTestingQueryArgs( session );
			preloadQueryArgs( session.preloadQueryArgUrls );
			resolve();
		};

		if ( session.isTestedPostRequest ) {
			updateUrl( targetUrl );
			return validateCurrentUrl();
		} //end if

		if ( areUrlsEqual( session, targetUrl, session.currentUrl ) ) {
			return validateCurrentUrl();
		} //end if

		if ( isTargetUrlCompletelyDifferent( session, targetUrl ) ) {
			// Don’t resolve -- just wait for the redirection to complete.
			redirect( session, targetUrl );
			return;
		} //end if

		if ( isCurrentUrlJustMissingNab( session, targetUrl ) ) {
			updateUrl( targetUrl );
			return validateCurrentUrl();
		} //end if

		if ( doesCurrentUrlHaveCompatibleNab( session, targetUrl ) ) {
			updateUrl( targetUrl );
			return validateCurrentUrl();
		} //end if

		if ( isAlternativeRequestNoLongerValid( session ) ) {
			stayWithNoTestingArgs();
			return validateCurrentUrl();
		} //end if

		// Don’t resolve -- just wait for the redirection to complete.
		redirect( session, targetUrl );
	} );

const refresh = ( session: Session ) =>
	new Promise< void >( () => redirect( session, session.untestedUrl ) );

function redirect( session: Session, targetUrl: string ) {
	if ( false !== session.cookieTesting ) {
		targetUrl = removeQueryArgs( targetUrl, 'nab' );
	} //end if

	headReady(
		() =>
			document.querySelector( 'html' )?.classList.add( 'nab-redirecting' )
	);

	if ( ! document.location.replace ) {
		document.location.href = targetUrl;
		return;
	} //end if
	document.location.replace( targetUrl );
} //end redirect()

const removeOverlay = () => {
	const overlay = document.getElementById( 'nelio-ab-testing-overlay' );
	if ( overlay ) {
		overlay.parentNode?.removeChild( overlay );
	} else {
		headReady( () => document.body.classList.add( 'nab-done' ) );
	} //end if
};

function updateUrl( url: string ) {
	try {
		window.history.replaceState( {}, '', url );
	} catch ( _ ) {} //end try
} //end updateUrl()

function stayWithNoTestingArgs() {
	cleanTestingQueryArgs( { hideQueryArgs: true } );
} //end stayWithNoTestingArgs()

function isTargetUrlCompletelyDifferent(
	session: Session,
	targetUrl: string
): boolean {
	const cleanCurrentUrl = session.untestedUrl;
	const cleanTargetUrl = removeTestingArgs( targetUrl );
	return cleanCurrentUrl !== cleanTargetUrl;
} //end isTargetUrlCompletelyDifferent()

function isCurrentUrlJustMissingNab( session: Session, targetUrl: string ) {
	const { currentUrl } = session;
	const isNabAlreadyThere = undefined !== getQueryArg( currentUrl, 'nab' );
	const isNabExpected = undefined !== getQueryArg( targetUrl, 'nab' );
	if ( isNabAlreadyThere || ! isNabExpected ) {
		return false;
	} //end if

	if ( false !== session.cookieTesting ) {
		return true;
	} //end if

	const areAllExperimentsInline = session.experiments
		.filter( ( e ): e is ActiveExperiment => e.active )
		.every( ( e ) => !! e.inline );
	return areAllExperimentsInline;
} //end isCurrentUrlJustMissingNab()

function doesCurrentUrlHaveCompatibleNab(
	session: Session,
	targetUrl: string
) {
	if ( session.maxCombinations <= 1 ) {
		return false;
	} //end if

	const actualNab = Number.parseInt(
		getQueryArg( session.currentUrl, 'nab' ) ?? ''
	);
	if ( isNaN( actualNab ) ) {
		return false;
	} //end if

	const expectedNab = Number.parseInt(
		getQueryArg( targetUrl, 'nab' ) ?? ''
	);
	if ( isNaN( expectedNab ) ) {
		return false;
	} //end if

	const actual = actualNab % session.numOfAlternatives;
	const expected = expectedNab % session.numOfAlternatives;
	return actual === expected;
} //end doesCurrentUrlHaveCompatibleNab()

function isAlternativeRequestNoLongerValid( session: Session ) {
	const actualNab = getQueryArg( document.location.search, 'nab' );
	const isAlternativeRequest = undefined !== actualNab;
	return 0 === session.numOfAlternatives && isAlternativeRequest;
} //end isAlternativeRequestNoLongerValid()

function getReferrer( referrerParam: string ) {
	const query = document.location.search.replace( /^\?/, '' );
	const params = query.split( '&' ).reduce(
		( memo, param ) => {
			const [ name = '', ...value ] = param.split( '=' );
			memo[ name ] = value.join( '=' );
			return memo;
		},
		{} as Record< string, string >
	);

	const referrerValue = params[ referrerParam ];
	if ( referrerValue ) {
		return decodeURIComponent( referrerValue );
	} //end if

	const referrer = document.referrer;
	const currentUrl = document.location.href;
	if ( isSameDomain( currentUrl, referrer ) ) {
		return false;
	} //end if

	return referrer;
} //end getReferrer()

function isSameDomain( oneUrl = '', anotherUrl = '' ) {
	const clean = ( x: string ) =>
		x.replace( /^https?:\/\//, '' ).replace( /\/.*$/, '' );
	return clean( oneUrl ) === clean( anotherUrl );
} //end isSameDomain()

function cleanTestingQueryArgs( session: Pick< Session, 'hideQueryArgs' > ) {
	const url = removeTestingArgs(
		document.location.href,
		! session.hideQueryArgs && 'keep-nab'
	);
	try {
		window.history.replaceState( {}, '', url );
	} catch ( _ ) {} //end try
} //end cleanTestingQueryArgs()

function areUrlsEqual( session: Session, oneUrl = '', anotherUrl = '' ) {
	let oneCleanUrl = removeArgsAndHash( oneUrl );
	let anotherCleanUrl = removeArgsAndHash( anotherUrl );

	if ( session.ignoreTrailingSlash ) {
		oneCleanUrl = `${ oneCleanUrl }/`.replace( /\/\/$/, '/' );
		anotherCleanUrl = `${ anotherCleanUrl }/`.replace( /\/\/$/, '/' );
	} //end if

	if ( oneCleanUrl !== anotherCleanUrl ) {
		return false;
	} //end if

	const oneArgs = getQueryArgs( oneUrl );
	const anotherArgs = getQueryArgs( anotherUrl );

	const oneArgKeys = Object.keys( oneArgs );
	const anotherArgKeys = Object.keys( anotherArgs );
	if ( oneArgKeys.length !== anotherArgKeys.length ) {
		return false;
	} //end if

	for ( const key of oneArgKeys ) {
		if ( ! anotherArgKeys.includes( key ) ) {
			return false;
		} //end if
	} //end for

	for ( const key of oneArgKeys ) {
		if ( oneArgs[ key ] !== anotherArgs[ key ] ) {
			return false;
		} //end if
	} //end if

	return true;
} //end areUrlsEqual()

function addMissingArguments( url: string, referrerParam: string ) {
	const expectedArguments = getQueryArgs( url );
	const currentArguments = getQueryArgs( document.location.search );

	delete currentArguments.nab;
	delete currentArguments.nabforce;

	url = addQueryArgs( url, {
		...currentArguments,
		...expectedArguments,
	} );

	if ( ! referrerParam ) {
		return url;
	} //end if

	let referrer = getReferrer( referrerParam );
	if ( ! referrer ) {
		return url;
	} //end if

	referrer = removeQueryArgs( referrer, referrerParam );
	return addQueryArgs( url, { [ referrerParam ]: referrer } );
} //end addMissingArguments()

function maybeAddHash( url: string ) {
	if ( -1 !== url.indexOf( '#' ) ) {
		return url;
	} //end if

	return url + document.location.hash;
} //end maybeAddHash()
