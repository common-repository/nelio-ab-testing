/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NAB_DATA, usePageAttribute } from '@nab/data';
import type {
	AlternativeIndex,
	Click,
	ConfettiType,
	Experiment,
	HeatmapDataStatus,
	HeatmapMode,
	HeatmapResolution,
	Maybe,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { store as NAB_HEATMAP } from '../store';
import { ProcessedResultsStatus } from '../store/data/config';

export const useActiveExperiment = (): Maybe< Experiment > =>
	useSelect( ( select ) => {
		const { getPageAttribute, getExperiment } = select( NAB_DATA );
		const activeExperiment = getPageAttribute( 'editor/activeExperiment' );
		return getExperiment( activeExperiment ?? 0 );
	} );

export const useActiveAlternative = (): [
	AlternativeIndex,
	( alternative: AlternativeIndex ) => void,
] => [
	useSelect( ( select ) => select( NAB_HEATMAP ).getActiveAlternative() ),
	useDispatch( NAB_HEATMAP ).setActiveAlternative,
];

export const useProgress = (): [ number, ( progress: number ) => void ] => {
	const [ alt ] = useActiveAlternative();
	const { setRawResultProgress } = useDispatch( NAB_HEATMAP );
	return [
		useSelect( ( select ) =>
			select( NAB_HEATMAP ).getRawResultProgress( alt )
		),
		( progress: number ) => setRawResultProgress( alt, progress ),
	];
};

export const useResultsStopper = (): [ boolean, () => void ] => {
	const [ alt ] = useActiveAlternative();
	const [ status ] = useRawResultsStatus();
	const { setRawResultStatus: doSetRawResultStatus } =
		useDispatch( NAB_HEATMAP );
	const setResultStatus = (): undefined => {
		switch ( status.mode ) {
			case 'canceling':
			case 'ready':
			case 'error':
			case 'missing':
				return undefined;
			case 'loading':
			case 'still-loading':
				void doSetRawResultStatus( alt, { mode: 'canceling' } );
				return undefined;
		} //end switch
	};
	return [ status.mode === 'canceling', setResultStatus ];
};

export const useRawResultsStatus = (): [
	HeatmapDataStatus,
	( status: HeatmapDataStatus ) => void,
] => {
	const [ alt ] = useActiveAlternative();
	const { setRawResultStatus } = useDispatch( NAB_HEATMAP );
	return [
		useSelect( ( select ) =>
			select( NAB_HEATMAP ).getRawResultStatus( alt )
		),
		( status: HeatmapDataStatus ) => setRawResultStatus( alt, status ),
	];
};

export const useIsLoadingRawResults = (): boolean => {
	const status = useRawResultsStatus()[ 0 ].mode;
	return status === 'missing' || status === 'loading';
};

export const useRawClicks = (): ReadonlyArray< Click > => {
	const [ alt ] = useActiveAlternative();
	return useSelect( ( select ) => select( NAB_HEATMAP ).getRawClicks( alt ) );
};

export const useProcessedResultsStatus = (): ProcessedResultsStatus => {
	const [ alt ] = useActiveAlternative();
	const [ res ] = useActiveResolution();
	return useSelect( ( select ) =>
		select( NAB_HEATMAP ).getProcessedResultStatus( alt, res )
	);
};

export const useHasProcessedResults = (): boolean => {
	const [ alt ] = useActiveAlternative();
	const [ res ] = useActiveResolution();
	return useSelect( ( select ) =>
		select( NAB_HEATMAP ).hasProcessedResults( alt, res )
	);
};

export const useIsProcessingResults = (): boolean =>
	'processing' === useProcessedResultsStatus();

export const useIsHeatmap = (): boolean =>
	'nab/heatmap' === useActiveExperiment()?.type;

export const useActiveFilter = (): [
	ConfettiType,
	( val: ConfettiType ) => void,
] => {
	const [ _, setDisFilterOpts ] = useDisabledFilterOptions();
	const activeFilter = useSelect( ( select ) =>
		select( NAB_HEATMAP ).getActiveFilter()
	);
	const { setActiveFilter: doSetActiveFilter } = useDispatch( NAB_HEATMAP );

	const setActiveFilter = ( filter: ConfettiType ): void => {
		if ( filter === activeFilter ) {
			return;
		} //end if
		setDisFilterOpts( [] );
		void doSetActiveFilter( filter );
	};

	return [ activeFilter, setActiveFilter ];
};

export const useDisabledFilterOptions = (): [
	ReadonlyArray< string >,
	( val: ReadonlyArray< string > ) => void,
] => [
	useSelect( ( select ) => select( NAB_HEATMAP ).getDisabledFilterOptions() ),
	useDispatch( NAB_HEATMAP ).setDisabledFilterOptions,
];

export const useActiveMode = (): [
	HeatmapMode,
	( val: HeatmapMode ) => void,
] => [
	useSelect( ( select ) => select( NAB_HEATMAP ).getActiveMode() ),
	useDispatch( NAB_HEATMAP ).setActiveMode,
];

export const useSidebarVisibility = (): [
	boolean,
	( visible: boolean ) => void,
] => [
	useSelect( ( select ) => select( NAB_HEATMAP ).isSidebarVisible() ),
	useDispatch( NAB_HEATMAP ).makeSidebarVisible,
];

export const useActiveResolution = (): [
	HeatmapResolution,
	( val: HeatmapResolution ) => void,
] => [
	useSelect( ( select ) => select( NAB_HEATMAP ).getActiveResolution() ),
	useDispatch( NAB_HEATMAP ).setActiveResolution,
];

export const useHeatmapIntensity = (): [ number, ( val: number ) => void ] => [
	useSelect( ( select ) => select( NAB_HEATMAP ).getIntensity() ),
	useDispatch( NAB_HEATMAP ).setIntensity,
];

export const useHeatmapOpacity = (): [ number, ( val: number ) => void ] => [
	useSelect( ( select ) => select( NAB_HEATMAP ).getOpacity() ),
	useDispatch( NAB_HEATMAP ).setOpacity,
];

export const useIsLocked = (): boolean => {
	const [ isLocked ] = usePageAttribute( 'isLocked', false );
	const [ isStopping ] = usePageAttribute(
		'editor/isExperimentBeingStopped',
		false
	);
	const rawStatus = useRawResultsStatus()[ 0 ].mode;
	const processedStatus = useProcessedResultsStatus();
	return (
		isLocked ||
		isStopping ||
		'missing' === rawStatus ||
		'loading' === rawStatus ||
		'missing' === processedStatus ||
		'processing' === processedStatus
	);
};
