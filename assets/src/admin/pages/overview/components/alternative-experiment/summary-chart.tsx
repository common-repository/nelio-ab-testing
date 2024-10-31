/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
	Chart as ChartJS,
	BarElement,
	CategoryScale,
	Legend,
	LinearScale,
	Title,
	Tooltip,
} from 'chart.js';
import { isNumber } from '@nab/utils';
import type { ECommercePlugin, Maybe } from '@nab/types';

import type { ChartOptions } from 'chart.js';

/**
 * Internal dependencies
 */
import { getMoneyLabel } from '../../../results/components/utils';
import { generateNLabels } from '../../../results/components/evolution-section/helpers';

ChartJS.register(
	BarElement,
	CategoryScale,
	ChartDataLabels,
	Legend,
	LinearScale,
	Title,
	Tooltip
);

export type SummaryChartProps = {
	readonly type: 'conversion-rates' | 'revenue';
	readonly ecommerce: Maybe< ECommercePlugin >;
	readonly data: ReadonlyArray< number >;
};

export const SummaryChart = ( props: SummaryChartProps ): JSX.Element => {
	const chartData = {
		datasets: [
			{
				data: props.data,
				backgroundColor: props.data.map(
					() => 'rgb(75, 130, 150, 0.8)'
				),
				maxBarThickness: 60,
			},
		],
		labels: generateNLabels( props.data.length ),
	};
	const options = getOptions( props );

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
	return <Bar data={ chartData as any } options={ options as any } />;
};

// =======
// HELPERS
// =======

function shouldLabelHoverBar( value: unknown, data: unknown[] ) {
	const max = Math.max( ...data.filter( isNumber ) );
	return isNumber( value ) && value / max >= 0.7;
} //end shouldLabelHoverBar()

const getOptions = ( props: SummaryChartProps ): ChartOptions => {
	return {
		indexAxis: 'y',
		layout: {
			padding: {
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
			},
		},
		maintainAspectRatio: false,
		responsive: true,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				enabled: false,
			},
			datalabels: {
				align: ( context ) =>
					shouldLabelHoverBar(
						context.dataset.data[ context.dataIndex ],
						context.dataset.data
					)
						? 'start'
						: 'end',
				anchor: 'end',
				color: ( context ) =>
					shouldLabelHoverBar(
						context.dataset.data[ context.dataIndex ],
						context.dataset.data
					)
						? '#fff'
						: '#555',
				font: {
					family: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
					weight: 'bold',
				},
				formatter: ( value: number ) =>
					'revenue' === props.type
						? getMoneyLabel( value, props.ecommerce )
						: `${ value }%`,
			},
		},
		scales: {
			y: {
				min: 0,
				ticks: {
					callback: ( value: unknown ) => {
						if ( ! isNumber( value ) ) {
							return '';
						} //end if
						return 'revenue' === props.type
							? getMoneyLabel( value, props.ecommerce )
							: `${ value }%`;
					},
				},
			},
		},
	};
}; //end getOptions()
