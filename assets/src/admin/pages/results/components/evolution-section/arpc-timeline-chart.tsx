/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chartjs-adapter-moment';
import {
	Chart as ChartJS,
	BarElement,
	CategoryScale,
	Legend,
	LineElement,
	LinearScale,
	PointElement,
	TimeScale,
	Title,
	Tooltip,
} from 'chart.js';

ChartJS.register(
	BarElement,
	CategoryScale,
	ChartDataLabels,
	Legend,
	LineElement,
	LinearScale,
	PointElement,
	TimeScale,
	Title,
	Tooltip
);

import { store as NAB_DATA } from '@nab/data';
import { getLetter } from '@nab/utils';
import type { ChartDataset, ChartOptions, ScatterDataPoint } from 'chart.js';
import type {
	AlternativeTrackingData,
	ECommercePlugin,
	GoalId,
	Maybe,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { isTooltipContext } from './helpers';
import { getMoneyLabel } from '../utils';

export type ArpcTimelineChartProps = {
	readonly alternatives?: ReadonlyArray< AlternativeTrackingData >;
	readonly goal: GoalId;
	readonly unique: boolean;
};

export const ArpcTimelineChart = (
	props: ArpcTimelineChartProps
): JSX.Element => {
	const { alternatives = [], goal, unique } = props;
	const ecommerce = useECommercePlugin( goal );
	const currency = useCurrencySymbol( ecommerce );

	const datasets: ChartDataset[] = [];
	const colors = [
		'#2a2a3f',
		'#d24633',
		'#4f97c5',
		'#64ab64',
		'#ff9000',
		'#60609f',
	];

	datasets.push( {
		label: _x( 'Variant A (Control)', 'text', 'nelio-ab-testing' ),
		backgroundColor: colors[ 0 ],
		borderColor: colors[ 0 ],
		fill: false,
		tension: 0.4,
		data: getData( alternatives[ 0 ], goal, unique ),
	} );

	const numberOfAlternatives = alternatives.length;
	for ( let i = 1; i < numberOfAlternatives; ++i ) {
		datasets.push( {
			label: sprintf(
				/* translators: a letter, such as A, B, or C */
				_x( 'Variant %s', 'text', 'nelio-ab-testing' ),
				getLetter( i )
			),
			backgroundColor: colors[ i % colors.length ],
			borderColor: colors[ i % colors.length ],
			fill: false,
			tension: 0.4,
			data: getData( alternatives[ i ], goal, unique ),
		} );
	} //end for

	const chartData = { datasets };
	const options = getOptions( currency, ecommerce );

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
	return <Line data={ chartData as any } options={ options as any } />;
};

// =======
// HELPERS
// =======

const getOptions = (
	currency: string,
	ecommerce: Maybe< ECommercePlugin >
): ChartOptions => {
	return {
		layout: {
			padding: {
				left: 0,
				right: 10,
				top: 0,
				bottom: 0,
			},
		},
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				type: 'time',
				ticks: {
					autoSkip: true,
					autoSkipPadding: 10,
					maxRotation: 0,
				},
				time: {
					unit: 'day',
					displayFormats: {
						day: 'D. MMM',
					},
				},
			},
			y: {
				min: 0,
				ticks: {
					callback: ( value ) => value,
				},
				title: {
					display: true,
					text:
						_x(
							'Avg. Revenue Per Conversion',
							'text',
							'nelio-ab-testing'
						) + ` (${ currency })`,
				},
			},
		},
		plugins: {
			tooltip: {
				callbacks: {
					title: ( [ context ] ) =>
						isTooltipContext< { x: string } >( context )
							? context.raw.x
							: '',
					label: ( context ) => {
						if ( ! isTooltipContext< { y: number } >( context ) ) {
							return '';
						} //end if
						const value = getMoneyLabel(
							context.raw.y || 0,
							ecommerce
						);
						return `${ context.dataset.label }: ${ value }`;
					},
				},
			},
			legend: {
				labels: {
					usePointStyle: true,
					color: '#333333',
					font: {
						family: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
						size: 12,
						style: 'normal',
					},
				},
				position: 'bottom',
			},
			datalabels: { display: false },
		},
	};
}; //end getOptions()

const getData = (
	alternative: Maybe< AlternativeTrackingData >,
	goal: GoalId,
	unique: boolean
): ScatterDataPoint[] => {
	if ( ! alternative ) {
		return [];
	} //end if

	return alternative.timeline.map( ( day ) => {
		return {
			x: day.date,
			y: unique
				? ( day.uniqueValues[ goal ] || 0 ) /
						( day.uniqueConversions[ goal ] || 0 ) || 0
				: ( day.values[ goal ] || 0 ) /
						( day.conversions[ goal ] || 0 ) || 0,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any as ScatterDataPoint;
	} );
};

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

const useCurrencySymbol = ( ecommerce: ECommercePlugin = 'woocommerce' ) =>
	useSelect( ( select ) =>
		select( NAB_DATA ).getECommerceSetting( ecommerce, 'currencySymbol' )
	);
