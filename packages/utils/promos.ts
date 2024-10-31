/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';
import { addQueryArgs } from '@safe-wordpress/url';

/**
 * External dependencies
 */
import { find } from 'lodash';
import { format, getDate } from '@nab/date';

/**
 * Internal dependencies
 */
import { addFreeTracker } from './links';

type Promo = {
	readonly id: string;
	readonly predicate: ( today: string ) => boolean;
	readonly couponCode: string;
	readonly label: string;
};

export function hasSubscriptionPromo( today: string ): boolean {
	return !! today && !! getPromo( today );
} //end hasSubscriptionPromo()

export function getSubscribeLabel( today: string ): string {
	const promo = getPromo( today );
	const label = promo?.label;
	return label || _x( 'Subscribe', 'command', 'nelio-ab-testing' );
} //end getSubscribeLabel()

export function getSubscribeLink( today: string ): string {
	const promo = getPromo( today );
	const coupon = promo?.couponCode;
	return addFreeTracker(
		addQueryArgs(
			_x(
				'https://neliosoftware.com/testing/pricing/',
				'text',
				'nelio-ab-testing'
			),
			{ coupon }
		)
	);
} //end getSubscribeLink()

// =========
//  HELPERS
// =========

const PROMOS: ReadonlyArray< Promo > = [
	{
		id: 'black-friday',
		predicate: ( today ) => {
			const currentYear = today.substring( 0, 4 );
			const thanksgiving = getThanksGivingDate( currentYear );
			const start = addDays( thanksgiving, -4 );
			const end = addDays( thanksgiving, 2 );
			return start <= today && today <= end;
		},
		couponCode: 'BLACKFRIDAYNELIO',
		label: _x( 'Black Friday Deal', 'command', 'nelio-ab-testing' ),
	},
	{
		id: 'cyber-monday',
		predicate: ( today ) => {
			const currentYear = today.substring( 0, 4 );
			const thanksgiving = getThanksGivingDate( currentYear );
			const cybermonday = addDays( thanksgiving, 3 );
			return cybermonday === today;
		},
		couponCode: 'BLACKFRIDAYNELIO',
		label: _x( 'Cyber Monday Deal', 'command', 'nelio-ab-testing' ),
	},
];

const getPromo = ( today = '' ) =>
	find( PROMOS, ( promo ) => promo.predicate( today ) );

const getThanksGivingDate = ( year: string ) => {
	const weekday = Number.parseInt( format( 'N', `${ year }-11-28` ) );
	const offset = weekday < 4 ? weekday + 3 : weekday - 4;
	return `${ year }-11-${ 28 - offset }`;
};

const addDays = ( date: string, days: number ) => {
	const d = getDate( `${ date }T10:00:00.000Z` );
	d.setDate( d.getDate() + days );
	return format( 'Y-m-d', d );
};
