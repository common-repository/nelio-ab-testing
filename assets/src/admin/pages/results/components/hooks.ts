/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NAB_DATA } from '@nab/data';
import type { Experiment, Maybe } from '@nab/types';

export function useExperimentAttribute< K extends keyof Experiment >(
	attr: K
): Maybe< Experiment[ K ] > {
	const exp = useSelect( ( select ) =>
		select( NAB_DATA ).getPageAttribute( 'editor/activeExperiment' )
	);
	const value = useSelect( ( select ) =>
		!! exp
			? select( NAB_DATA ).getExperimentAttribute( exp, attr )
			: undefined
	);
	return value;
} //end useExperimentAttribute()

export function useAreUniqueResultsVisible(): [
	boolean,
	( visible: boolean ) => void,
] {
	const value = useSelect( ( select ) => {
		const exp = select( NAB_DATA ).getPageAttribute(
			'editor/activeExperiment'
		);
		return exp ? select( NAB_DATA ).areUniqueResultsVisible( exp ) : false;
	} );

	const { setPageAttribute } = useDispatch( NAB_DATA );
	const setValue = ( visible: boolean ) =>
		setPageAttribute( 'editor/shouldShowUniqueResults', visible );

	return [ value, setValue ];
} //end useAreUniqueResultsVisible()

export function useHasUniqueResults(): boolean {
	return useSelect( ( select ) => {
		const exp = select( NAB_DATA ).getPageAttribute(
			'editor/activeExperiment'
		);
		return exp
			? select( NAB_DATA ).areUniqueResultsAvailable( exp )
			: false;
	} );
} //end useHasUniqueResults()
