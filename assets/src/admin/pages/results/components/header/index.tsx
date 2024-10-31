/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dashicon } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { SubscribeWithCouponButton } from '@nab/components';
import { store as NAB_DATA, usePageAttribute } from '@nab/data';
import { store as NAB_EXPERIMENTS } from '@nab/experiments';

/**
 * Internal dependencies
 */
import './style.scss';
import { useExperimentAttribute } from '../hooks';

export const Header = (): JSX.Element | null => {
	const Icon = useExperimentIcon();
	const name = useExperimentAttribute( 'name' );
	const status = useExperimentAttribute( 'status' );

	if ( ! Icon ) {
		return null;
	} //end if

	return (
		<div className="nab-results-experiment-header">
			<div className="nab-results-experiment-header__info">
				<Icon className="nab-results-experiment-header__experiment-icon" />
				<h1 className="nab-results-experiment-header__title">
					{ name }
				</h1>
				<SubscribeWithCouponButton
					className={
						'finished' === status
							? 'nab-results-experiment-header__right-promo-button'
							: undefined
					}
				/>
			</div>

			{ status === 'running' && (
				<div className="nab-results-experiment-header__settings">
					<PauseButton />
					<StopButton />
				</div>
			) }
		</div>
	);
};

// =======
// HELPERS
// =======

const PauseButton = () => {
	const { pauseExperiment } = useDispatch( NAB_DATA );
	const { canUserPause } = useCapabilities();

	const [ isStopping ] = usePageAttribute(
		'editor/isExperimentBeingStopped',
		false
	);

	const [ isPausing ] = usePageAttribute(
		'editor/isExperimentBeingPaused',
		false
	);

	if ( ! canUserPause ) {
		return null;
	} //end if

	if ( isStopping || isPausing ) {
		return (
			<span className="nab-results-experiment-header__settings--is-saving">
				<Dashicon icon="cloud" />
				{ isPausing
					? _x( 'Pausing…', 'text', 'nelio-ab-testing' )
					: _x( 'Stopping…', 'text', 'nelio-ab-testing' ) }
			</span>
		);
	} //end if

	return (
		<Button
			variant="tertiary"
			className="nab-results-experiment-header__pause-button"
			onClick={ () => void pauseExperiment() }
		>
			{ _x( 'Pause', 'command', 'nelio-ab-testing' ) }
		</Button>
	);
};

const StopButton = () => {
	const { stopExperiment } = useDispatch( NAB_DATA );
	const { canUserStop } = useCapabilities();

	const [ isStopping ] = usePageAttribute(
		'editor/isExperimentBeingStopped',
		false
	);

	const [ isPausing ] = usePageAttribute(
		'editor/isExperimentBeingPaused',
		false
	);

	if ( ! canUserStop ) {
		return null;
	} //end if

	return (
		<Button
			variant="primary"
			className="nab-results-experiment-header__stop-button"
			onClick={ () => void stopExperiment() }
			disabled={ isPausing || isStopping }
		>
			{ _x( 'Stop', 'command', 'nelio-ab-testing' ) }
		</Button>
	);
};

// =====
// HOOKS
// =====

const useExperimentIcon = () => {
	const type = useExperimentAttribute( 'type' );
	const experimentType = useSelect(
		( select ) =>
			select( NAB_EXPERIMENTS ).getExperimentTypes()[ type ?? '' ]
	);
	return experimentType?.icon ?? ( () => <></> );
};

const useCapabilities = () =>
	useSelect( ( select ) => ( {
		canUserPause: select( NAB_DATA ).hasCapability(
			'pause_nab_experiments'
		),
		canUserStop: select( NAB_DATA ).hasCapability( 'stop_nab_experiments' ),
	} ) );
