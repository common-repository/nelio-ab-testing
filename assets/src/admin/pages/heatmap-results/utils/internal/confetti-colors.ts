/**
 * External dependencies
 */
import type { Maybe } from '@nab/types';

const DEFAULT_PALETTE: [ string, ...string[] ] = [
	'#753966',
	'#91628b',
	'#5b52f3',
	'#4a87d5',
	'#42b0ec',
	'#4cc3d9',
	'#59d1b7',
	'#7bc8a4',
	'#bfe656',
	'#ffc65d',
	'#ffb039',
	'#f17b45',
	'#ef4444',
	'#cb0a0a',
];

export function getDefaultColor( i: number ): string {
	return (
		DEFAULT_PALETTE[ i % DEFAULT_PALETTE.length ] || DEFAULT_PALETTE[ 0 ]
	);
} //end getDefaultColor()

export function getConfettiColor( filter: string, value: 'other' ): string;
export function getConfettiColor(
	filter: string,
	value?: string | number
): Maybe< string >;
export function getConfettiColor(
	filter: string,
	value?: string | number
): Maybe< string > {
	if ( 'other' === value ) {
		return '#ec82b6';
	} //end if

	value = `${ value ?? '' }`;
	const num = isNaN( Number.parseInt( value ) )
		? -1
		: Number.parseInt( value );

	switch ( filter ) {
		case 'country':
			return getCountryColor( value );

		case 'device':
			return getDeviceColor( value );

		case 'os':
			return getOsColor( value );

		case 'browser':
			return getBrowserColor( value );

		case 'dayOfWeek':
			return getDayOfWeekColor( num );

		case 'hourOfDay':
			return getHourOfDayColor( num );

		default:
			return getGenericColor( num );
	} //end switch
} //end getConfettiColor()

// =======
// HELPERS
// =======

function getCountryColor( value: string ) {
	const palette: Record< string, string > = {
		AR: '#75aadb',
		AU: '#008000',
		BR: '#2dc52d',
		CA: '#f71818',
		CN: '#ff0000',
		FI: '#2008ff',
		FR: '#0000ff',
		DE: '#b97575',
		GR: '#9292da',
		IS: '#9494c3',
		IN: '#ffa500',
		IT: '#007fff',
		JP: '#e8f48c',
		NL: '#ff7f00',
		NZ: '#993333',
		NO: '#00008b',
		PT: '#218000',
		RU: '#3e3e77',
		ES: '#ff0000',
		GB: '#e64444',
		US: '#ec7777',
	};
	return palette[ value ];
} //end getCountryColor()

function getDeviceColor( value: string ) {
	const palette: Record< string, string > = {
		desktop: '#11a0d2',
		console: '#f17b45',
		mobile: '#ffc65d',
		tablet: '#7bc8a4',
		smarttv: '#93648d',
		wearable: '#4bc0d6',
		embedded: '#ec82b6',
	};
	return palette[ value ];
} //end getDeviceColor()

function getOsColor( value: string ) {
	value = `${ value }`;

	if ( 'Mac OS X' === value ) {
		return '#e6e6e6';
	} //end if

	if ( -1 !== value.indexOf( 'Windows 10' ) ) {
		return '#066b96';
	} //end if

	if ( -1 !== value.indexOf( 'Windows Phone' ) ) {
		return '#097cae';
	} //end if

	if ( -1 !== value.indexOf( 'Windows 7' ) ) {
		return '#0a8bc3';
	} //end if

	if ( -1 !== value.indexOf( 'Windows Vista' ) ) {
		return '#049cde';
	} //end if

	if ( -1 !== value.indexOf( 'Windows XP' ) ) {
		return '#35afe4';
	} //end if

	if ( -1 !== value.indexOf( 'Windows' ) ) {
		return '#67c5ef';
	} //end if

	const others: Record< string, string > = {
		'Chromium OS': '#63c7c5',
		'Mac OS': '#c3c3c3',
		Android: '#97e375',
		Debian: '#ff7185',
		Fuchsia: '#d0608a',
		Linux: '#5e2c80',
		Mint: '#7aaa65',
		SUSE: '#84bc91',
		Ubuntu: '#f28b4a',
		iOS: '#d6d6d6',
	};

	return others[ value ];
} //end getOsColor()

function getBrowserColor( value: string ) {
	const colors: Record< string, string > = {
		'Opera Mini': '#ff6060',
		'Opera Mobi': '#ff9090',
		'Samsung Browser': '#93648d',
		Chrome: '#7bc8a4',
		Chromium: '#6cbc6d',
		Edge: '#024b6e',
		Firefox: '#f28b4a',
		Mozilla: '#f29f79',
		Opera: '#f24a4a',
		Safari: '#ffc65d',
		Vivaldi: '#ef6dd2',
	};
	return colors[ `${ value }` ];
} //end getBrowserColor()

function getDayOfWeekColor( value: number ) {
	const palette: ReadonlyArray< string > = [
		'#ec82b6',
		'#f17b45',
		'#ffc65d',
		'#7bc8a4',
		'#4cc3d9',
		'#4c8ad9',
		'#93648d',
		'#ec82b6',
	];
	return palette[ value ];
} //end getDayOfWeekColor()

function getHourOfDayColor( value: number ) {
	const palette = [
		'#003e6b',
		'#034d71',
		'#066b96',
		'#64c8c6',
		'#dbeabf',
		'#e3e075',
		'#faca5c',
		'#f28b4a',
		'#d1618b',
		'#9a4987',
		'#5e2c80',
		'#15205a',
	];
	return palette[ value ];
} //end getHourOfDayColor()

function getGenericColor( value: number ) {
	const palette = [
		'#cb0a0a',
		'#ef4444',
		'#f17b45',
		'#ffb039',
		'#ffc65d',
		'#bfe656',
		'#7bc8a4',
		'#59d1b7',
		'#4cc3d9',
		'#42b0ec',
		'#4a87d5',
		'#5b52f3',
		'#91628b',
		'#753966',
	];
	return palette[ value ];
} //end getGenericColor()
