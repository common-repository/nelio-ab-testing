/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon, Button, ButtonGroup } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { createInterpolateElement, useState } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NAB_DATA } from '@nab/data';
import { numberFormat } from '@nab/i18n';

/**
 * Internal dependencies
 */
import { ArpcChart } from './arpc-chart';
import { ArpcImprovementChart } from './arpc-improvement-chart';
import { ArpcTimelineChart } from './arpc-timeline-chart';
import { ConversionRatesChart } from './conversion-rates-chart';
import { ConversionRatesTimelineChart } from './conversion-rates-timeline-chart';
import { ViewsAndConversionsTimelineChart } from './views-and-conversions-timeline-chart';
import { ConversionImprovementChart } from './conversion-improvement-chart';
import { RevenueChart } from './revenue-chart';
import { RevenueImprovementChart } from './revenue-improvement-chart';
import { RevenueTimelineChart } from './revenue-timeline-chart';
import { getMoneyLabel, getNumberLabel } from '../utils';
import './style.scss';
import { useAreUniqueResultsVisible } from '../hooks';

type ChartType =
	| 'conversion-rate'
	| 'views-and-conversions'
	| 'revenue'
	| 'arpc';

export const EvolutionSection = (): JSX.Element => {
	const [ activeTimeline, setActiveTimeline ] =
		useState< ChartType >( 'conversion-rate' );

	return (
		<div className="nab-evolution-section">
			<Title />
			<ChartSelector
				value={ activeTimeline }
				onChange={ setActiveTimeline }
			/>
			<Summary />
			<TimelineChart type={ activeTimeline } />
			<ExtraCharts type={ activeTimeline } />
		</div>
	);
};

// ============
// HELPER VIEWS
// ============

const Title = () => (
	<h2 className="nab-evolution-section__title">
		{ createInterpolateElement(
			sprintf(
				/* translators: dashicon */
				_x( '%s Evolution', 'text', 'nelio-ab-testing' ),
				'<icon />'
			),
			{
				icon: (
					<Dashicon
						className="nab-evolution-section__title-icon"
						icon="chart-bar"
					/>
				),
			}
		) }
	</h2>
);

const Summary = (): JSX.Element => {
	const {
		areResultsUnique,
		conversionRate,
		conversions,
		ecommerce,
		uniquePageViews,
		totalPageViews,
		revenue,
	} = useAttributes();

	return (
		<ul className="nab-evolution-section__page-views-and-conversions">
			<li>
				<span className="nab-evolution-section__label">
					{ areResultsUnique
						? _x( 'Total Page Views:', 'text', 'nelio-ab-testing' )
						: _x( 'Page Views:', 'text', 'nelio-ab-testing' ) }
				</span>
				<span className="nab-evolution-section__value">
					{ getNumberLabel( totalPageViews ) }
				</span>
			</li>
			{ areResultsUnique && (
				<li>
					<span className="nab-evolution-section__label">
						{ _x(
							'Unique Page Views:',
							'text',
							'nelio-ab-testing'
						) }
					</span>
					<span className="nab-evolution-section__value">
						{ getNumberLabel( uniquePageViews ) }
					</span>
				</li>
			) }
			{ !! ecommerce && (
				<li>
					<span className="nab-evolution-section__label">
						{ _x( 'Revenue:', 'text', 'nelio-ab-testing' ) }
					</span>
					<span className="nab-evolution-section__value">
						{ getMoneyLabel( revenue, ecommerce ) }
					</span>
				</li>
			) }
			<li>
				<span className="nab-evolution-section__label">
					{ areResultsUnique
						? _x(
								'Unique Conversions:',
								'text',
								'nelio-ab-testing'
						  )
						: _x( 'Conversions:', 'text', 'nelio-ab-testing' ) }
				</span>
				<span className="nab-evolution-section__value">
					{ getNumberLabel( conversions ) }
				</span>
				<span className="nab-evolution-section__conversion-rate">
					{ getConversionRateLabel( conversionRate ) }
				</span>
			</li>
		</ul>
	);
};

const ChartSelector = ( {
	value,
	onChange,
}: {
	value: ChartType;
	onChange: ( v: ChartType ) => void;
} ) => {
	const { ecommerce } = useAttributes();
	const variant = ( expectedTimeline: ChartType ) =>
		value === expectedTimeline ? 'primary' : 'secondary';

	return (
		<ButtonGroup className="nab-evolution-section__timeline-selector">
			<Button
				showTooltip={ !! ecommerce }
				label={
					!! ecommerce
						? _x( 'Conversion Rates', 'text', 'nelio-ab-testing' )
						: undefined
				}
				variant={ variant( 'conversion-rate' ) }
				onClick={ () => onChange( 'conversion-rate' ) }
			>
				{ !! ecommerce
					? _x( 'Conv. Rates', 'text', 'nelio-ab-testing' )
					: _x( 'Conversion Rates', 'text', 'nelio-ab-testing' ) }
			</Button>

			<Button
				showTooltip={ !! ecommerce }
				label={
					!! ecommerce
						? _x(
								'Views and Conversions',
								'text',
								'nelio-ab-testing'
						  )
						: undefined
				}
				variant={ variant( 'views-and-conversions' ) }
				onClick={ () => onChange( 'views-and-conversions' ) }
			>
				{ !! ecommerce
					? _x( 'Views and Convs.', 'text', 'nelio-ab-testing' )
					: _x(
							'Views and Conversions',
							'text',
							'nelio-ab-testing'
					  ) }
			</Button>

			{ !! ecommerce && (
				<>
					<Button
						variant={ variant( 'revenue' ) }
						onClick={ () => onChange( 'revenue' ) }
					>
						{ _x( 'Revenue', 'text', 'nelio-ab-testing' ) }
					</Button>

					<Button
						showTooltip={ true }
						label={ _x(
							'Average Revenue Per Conversion',
							'text',
							'nelio-ab-testing'
						) }
						variant={ variant( 'arpc' ) }
						onClick={ () => onChange( 'arpc' ) }
					>
						{ _x( 'ARPC', 'text', 'nelio-ab-testing' ) }
					</Button>
				</>
			) }
		</ButtonGroup>
	);
};

type ChartFunction = ( props: { type: ChartType } ) => JSX.Element | null;
const TimelineChart: ChartFunction = ( { type } ) => {
	const { activeGoal, alternatives, areResultsUnique, ecommerce } =
		useAttributes();

	switch ( type ) {
		case 'conversion-rate':
			return (
				<div className="nab-evolution-section__timeline-graphic">
					<ConversionRatesTimelineChart
						alternatives={ alternatives }
						goal={ activeGoal }
						unique={ areResultsUnique }
					/>
				</div>
			);

		case 'views-and-conversions':
			return (
				<div className="nab-evolution-section__timeline-graphic">
					<ViewsAndConversionsTimelineChart
						alternatives={ alternatives }
						goal={ activeGoal }
						unique={ areResultsUnique }
					/>
				</div>
			);

		case 'revenue':
			if ( ! ecommerce ) {
				return null;
			} //end if
			return (
				<div className="nab-evolution-section__timeline-graphic">
					<RevenueTimelineChart
						alternatives={ alternatives }
						goal={ activeGoal }
						unique={ areResultsUnique }
					/>
				</div>
			);

		case 'arpc':
			if ( ! ecommerce ) {
				return null;
			} //end if
			return (
				<div className="nab-evolution-section__timeline-graphic">
					<ArpcTimelineChart
						alternatives={ alternatives }
						goal={ activeGoal }
						unique={ areResultsUnique }
					/>
				</div>
			);
	} //end switch
};

const ExtraCharts: ChartFunction = ( { type } ) => (
	<div className="nab-evolution-section__comparison-and-improvement-graphics">
		<div className="nab-evolution-section__comparison-graphic">
			<ComparisonChart type={ type } />
		</div>
		<div className="nab-evolution-section__improvement-graphic">
			<ImprovementChart type={ type } />
		</div>
	</div>
);

const ComparisonChart: ChartFunction = ( { type } ) => {
	const {
		activeGoal,
		alternatives,
		areResultsUnique,
		ecommerce,
		minConfidence,
		winners,
	} = useAttributes();

	switch ( type ) {
		case 'conversion-rate':
		case 'views-and-conversions':
			return (
				<ConversionRatesChart
					alternatives={ alternatives }
					goal={ activeGoal }
					winners={ winners }
					minConfidence={ minConfidence }
					unique={ areResultsUnique }
				/>
			);

		case 'revenue':
			if ( ! ecommerce ) {
				return null;
			} //end if
			return (
				<RevenueChart
					alternatives={ alternatives }
					goal={ activeGoal }
					unique={ areResultsUnique }
				/>
			);

		case 'arpc':
			if ( ! ecommerce ) {
				return null;
			} //end if
			return (
				<ArpcChart
					alternatives={ alternatives }
					goal={ activeGoal }
					unique={ areResultsUnique }
				/>
			);
	} //end switch
};

const ImprovementChart: ChartFunction = ( { type } ) => {
	const { activeGoal, alternatives, areResultsUnique, ecommerce } =
		useAttributes();

	switch ( type ) {
		case 'conversion-rate':
		case 'views-and-conversions':
			return (
				<ConversionImprovementChart
					alternatives={ alternatives }
					goal={ activeGoal }
					unique={ areResultsUnique }
				/>
			);

		case 'revenue':
			if ( ! ecommerce ) {
				return null;
			} //end if
			return (
				<RevenueImprovementChart
					alternatives={ alternatives }
					goal={ activeGoal }
					unique={ areResultsUnique }
				/>
			);

		case 'arpc':
			if ( ! ecommerce ) {
				return null;
			} //end if
			return (
				<ArpcImprovementChart
					alternatives={ alternatives }
					goal={ activeGoal }
					unique={ areResultsUnique }
				/>
			);
	} //end switch
};

// =====
// HOOKS
// =====

const useAttributes = () => {
	const [ areResultsUnique ] = useAreUniqueResultsVisible();
	return useSelect( ( select ) => {
		const {
			getAlternativeResultsInExperiment,
			getConversions,
			getExperimentAttribute,
			getPageAttribute,
			getPageViews,
			getTotalPageViews,
			getUniquePageViews,
			getPluginSetting,
			getTotalRevenue,
			getWinnersInExperiment,
			getECommercePlugin,
		} = select( NAB_DATA );

		const activeExperiment =
			getPageAttribute( 'editor/activeExperiment' ) ?? 0;
		const goals = getExperimentAttribute( activeExperiment, 'goals' ) ?? [];
		const activeGoalId =
			getPageAttribute( 'editor/activeGoal' ) ?? goals[ 0 ]?.id ?? '';
		const pageViews = getPageViews( activeExperiment );
		const conversions = getConversions( activeExperiment, activeGoalId );
		const revenue = getTotalRevenue( activeExperiment, activeGoalId );

		return {
			totalPageViews: getTotalPageViews( activeExperiment ),
			uniquePageViews: getUniquePageViews( activeExperiment ),
			conversions,
			conversionRate: ( conversions / pageViews ) * 100,
			activeGoal: activeGoalId,
			areResultsUnique,
			revenue,
			ecommerce: getECommercePlugin( activeExperiment, activeGoalId ),
			alternatives: getAlternativeResultsInExperiment( activeExperiment ),
			winners: getWinnersInExperiment( activeExperiment ) ?? {},
			minConfidence: getPluginSetting( 'minConfidence' ),
		};
	} );
};

// =======
// HELPERS
// =======

function getConversionRateLabel( conversionRate?: number ): JSX.Element {
	if ( ! conversionRate ) {
		return <></>;
	} //end if

	return <>({ numberFormat( conversionRate ) }%)</>;
} //end getConversionRateLabel()
