/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { numberFormat } from '@nab/i18n';
import { isNumber } from '@nab/utils';
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
import type { AlternativeTrackingData, GoalId } from '@nab/types';

/**
 * Internal dependencies
 */
import { generateNLabels, isTooltipContext } from './helpers';

export type RevenueImprovementChartProps = {
	readonly alternatives?: ReadonlyArray< AlternativeTrackingData >;
	readonly goal: GoalId;
	readonly unique: boolean;
};

export const RevenueImprovementChart = (
	props: RevenueImprovementChartProps
): JSX.Element => {
	const { alternatives = [], goal, unique } = props;

	const data = getData( alternatives, goal, unique );

	const NORMAL = 'rgb(75, 130, 150, 0.8)';
	const RED = 'rgb(210, 70, 50, 0.8)';
	const colors = data.map( ( value ) => ( 0 > value ? RED : NORMAL ) );

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
				ticks: {
					callback: ( value ) =>
						isNumber( value ) ? `${ numberFormat( value ) }%` : '',
					maxRotation: 0,
				},
			},
		},
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			title: {
				display: true,
				text: _x( 'Revenue Improvement', 'text', 'nelio-ab-testing' ),
				color: '#464646',
				font: {
					size: 14,
					style: 'normal',
				},
			},
			tooltip: {
				callbacks: {
					title: ( [ context ] ) =>
						sprintf(
							/* translators: a letter, such as A, B, or C */
							_x( 'Variant %s', 'text', 'nelio-ab-testing' ),
							context?.label ?? ''
						),
					label: ( context ) => {
						if ( ! isTooltipContext< number >( context ) ) {
							return '';
						} //end if

						const value = context.raw || 0;
						if ( 0 > value ) {
							return sprintf(
								/* translators: a percentage number */
								_x(
									'%1$s%% worse than the control version',
									'text',
									'nelio-ab-testing'
								),
								numberFormat( Math.abs( value ) )
							);
						} //end if
						return sprintf(
							/* translators: a percentage number */
							_x(
								'%1$s%% better than the control version',
								'text',
								'nelio-ab-testing'
							),
							numberFormat( value )
						);
					},
				},
			},
			legend: {
				display: false,
			},
			datalabels: {
				align: ( context ) => {
					const value =
						context.dataset.data[ context?.dataIndex ?? '' ];
					const num = isNumber( value ) ? value : 0;
					return num < 0 ? 'end' : 'start';
				},
				anchor: ( context ) => {
					const value =
						context.dataset.data[ context?.dataIndex ?? '' ];
					const num = isNumber( value ) ? value : 0;
					return num < 0 ? 'start' : 'end';
				},
				color: '#fff',
				font: {
					family: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
					weight: 'bold',
				},
				formatter: ( value: number ) => {
					if ( ! value ) {
						return '';
					} //end if
					return value < 0
						? `${ numberFormat( value ) }%`
						: `+${ numberFormat( value ) }%`;
				},
			},
		},
	};
}; //end getOptions()

const getData = (
	alternatives: ReadonlyArray< AlternativeTrackingData >,
	goal: GoalId,
	unique: boolean
) => {
	const originalValue = unique
		? alternatives[ 0 ]?.uniqueValues[ goal ] || 0
		: alternatives[ 0 ]?.values[ goal ] || 0;
	return alternatives.map( ( alternative ) =>
		computeImprovement(
			originalValue,
			unique
				? alternative.uniqueValues[ goal ] || 0
				: alternative.values[ goal ] || 0
		)
	);
};

function computeImprovement( original: number, alternative: number ) {
	if ( 0 === original ) {
		return alternative;
	} //end if

	return Math.round( ( ( alternative - original ) / original ) * 1000 ) / 10;
} //end computeImprovement()
