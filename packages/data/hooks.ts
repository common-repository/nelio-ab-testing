/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import type { Experiment } from '@nab/types';

/**
 * Internal dependencies
 */
import { store as NAB_DATA } from './store';
import type { State } from './store/types';

export function useExperimentAttribute< K extends keyof Experiment >(
	attr: K,
	defaultValue: Experiment[ K ]
): Experiment[ K ] {
	return useSelect( ( select ) => {
		const { getPageAttribute, getExperimentAttribute } = select( NAB_DATA );
		const exp = getPageAttribute( 'editor/activeExperiment' );
		return exp
			? getExperimentAttribute( exp, attr ) ?? defaultValue
			: defaultValue;
	} );
} //end useExperimentAttribute()

type PageAttributes = Required< State[ 'page' ] >;
export function usePageAttribute< A extends keyof PageAttributes >(
	attr: A,
	defaultValue: PageAttributes[ A ]
): [ PageAttributes[ A ], ( v: PageAttributes[ A ] ) => void ] {
	const value: PageAttributes[ A ] =
		// TODO. I don’t know how to get this working without the explicit cast.
		useSelect(
			( select ) =>
				select( NAB_DATA ).getPageAttribute(
					attr
				) as PageAttributes[ A ]
		) ?? defaultValue;

	const { setPageAttribute } = useDispatch( NAB_DATA );
	const setValue = ( v: PageAttributes[ A ] ) => setPageAttribute( attr, v );

	return [ value, setValue ];
} // ennd usePageAttribute()

type PluginSettings = State[ 'settings' ][ 'nelio' ];
export function usePluginSetting< A extends keyof PluginSettings >(
	attr: A
): PluginSettings[ A ] {
	return useSelect( ( select ) =>
		select( NAB_DATA ).getPluginSetting( attr )
	);
} // ennd usePageAttribute()

export const useAdminUrl = (
	path: string,
	args: Record< string, string | boolean | number >
): string =>
	useSelect( ( select ) => select( NAB_DATA ).getAdminUrl( path, args ) );
