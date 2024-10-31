/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dashicon } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { useRef } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { SubscribeWithCouponButton, Tooltip } from '@nab/components';
import { store as NAB_DATA } from '@nab/data';
import { isInTheFuture } from '@nab/date';
import { store as NAB_EXPERIMENTS } from '@nab/experiments';

/**
 * Internal dependencies
 */
import './style.scss';
import { useExperimentAttribute } from '../hooks';
import { store as NAB_EDITOR } from '../../store';

export const Header = (): JSX.Element => {
	const ref = useRef< HTMLDivElement >( null );

	const Icon = useIcon();
	const startLabel = useStartLabel();

	const draftStatusRationale = useDraftStatusRationale();
	const [ status ] = useExperimentAttribute( 'status' );
	const isDraft = ( status || '' ).includes( 'draft' );
	const isPaused = ( status || '' ).includes( 'paused' );

	const isExperimentBeingSaved = useIsBeingSaved();
	const hasExperimentBeenRecentlySaved = useHasBeenRecentlySaved();

	const start = useStarter();
	const { saveExperiment, setExperimentData } = useDispatch( NAB_EDITOR );
	const saveExperimentAsReady = () => {
		void setExperimentData( { status: isPaused ? 'paused' : 'ready' } );
		void saveExperiment();
	};
	const canUserStart = useCanUserStart();

	return (
		<div ref={ ref } className="nab-edit-experiment-header">
			<div className="nab-edit-experiment-header__info">
				{ Icon && (
					<Icon className="nab-edit-experiment-header__experiment-icon" />
				) }
				<h1 className="nab-edit-experiment-header__title">
					{ _x( 'Edit Test', 'text', 'nelio-ab-testing' ) }
				</h1>
				<SubscribeWithCouponButton
					className={
						'finished' === status
							? 'nab-edit-experiment-header__right-promo-button'
							: undefined
					}
				/>
			</div>
			<div className="nab-edit-experiment-header__settings">
				{ isExperimentBeingSaved && (
					<span className="nab-edit-experiment-header__save-button nab-edit-experiment-header__save-button--is-saving">
						<Dashicon icon="cloud" />
						{ _x( 'Saving…', 'text', 'nelio-ab-testing' ) }
					</span>
				) }

				{ hasExperimentBeenRecentlySaved && 'scheduled' !== status && (
					<span className="nab-edit-experiment-header__save-button nab-edit-experiment-header__save-button--has-been-saved">
						<Dashicon icon="yes" />
						{ _x(
							'Saved',
							'text (experiment)',
							'nelio-ab-testing'
						) }
					</span>
				) }

				{ ! isExperimentBeingSaved &&
					! (
						hasExperimentBeenRecentlySaved && 'scheduled' !== status
					) && (
						<Button
							variant="tertiary"
							className="nab-edit-experiment-header__save-button"
							onClick={
								'scheduled' === status
									? saveExperimentAsReady
									: saveExperiment
							}
						>
							{ 'scheduled' === status
								? _x(
										'Save as Ready',
										'command (experiment)',
										'nelio-ab-testing'
								  )
								: _x( 'Save', 'command', 'nelio-ab-testing' ) }
						</Button>
					) }

				<div className="nab-edit-experiment-header__start-button">
					<Tooltip
						text={ draftStatusRationale }
						placement="left"
						getTooltipContainer={
							!! ref.current
								? () => ref.current as HTMLDivElement
								: undefined
						}
					>
						<span>
							<Button
								variant="primary"
								disabled={
									isDraft ||
									isExperimentBeingSaved ||
									! canUserStart ||
									( hasExperimentBeenRecentlySaved &&
										'scheduled' === status )
								}
								onClick={ start }
							>
								{ startLabel }
							</Button>
						</span>
					</Tooltip>
				</div>
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useCanUserStart = () => {
	const [ status ] = useExperimentAttribute( 'status' );
	const isPaused = ( status || '' ).includes( 'paused' );
	return useSelect( ( select ) => {
		const { hasCapability } = select( NAB_DATA );
		return hasCapability(
			isPaused ? 'resume_nab_experiments' : 'start_nab_experiments'
		);
	} );
};

const useStartLabel = () => {
	const [ startDate ] = useExperimentAttribute( 'startDate' );
	const [ status ] = useExperimentAttribute( 'status' );
	const isPaused = ( status || '' ).includes( 'paused' );

	if ( isPaused ) {
		return _x( 'Resume…', 'command', 'nelio-ab-testing' );
	} //end if

	if ( startDate && isInTheFuture( startDate ) ) {
		return 'scheduled' === status
			? _x( 'Schedule', 'command', 'nelio-ab-testing' )
			: _x( 'Schedule…', 'command', 'nelio-ab-testing' );
	} //end if

	return _x( 'Start…', 'command', 'nelio-ab-testing' );
};

const useIcon = () =>
	useSelect( ( select ) => {
		const { getExperimentTypes } = select( NAB_EXPERIMENTS );
		const { getExperimentType } = select( NAB_EDITOR );

		const experimentTypes = getExperimentTypes();
		const typeName = getExperimentType();
		return experimentTypes[ typeName ]?.icon;
	} );

const useDraftStatusRationale = () =>
	useSelect( ( select ) => select( NAB_EDITOR ).getDraftStatusRationale() );

const useIsBeingSaved = () =>
	useSelect( ( select ) => select( NAB_EDITOR ).isExperimentBeingSaved() );

const useHasBeenRecentlySaved = () =>
	useSelect( ( select ) =>
		select( NAB_EDITOR ).hasExperimentBeenRecentlySaved()
	);

const useStarter = () => {
	const [ status ] = useExperimentAttribute( 'status' );
	const [ startDate ] = useExperimentAttribute( 'startDate' );
	const isPaused = ( status || '' ).includes( 'paused' );

	const {
		resumeExperiment,
		setExperimentData,
		saveExperiment,
		startExperiment,
	} = useDispatch( NAB_EDITOR );

	return () => {
		if ( isPaused ) {
			void resumeExperiment();
		} else if ( startDate && isInTheFuture( startDate ) ) {
			void setExperimentData( { status: 'scheduled' } );
			void saveExperiment();
		} else {
			void startExperiment();
		} //end if
	};
};
