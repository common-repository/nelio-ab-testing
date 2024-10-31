/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PanelRow } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { DateTimePicker } from '@nab/components';
import { formatI18nDatetime } from '@nab/date';

/**
 * Internal dependencies
 */
import { useExperimentAttribute, useIsSubscribedTo } from '../../../hooks';

export const ExperimentStartSchedule = (): JSX.Element => {
	const [ startDate, setStartDate ] = useExperimentAttribute( 'startDate' );
	const canBeScheduled = useIsSubscribedTo( 'professional' );
	const isPaused = useIsPaused();

	return (
		<PanelRow className="nab-experiment-start-schedule">
			<span>{ _x( 'Start', 'text', 'nelio-ab-testing' ) }</span>
			<span>
				{ !! isPaused && (
					<span className="nab-experiment-start-schedule__date">
						{ formatI18nDatetime( startDate ) }
					</span>
				) }

				{ ! isPaused && ! canBeScheduled && (
					<span className="nab-experiment-start-schedule__date">
						{ _x( 'Immediately', 'text', 'nelio-ab-testing' ) }
					</span>
				) }

				{ ! isPaused && !! canBeScheduled && (
					<DateTimePicker
						className="nab-experiment-start-schedule__date"
						date={ startDate }
						onChange={ ( v ) => setStartDate( v || '' ) }
						noDateLabel={ _x(
							'Immediately',
							'text',
							'nelio-ab-testing'
						) }
						readonly
					/>
				) }
			</span>
		</PanelRow>
	);
};

// =====
// HOOKS
// =====

const useIsPaused = () => {
	const [ status ] = useExperimentAttribute( 'status' );
	return status.includes( 'paused' );
};
