/**
 * External dependencies
 */
import { chunk, map, padStart, split } from 'lodash';

export function numberFormat( num: number, options = {} ): string {
	options = {
		maximumFractionDigits: 2,
		...options,
	};
	const locale = hasI18n( window )
		? window.nabI18n.locale || 'en-US'
		: 'en-US';
	return Intl.NumberFormat( locale, options ).format( num );
} //end numberFormat()

type MoneyFormatOptions = {
	readonly decimalSeparator: string;
	readonly thousandsSeparator: string;
	readonly numberOfDecimals: number;
};
export function moneyFormat(
	value: number,
	options: Partial< MoneyFormatOptions >
): string {
	const decimalSeparator = options.decimalSeparator ?? '.';
	const thousandsSeparator = options.thousandsSeparator ?? ',';
	const numberOfDecimals = options.numberOfDecimals ?? 2;

	const whole = Math.floor( value );
	const factor = 10 ** numberOfDecimals;
	const cents = padStart(
		`${ Math.round( value * factor ) - whole * factor }`,
		numberOfDecimals,
		'0'
	);

	const dollars = map( chunk( split( `${ whole }` ), 3 ), ( x ) =>
		x.join( '' )
	).join( thousandsSeparator );

	return ! numberOfDecimals
		? dollars
		: `${ dollars }${ decimalSeparator }${ cents }`;
} //end moneyFormat()

export function compactInteger( num: number ): string {
	if ( num < 1000 ) {
		return `${ num }`;
	} //end if

	if ( num < 1_000_000 ) {
		return numberFormat( num / 1000, { maximumFractionDigits: 1 } ) + 'k';
	} //end if

	return numberFormat( num / 1_000_000, { maximumFractionDigits: 1 } ) + 'M';
} //end compactInteger()

// =======
// HELPERS
// =======

// eslint-ignore-next-line camelcase
const hasI18n = ( x: unknown ): x is { nabI18n: { locale: string } } =>
	!! x && 'object' === typeof x && 'nabI18n' in x;
