/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { sortObjectKeysUsingValue } from './functions';

export const usStates = sortObjectKeysUsingValue( {
	'US-AL': _x( 'Alabama (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-AK': _x( 'Alaska (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-AZ': _x( 'Arizona (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-AR': _x( 'Arkansas (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-CA': _x( 'California (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-CO': _x( 'Colorado (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-CT': _x( 'Connecticut (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-DE': _x( 'Delaware (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-DC': _x( 'District of Columbia (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-FL': _x( 'Florida (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-GA': _x( 'Georgia (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-HI': _x( 'Hawaii (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-ID': _x( 'Idaho (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-IL': _x( 'Illinois (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-IN': _x( 'Indiana (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-IA': _x( 'Iowa (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-KS': _x( 'Kansas (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-KY': _x( 'Kentucky (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-LA': _x( 'Louisiana (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-ME': _x( 'Maine (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-MD': _x( 'Maryland (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-MA': _x( 'Massachusetts (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-MI': _x( 'Michigan (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-MN': _x( 'Minnesota (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-MS': _x( 'Mississippi (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-MO': _x( 'Missouri (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-MT': _x( 'Montana (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-NE': _x( 'Nebraska (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-NV': _x( 'Nevada (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-NH': _x( 'New Hampshire (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-NJ': _x( 'New Jersey (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-NM': _x( 'New Mexico (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-NY': _x( 'New York (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-NC': _x( 'North Carolina (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-ND': _x( 'North Dakota (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-OH': _x( 'Ohio (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-OK': _x( 'Oklahoma (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-OR': _x( 'Oregon (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-PA': _x( 'Pennsylvania (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-PR': _x( 'Puerto Rico (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-RI': _x( 'Rhode Island (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-SC': _x( 'South Carolina (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-SD': _x( 'South Dakota (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-TN': _x( 'Tennessee (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-TX': _x( 'Texas (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-UT': _x( 'Utah (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-VT': _x( 'Vermont (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-VA': _x( 'Virginia (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-WA': _x( 'Washington (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-WV': _x( 'West Virginia (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-WI': _x( 'Wisconsin (U.S.)', 'text', 'nelio-ab-testing' ),
	'US-WY': _x( 'Wyoming (U.S.)', 'text', 'nelio-ab-testing' ),
} );

export function getUSStateName(
	usStateCode: string,
	defaultName?: string
): string {
	const fallback = defaultName ?? _x( 'Unknown', 'text', 'nelio-ab-testing' );
	const aux: Record< string, string > = usStates;
	return aux[ usStateCode ] ?? fallback;
} //end getUSStateName()
