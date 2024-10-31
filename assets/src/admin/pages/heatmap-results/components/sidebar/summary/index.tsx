/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PanelBody } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NAB_DATA, useExperimentAttribute } from '@nab/data';

/**
 * Internal dependencies
 */
import './style.scss';
import { Stats } from './stats';
import { Status } from '../../../../results/components/sidebar/summary/status';
import { DateInfo } from '../../../../results/components/sidebar/summary/date-info';
import { store as NAB_HEATMAP } from '../../../store';
import { useActiveAlternative, useActiveExperiment } from '../../hooks';

export const Summary = (): JSX.Element => {
	const status = useExperimentAttribute( 'status', 'running' );
	const views = useAlternativeViews();
	const clicks = useClickCount();
	const dates = {
		start: useExperimentAttribute( 'startDate', '' ),
		end: useExperimentAttribute( 'endDate', false ),
		endMode: useExperimentAttribute( 'endMode', 'manual' ),
		endValue: useExperimentAttribute( 'endValue', 0 ),
	};

	return (
		<PanelBody
			className="nab-experiment-summary"
			title={ _x( 'Summary', 'text (experiment)', 'nelio-ab-testing' ) }
		>
			<Status status={ status } />
			<Stats views={ views } clicks={ clicks } />
			<DateInfo { ...dates } />
		</PanelBody>
	);
};

// =====
// HOOKS
// =====

const useClickCount = () =>
	useSelect( ( select ): number => {
		const alternative = select( NAB_HEATMAP ).getActiveAlternative();
		const resolution = select( NAB_HEATMAP ).getActiveResolution();
		return select( NAB_HEATMAP ).getClicksInResolution(
			alternative,
			resolution
		).length;
	} );

const useAlternativeViews = () => {
	const exp = useActiveExperiment();
	const [ altIdx ] = useActiveAlternative();
	return useSelect( ( select ) => {
		const alt = exp?.alternatives[ altIdx ];
		return exp && alt
			? select( NAB_DATA ).getAlternativePageViews( exp.id, alt.id )
			: 0;
	} );
};
