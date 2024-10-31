/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PanelBody } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';
import { Status } from './status';
import { DateInfo } from './date-info';
import { useExperimentAttribute } from '../../hooks';

export const Summary = (): JSX.Element => {
	const status = useExperimentAttribute( 'status' ) ?? 'running';
	const dates = {
		start: useExperimentAttribute( 'startDate' ) ?? '',
		end: useExperimentAttribute( 'endDate' ) ?? false,
		endMode: useExperimentAttribute( 'endMode' ) ?? 'manual',
		endValue: useExperimentAttribute( 'endValue' ) ?? 0,
	};

	return (
		<PanelBody
			className="nab-experiment-summary"
			title={ _x( 'Summary', 'text (experiment)', 'nelio-ab-testing' ) }
		>
			<Status status={ status } />
			<DateInfo { ...dates } />
		</PanelBody>
	);
};
