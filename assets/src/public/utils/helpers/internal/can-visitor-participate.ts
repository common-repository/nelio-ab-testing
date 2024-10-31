/**
 * External dependencies
 */
import type { Maybe } from '@nab/types';

/**
 * Internal dependencies
 */
import { log } from '../log';
import { getCookie, removeCookie, setCookie } from '../../cookies';
import type { Session } from '../../../types';

type ParticipationSettings = Pick<
	Session,
	'excludeBots' | 'gdprCookie' | 'participationChance'
>;

export function canVisitorParticipate(
	settings: Maybe< ParticipationSettings >
): settings is ParticipationSettings {
	if ( ! settings ) {
		log( 'Settings not found' );
		return false;
	} //end if

	if ( isIE() ) {
		return false;
	} //end if

	if ( settings.excludeBots && isBot() ) {
		log( 'Bot detected' );
		return false;
	} //end if

	if ( ! areCookiesEnabled() ) {
		log( 'Cookies not enabled' );
		return false;
	} //end if

	return true;
} //end canVisitorParticipate()

// =======
// HELPERS
// =======

function isBot(): boolean {
	const userAgent = window.navigator?.userAgent;
	return (
		!! userAgent &&
		/bot|spider|crawl|http|lighthouse|meta-externalagent|meta-externalfetcher|facebookexternalhit|facebookcatalog/i.test(
			userAgent
		)
	);
} //end isBot()

function isIE(): boolean {
	const ua = window.navigator.userAgent || '';
	return -1 !== ua.indexOf( 'MSIE ' ) || -1 !== ua.indexOf( 'Trident/' );
} //end isIE()

function areCookiesEnabled() {
	setCookie( 'nabCheckWritePermission', true );
	if ( ! getCookie( 'nabCheckWritePermission' ) ) {
		return false;
	} //end if

	removeCookie( 'nabCheckWritePermission' );
	return true;
} //end areCookiesEnable();
