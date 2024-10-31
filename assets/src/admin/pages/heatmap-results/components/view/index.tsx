/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { select as doSelect, useDispatch } from '@safe-wordpress/data';
import { useEffect } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { BigError, LoadingAnimation } from '@nab/components';
import type {
	AlternativeIndex,
	HeatmapErrorRationale,
	HeatmapFrameAction,
} from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import {
	useActiveAlternative,
	useActiveFilter,
	useActiveMode,
	useActiveResolution,
	useDisabledFilterOptions,
	useHasProcessedResults,
	useHeatmapIntensity,
	useHeatmapOpacity,
	useIsProcessingResults,
	useProcessedResultsStatus,
	useRawResultsStatus,
} from '../hooks';
import { store as NAB_HEATMAP } from '../../store';

export type ViewProps = {
	readonly className: string;
	readonly alternative: AlternativeIndex;
	readonly contentUrl?: string;
};

export const View = ( {
	className,
	alternative,
	contentUrl,
}: ViewProps ): JSX.Element => {
	const [ activeAlternative ] = useActiveAlternative();
	useProcessResultsEffect( alternative );
	useRenderResultsEffect( alternative );
	useOpacityChangeEffect( alternative );
	useIntensityChangeEffect( alternative );

	const [ resolution ] = useActiveResolution();
	const awaitRendererScript = useRendererScriptWaiter( alternative );

	const isHidden = alternative !== activeAlternative;

	return (
		<div className={ className }>
			<FeedbackMessage />
			<iframe
				id={ `nab-heatmap-results__iframe-${ alternative }` }
				className={ classnames( {
					'nab-heatmap-results__iframe': true,
					[ `nab-heatmap-results__iframe--${ resolution }` ]: true,
					'nab-heatmap-results__iframe--is-hidden': isHidden,
				} ) }
				title={ _x(
					'Content of the heatmap',
					'text',
					'nelio-ab-testing'
				) }
				src={ contentUrl }
				onLoad={ () => awaitRendererScript() }
			/>
		</div>
	);
};

// ============
// HELPER VIEWS
// ============

const FeedbackMessage = () => {
	const isProcessingData = useIsProcessingResults();
	const hasProcessedResults = useHasProcessedResults();
	const [ status ] = useRawResultsStatus();

	if (
		status.mode === 'still-loading' ||
		status.mode === 'canceling' ||
		status.mode === 'ready'
	) {
		if ( ! isProcessingData || hasProcessedResults ) {
			return null;
		} //end if

		return (
			<div className="nab-heatmap-results__loader">
				<LoadingAnimation
					text={ _x(
						'Processing results…',
						'text',
						'nelio-ab-testing'
					) }
				/>
			</div>
		);
	} //end if

	if ( 'error' === status.mode ) {
		return (
			<div className="nab-heatmap-results__loader">
				<BigError text={ getErrorMessage( status.rationale ) } />
				{ 'unreachable-servers' === status.rationale && (
					<div className="nab-heatmap-results__adblock-explanation">
						{ _x(
							'If you’re using an adblocker on your browser, please disable it as it’s probably blocking Nelio A/B Testing’s requests, thus preventing the plugin from pulling your heatmap data.',
							'user',
							'nelio-ab-testing'
						) }
					</div>
				) }
			</div>
		);
	} //end if

	return (
		<div className="nab-heatmap-results__loader">
			<LoadingAnimation
				text={
					status.mode === 'loading'
						? _x( 'Fetching results…', 'text', 'nelio-ab-testing' )
						: _x( 'Loading page…', 'text', 'nelio-ab-testing' )
				}
			/>
		</div>
	);
};

// =====
// HOOKS
// =====

const useRendererScriptWaiter = ( alternative: AlternativeIndex ) => {
	const { setIFrameStatus } = useDispatch( NAB_HEATMAP );
	return () =>
		void setTimeout( () => {
			const { getIFrameStatus } = doSelect( NAB_HEATMAP );
			const status = getIFrameStatus( alternative );
			const isWaitingScript = 'waiting-script' === status;
			if ( isWaitingScript ) {
				void setIFrameStatus( alternative, 'script-not-found' );
			} //end if
		}, 30000 );
};

const useProcessResultsEffect = ( alternative: AlternativeIndex ) => {
	const postMessage = usePostMessage( alternative );
	const [ activeAlternative ] = useActiveAlternative();
	const [ mode ] = useActiveMode();
	const status = useProcessedResultsStatus();

	useEffect( () => {
		if ( activeAlternative !== alternative ) {
			return;
		} //end if

		if ( 'outdated' !== status ) {
			return;
		} //end if
		postMessage( {
			plugin: 'nelio-ab-testing',
			type: 'process-results',
			mode,
		} );
	}, [ activeAlternative, alternative, status, mode ] );
};

const useRenderResultsEffect = ( alternative: AlternativeIndex ) => {
	const [ activeAlternative ] = useActiveAlternative();
	const postMessage = usePostMessage( alternative );
	const [ filter ] = useActiveFilter();
	const [ mode ] = useActiveMode();
	const [ resolution ] = useActiveResolution();
	const [ disabledFilterOptions ] = useDisabledFilterOptions();

	const status = useProcessedResultsStatus();

	useEffect( () => {
		if ( activeAlternative !== alternative ) {
			return;
		} //end if

		if ( status !== 'ready' && status !== 'outdated' ) {
			return;
		} //end if

		postMessage( {
			plugin: 'nelio-ab-testing',
			type: 'render-results',
			mode,
		} );
	}, [
		activeAlternative,
		alternative,
		status,
		filter,
		mode,
		resolution,
		JSON.stringify( disabledFilterOptions ),
	] );
};

const useOpacityChangeEffect = ( alternative: AlternativeIndex ) => {
	const postMessage = usePostMessage( alternative );
	const [ mode ] = useActiveMode();
	const [ opacity ] = useHeatmapOpacity();
	const [ activeAlternative ] = useActiveAlternative();
	useEffect( () => {
		if ( activeAlternative !== alternative ) {
			return;
		} //end if

		postMessage( {
			plugin: 'nelio-ab-testing',
			type: 'update-opacity',
			mode,
			value: opacity,
		} );
	}, [ activeAlternative, alternative, mode, opacity ] );
};

const useIntensityChangeEffect = ( alternative: AlternativeIndex ) => {
	const postMessage = usePostMessage( alternative );
	const [ intensity ] = useHeatmapIntensity();
	const [ activeAlternative ] = useActiveAlternative();
	const [ mode ] = useActiveMode();
	useEffect( () => {
		if ( 'heatmap' !== mode ) {
			return;
		} //end if

		if ( activeAlternative !== alternative ) {
			return;
		} //end if

		postMessage( {
			plugin: 'nelio-ab-testing',
			type: 'update-intensity',
			mode,
			value: intensity,
		} );
	}, [ activeAlternative, alternative, intensity, mode ] );
};

const usePostMessage =
	( alternative: AlternativeIndex ) => ( action: HeatmapFrameAction ) => {
		const id = `nab-heatmap-results__iframe-${ alternative }`;
		const iframe = document.getElementById( id ) as HTMLIFrameElement;
		if ( iframe?.contentWindow?.postMessage ) {
			iframe.contentWindow.postMessage( action );
		} //end if
	};

// =======
// HELPERS
// =======

function getErrorMessage( rationale: HeatmapErrorRationale ) {
	switch ( rationale ) {
		case 'no-script':
			return _x( 'Unable to render heatmap', 'text', 'nelio-ab-testing' );

		case 'experiment-not-found':
			return _x( 'Experiment not found', 'text', 'nelio-ab-testing' );

		case 'alternative-not-found':
			return _x( 'Page not found', 'text', 'nelio-ab-testing' );

		case 'unreachable-servers':
			return _x(
				'There was an error while retrieving data from the cloud',
				'text',
				'nelio-ab-testing'
			);

		case 'stuck-empty-results':
			return _x(
				'Heatmap data is currently unavailable',
				'text',
				'nelio-ab-testing'
			);

		case 'unknown':
			return _x( 'Something went wrong', 'text', 'nelio-ab-testing' );
	} //end switch
} //end getErrorMessage()
