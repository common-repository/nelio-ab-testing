/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

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

ChartJS.register(
	BarElement,
	CategoryScale,
	ChartDataLabels,
	Legend,
	LinearScale,
	Title,
	Tooltip
);

import { store as NAB_DATA } from '@nab/data';
import type { ChartOptions } from 'chart.js';
import type {
	AlternativeTrackingData,
	ECommercePlugin,
	GoalId,
	Maybe,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { generateNLabels } from './helpers';
import { getMoneyLabel } from '../utils';

export type ArpcChartProps = {
	readonly alternatives?: ReadonlyArray< AlternativeTrackingData >;
	readonly goal: GoalId;
	readonly unique: boolean;
};

export const ArpcChart = ( props: ArpcChartProps ): JSX.Element => {
	const { alternatives = [], goal, unique } = props;
	const ecommerce = useECommercePlugin( goal );

	const data = getData( alternatives, goal, unique );
	const colors = data.map( () => 'rgb(75, 130, 150, 0.8)' );

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
	const options = getOptions( ecommerce );

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

const getOptions = ( ecommerce: Maybe< ECommercePlugin > ): ChartOptions => {
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
						isNumber( value )
							? getMoneyLabel( value, ecommerce )
							: '',
				},
			},
		},
		maintainAspectRatio: false,
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: _x(
					'Average Revenue Per Conversion (ARPC)',
					'text',
					'nelio-ab-testing'
				),
				color: '#464646',
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
					getMoneyLabel( value, ecommerce ),
			},
		},
	};
}; //end getOptions()

const getData = (
	alternatives: ReadonlyArray< AlternativeTrackingData >,
	goal: GoalId,
	unique: boolean
) =>
	alternatives.map( ( alternative ) =>
		unique
			? ( alternative.uniqueValues[ goal ] || 0 ) /
					( alternative.uniqueConversions[ goal ] || 0 ) || 0
			: ( alternative.values[ goal ] || 0 ) /
					( alternative.conversions[ goal ] || 0 ) || 0
	);

// =====
// HOOKS
// =====

const useECommercePlugin = ( goal: GoalId ) =>
	useSelect( ( select ) => {
		const { getPageAttribute, getECommercePlugin } = select( NAB_DATA );

		const activeExperiment =
			getPageAttribute( 'editor/activeExperiment' ) ?? 0;

		return getECommercePlugin( activeExperiment, goal );
	} );
