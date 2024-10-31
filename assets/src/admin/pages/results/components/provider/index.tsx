/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { useEffect } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { store as NAB_DATA } from '@nab/data';
import type { ExperimentId } from '@nab/types';

export type ResultsProviderProps = {
	readonly experimentId: ExperimentId;
	readonly isPublicView: boolean;
	readonly isReadOnlyActive: boolean;
	readonly children: JSX.Element | JSX.Element[];
};

export const ResultsProvider = ( {
	experimentId,
	isPublicView,
	isReadOnlyActive,
	children,
}: ResultsProviderProps ): JSX.Element | null => {
	const isReady = useIsReady( experimentId );
	useLoadEffect( experimentId, isPublicView, isReadOnlyActive );
	return isReady ? <>{ children }</> : null;
};

// =====
// HOOKS
// =====

const useIsReady = ( experimentId: ExperimentId ) => {
	const isLoaded = useIsLoaded( experimentId );
	const activeExperiment = useSelect( ( select ) =>
		select( NAB_DATA ).getPageAttribute( 'editor/activeExperiment' )
	);
	return isLoaded && activeExperiment === experimentId;
};

const useIsLoaded = ( experimentId: ExperimentId ) =>
	useSelect( ( select ) =>
		select( NAB_DATA ).hasFinishedResolution( 'getExperiment', [
			experimentId,
		] )
	);

const useLoadEffect = (
	experimentId: ExperimentId,
	isPublicView: boolean,
	isReadOnlyActive: boolean
) => {
	const isLoaded = useIsLoaded( experimentId );
	const { setPageAttribute } = useDispatch( NAB_DATA );

	useSelect( ( select ) => {
		select( NAB_DATA ).getExperiment( experimentId );
		select( NAB_DATA ).getExperimentResults( experimentId );
	} );

	useEffect( () => {
		if ( ! isLoaded ) {
			return;
		} //end if
		void setPageAttribute( 'editor/activeExperiment', experimentId );
		void setPageAttribute( 'editor/isPublicView', isPublicView );
		void setPageAttribute( 'editor/isReadOnlyActive', isReadOnlyActive );
	}, [ isLoaded ] );
};
