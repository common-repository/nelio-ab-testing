/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { keyBy, orderBy } from 'lodash';
import type { Click, ConfettiOption, ConfettiType, Dict } from '@nab/types';

/**
 * Internal dependencies
 */
import { getConfettiColor, getDefaultColor } from './internal/confetti-colors';

export function getConfettiFilterOptions(
	clicks: ReadonlyArray< Click >
): Record< ConfettiType, Dict< ConfettiOption > > {
	const resultsSummary: Record< ConfettiType, Dict< number > > = {
		country: {},
		device: {},
		os: {},
		browser: {},
		dayOfWeek: {},
		hourOfDay: {},
		timeToClick: {},
		windowWidth: {},
	};

	clicks.forEach( ( click ) => {
		resultsSummary.country[ click.country ] =
			( resultsSummary.country[ click.country ] || 0 ) + click.intensity;
		resultsSummary.device[ click.device ] =
			( resultsSummary.device[ click.device ] || 0 ) + click.intensity;
		resultsSummary.os[ click.os ] =
			( resultsSummary.os[ click.os ] || 0 ) + click.intensity;
		resultsSummary.browser[ click.browser ] =
			( resultsSummary.browser[ click.browser ] || 0 ) + click.intensity;
		resultsSummary.dayOfWeek[ click.dayOfWeek ] =
			( resultsSummary.dayOfWeek[ click.dayOfWeek ] || 0 ) +
			click.intensity;
		resultsSummary.hourOfDay[ click.hourOfDay ] =
			( resultsSummary.hourOfDay[ click.hourOfDay ] || 0 ) +
			click.intensity;
		resultsSummary.timeToClick[ click.timeToClick ] =
			( resultsSummary.timeToClick[ click.timeToClick ] || 0 ) +
			click.intensity;
		resultsSummary.windowWidth[ click.windowWidth ] =
			( resultsSummary.windowWidth[ click.windowWidth ] || 0 ) +
			click.intensity;
	} );

	const keys = Object.keys( resultsSummary ) as ReadonlyArray< ConfettiType >;
	return keys.reduce(
		( memo, key ) => ( {
			...memo,
			[ key ]: processFilter( key, resultsSummary[ key ] ),
		} ),
		{} as Record< ConfettiType, Dict< ConfettiOption > >
	);
} //end getFilterOptions()

function processFilter(
	filter: ConfettiType,
	filterOptions: Dict< number >
): Dict< ConfettiOption > {
	switch ( filter ) {
		case 'country':
			return getFilterOptionsForDiscreteFilter( filter, filterOptions );

		case 'device':
			return getFilterOptionsForDiscreteFilter( filter, filterOptions );

		case 'os':
			return sortOsOptions(
				getFilterOptionsForDiscreteFilter( filter, filterOptions )
			);

		case 'browser': {
			return sortBrowserOptions(
				getFilterOptionsForDiscreteFilter( filter, filterOptions )
			);
		}

		case 'dayOfWeek':
		case 'hourOfDay':
		case 'timeToClick':
		case 'windowWidth':
			return getFilterOptionsForContinuousFilter( filter, filterOptions );
	} //end switch
} //end processFilterOption()

function getFilterOptionsForDiscreteFilter(
	filter: ConfettiType,
	filterOptions: Dict< number >
) {
	const orderedOptions = orderBy(
		Object.keys( filterOptions ).map( ( key ) => ( {
			key,
			value: filterOptions[ key ] ?? 0,
		} ) ),
		'value',
		'desc'
	);

	let relevantOptions = orderedOptions.splice( 0, 14 );
	relevantOptions = orderBy( relevantOptions, 'key' );

	if ( orderedOptions.length ) {
		relevantOptions.push( {
			key: 'other',
			value: orderedOptions.reduce(
				( total, { value } ) => total + ( value ?? 0 ),
				0
			),
		} );
	} //end if

	let defaultColor = -1;
	return keyBy(
		relevantOptions.map(
			( { key, value } ): ConfettiOption => ( {
				key,
				label: getLabelOfDiscreteFilterOption( filter, key ),
				value,
				color:
					getConfettiColor( filter, key ) ||
					getDefaultColor( ++defaultColor ),
			} )
		),
		'key'
	);
} //end getFilterOptionsForDiscreteFilter()

function getLabelOfDiscreteFilterOption(
	filter: ConfettiType,
	filterOptionKey: string
) {
	if ( 'other' === filterOptionKey ) {
		return _x( 'Other', 'text', 'nelio-ab-testing' );
	} //end if

	switch ( filter ) {
		case 'device':
			return (
				( filterOptionKey[ 0 ]?.toUpperCase() ?? '' ) +
				filterOptionKey.slice( 1 )
			);

		case 'country':
		case 'os':
		case 'browser':
		default:
			return filterOptionKey;
	} //end switch
} //end getLabelOfDiscreteFilterOption()

function getFilterOptionsForContinuousFilter(
	filter: 'dayOfWeek' | 'hourOfDay' | 'timeToClick' | 'windowWidth',
	filterOptions: Dict< number >
) {
	const filterCategories = {
		dayOfWeek: [
			{ label: _x( 'Sunday', 'text', 'nelio-ab-testing' ) },
			{ label: _x( 'Monday', 'text', 'nelio-ab-testing' ) },
			{ label: _x( 'Tuesday', 'text', 'nelio-ab-testing' ) },
			{ label: _x( 'Wednesday', 'text', 'nelio-ab-testing' ) },
			{ label: _x( 'Thursday', 'text', 'nelio-ab-testing' ) },
			{ label: _x( 'Friday', 'text', 'nelio-ab-testing' ) },
			{ label: _x( 'Saturday', 'text', 'nelio-ab-testing' ) },
		],
		hourOfDay: [
			{ label: _x( '12a – 2a', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '2a – 4a', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '4a – 6a', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '6a – 8a', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '8a – 10a', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '10a – 12p', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '12p – 2p', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '2p – 4p', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '4p – 6p', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '6p – 8p', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '8p – 10p', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '10p – 12a', 'text', 'nelio-ab-testing' ) },
		],
		timeToClick: [
			{ label: _x( '0 – 2s', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '2 – 3s', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '3 – 4s', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '4 – 5s', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '5 – 10s', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '10 – 15s', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '15 – 20s', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '20 – 25s', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '25 – 30s', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '30 – 60s', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '1 – 2min', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '2 – 3min', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '3 – 5min', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '+5min', 'text', 'nelio-ab-testing' ) },
		],
		windowWidth: [
			{ label: _x( '< 300 px', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '300 – 600px', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '600 – 900px', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '900 – 1200px', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '1200 – 1500px', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '1500 – 1800px', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '1800 – 2100px', 'text', 'nelio-ab-testing' ) },
			{ label: _x( '+2100px', 'text', 'nelio-ab-testing' ) },
		],
	};

	const categoriesOfFilter = filterCategories[ filter ].map(
		( { label }, index ) => ( {
			key: `${ index }`,
			label,
			value: filterOptions[ index ] || 0,
			color: '',
		} )
	);

	let defaultColor = -1;
	return keyBy(
		categoriesOfFilter.map(
			( category ): ConfettiOption => ( {
				...category,
				color:
					getConfettiColor( filter, category.key ) ||
					getDefaultColor( ++defaultColor ),
			} )
		),
		'key'
	);
} //end getFilterOptionsForContinuousFilter()

function sortOsOptions( options: Dict< ConfettiOption > ) {
	const windows: Dict< string > = {
		'Windows 10': 'Windows 01',
		'Windows Phone': 'Windows 02',
		'Windows 7': 'Windows 03',
		'Windows Vista': 'Windows 04',
		'Windows XP': 'Windows 05',
		'Windows 98': 'Windows 06',
		'Windows 95': 'Windows 07',
		Windows: 'Windows 08',
	};

	let aux = Object.values( options ).map( ( { key, ...option } ) => ( {
		key,
		...option,
		sorting: windows[ key ] ? windows[ key ] : key,
	} ) );
	aux = orderBy( aux, 'sorting' );

	const sortedOptions = aux.map( ( opt ) => ( {
		key: opt.key,
		color: opt.color,
		value: opt.value,
		label: opt.label,
	} ) );

	return keyBy( sortedOptions, 'key' );
} //end sortOsOptions()

function sortBrowserOptions( options: Dict< ConfettiOption > ) {
	const sortedOptions = orderBy( Object.values( options ), 'key' );
	return keyBy( sortedOptions, 'key' );
} //end sortBrowserOptions()
