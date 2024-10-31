/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { numberFormat } from '@nab/i18n';
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

ChartJS.register(
	BarElement,
	CategoryScale,
	ChartDataLabels,
	Legend,
	LinearScale,
	Title,
	Tooltip
);

import type { ChartOptions } from 'chart.js';
import type { AlternativeTrackingData, GoalId, GoalWinner } from '@nab/types';

/**
 * Internal dependencies
 */
import { generateNLabels } from './helpers';

export type ConversionRatesChartProps = {
	readonly alternatives?: ReadonlyArray< AlternativeTrackingData >;
	readonly goal: GoalId;
	readonly minConfidence: number;
	readonly winners: Partial< Record< GoalId, GoalWinner > >;
	readonly unique: boolean;
};

export const ConversionRatesChart = (
	props: ConversionRatesChartProps
): JSX.Element => {
	const { winners, alternatives = [], goal, minConfidence, unique } = props;

	const data = getData( alternatives, goal, unique );
	const colors = data.map( () => 'rgb(75, 130, 150, 0.8)' );

	try {
		const winner = winners[ goal ];
		if ( winner && winner.confidence >= minConfidence ) {
			colors[ winner.alternative ] = 'rgb(105, 190, 122, 0.8)';
		} //end if
	} catch ( _ ) {}

	const chartData = {
		datasets: [
			{
				data,
				backgroundColor: colors,
				maxBarThickness: 60,
			},
		],
		labels: generateNLabels( data.length ),
	};
	const options = getOptions();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
	return <Bar data={ chartData as any } options={ options as any } />;
};

// =======
// HELPERS
// =======

function shouldLabelHoverBar( value: number, data: ReadonlyArray< number > ) {
	const max = Math.max( ...data );
	return value / max >= 0.7;
} //end shouldLabelHoverBar()

const getOptions = (): ChartOptions => {
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
		scales: {
			x: {
				min: 0,
				ticks: {
					callback: ( value ) =>
						isNumber( value ) ? `${ numberFormat( value ) }%` : '',
				},
			},
		},
		maintainAspectRatio: false,
		responsive: true,
		plugins: {
			title: {
				display: true,
				color: '#464646',
				text: _x( 'Conversion Rates', 'text', 'nelio-ab-testing' ),
				font: {
					size: 14,
					style: 'normal',
				},
			},
			legend: {
				display: false,
			},
			tooltip: {
				enabled: false,
			},
			datalabels: {
				align: ( context ): 'start' | 'end' =>
					shouldLabelHoverBar(
						context.dataset.data[ context.dataIndex ] as number,
						context.dataset.data as number[]
					)
						? 'start'
						: 'end',
				anchor: 'end',
				color: ( context ) =>
					shouldLabelHoverBar(
						context.dataset.data[ context.dataIndex ] as number,
						context.dataset.data as number[]
					)
						? '#fff'
						: '#555',
				font: {
					family: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
					weight: 'bold',
				},
				formatter: ( value: number ) => `${ value }%`,
			},
		},
	};
}; //end getOptions()

const getData = (
	alternatives: ReadonlyArray< AlternativeTrackingData >,
	goal: GoalId,
	unique: boolean
) => {
	return alternatives.map( ( alternative ) =>
		unique
			? alternative.uniqueConversionRates[ goal ] ?? 0
			: alternative.conversionRates[ goal ] ?? 0
	);
};
