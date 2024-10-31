/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useEffect } from '@safe-wordpress/element';
import { useSelect, useDispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NAB_DATA } from '@nab/data';
import type {
	AlternativeIndex,
	ExperimentId,
	ExperimentTypeName,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { StatusManager } from '../status-manager';
import { store as NAB_HEATMAP } from '../../store';
import { useActiveAlternative, useActiveExperiment } from '../hooks';

export type ResultsProviderProps = {
	readonly experimentId: ExperimentId;
	readonly experimentType: ExperimentTypeName;
	readonly isPublicView: boolean;
	readonly isReadOnlyActive: boolean;
	readonly alternativeIndex: number;
	readonly firstDayOfWeek: number;
	readonly children: JSX.Element | JSX.Element[];
};

export const ResultsProvider = (
	props: ResultsProviderProps
): JSX.Element | null => {
	const { experimentId } = props;
	const experiment = useSelect( ( select ) =>
		select( NAB_DATA ).getExperiment( experimentId )
	);
	const alternative = useSelect( ( select ) =>
		select( NAB_HEATMAP ).getActiveAlternative()
	);
	useInitEffect( props );
	useResultLoader( experimentId, alternative );
	useResultProcessor();

	if ( ! experiment ) {
		return null;
	} //end if

	const { children } = props;
	return (
		<div>
			<StatusManager />
			{ children }
		</div>
	);
};

// =====
// HOOKS
// =====

const useInitEffect = ( props: ResultsProviderProps ) => {
	const { setPageAttribute } = useDispatch( NAB_DATA );
	const { setActiveAlternative, setFirstDayOfWeek } =
		useDispatch( NAB_HEATMAP );
	useSelect( ( select ) =>
		select( NAB_DATA ).getExperimentResults( props.experimentId )
	);
	useEffect( () => {
		const {
			experimentId,
			experimentType,
			alternativeIndex,
			firstDayOfWeek,
			isPublicView,
			isReadOnlyActive,
		} = props;

		void setPageAttribute( 'editor/activeExperiment', experimentId );
		void setPageAttribute( 'editor/activeExperimentType', experimentType );
		void setPageAttribute( 'editor/isPublicView', isPublicView );
		void setPageAttribute( 'editor/isReadOnlyActive', isReadOnlyActive );
		void setActiveAlternative( alternativeIndex );
		void setFirstDayOfWeek( firstDayOfWeek % 7 );
	}, [] );
};

const useResultLoader = (
	experimentId: ExperimentId,
	alternative: AlternativeIndex
) => {
	const experiment = useSelect( ( select ) =>
		select( NAB_DATA ).getExperiment( experimentId )
	);
	const isExperimentLoading = useSelect(
		( select ) =>
			! select( NAB_DATA ).hasFinishedResolution( 'getExperiment', [
				experimentId,
			] ) &&
			! select( NAB_DATA ).hasResolutionFailed( 'getExperiment', [
				experimentId,
			] )
	);
	const { loadResults, setRawResultStatus } = useDispatch( NAB_HEATMAP );

	useEffect( () => {
		if ( isExperimentLoading ) {
			return;
		} //end if
		if ( experiment ) {
			void loadResults( experiment, alternative );
		} else {
			void setRawResultStatus( alternative, {
				mode: 'error',
				rationale: 'experiment-not-found',
			} );
		} //end if
	}, [ experiment, alternative, isExperimentLoading ] );
};

const useResultProcessor = () => {
	const { requestResultProcessing } = useDispatch( NAB_HEATMAP );
	const experiment = useActiveExperiment();
	const [ alternative ] = useActiveAlternative();
	const resolution = useSelect( ( select ) =>
		select( NAB_HEATMAP ).getActiveResolution()
	);
	const { clicks, scrolls, processedStatus, rawStatus } = useSelect(
		( select ) => ( {
			mode: select( NAB_HEATMAP ).getActiveMode(),
			clicks: select( NAB_HEATMAP ).getRawClicks( alternative ),
			scrolls: select( NAB_HEATMAP ).getRawScrolls( alternative ),
			processedStatus: select( NAB_HEATMAP ).getProcessedResultStatus(
				alternative,
				resolution
			),
			rawStatus:
				select( NAB_HEATMAP ).getRawResultStatus( alternative )?.mode,
		} )
	);

	useEffect( () => {
		if ( ! experiment ) {
			return;
		} //end if

		if (
			rawStatus === 'missing' ||
			rawStatus === 'loading' ||
			rawStatus === 'error'
		) {
			return;
		} //end if

		if ( processedStatus === 'ready' || processedStatus === 'processing' ) {
			return;
		} //end if

		void requestResultProcessing( alternative, resolution );
	}, [
		experiment,
		alternative,
		resolution,
		clicks,
		scrolls,
		processedStatus,
		rawStatus,
	] );
};
