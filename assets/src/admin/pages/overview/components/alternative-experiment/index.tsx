/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { useState } from '@safe-wordpress/element';
import { addQueryArgs } from '@safe-wordpress/url';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';

import { Preview, Tooltip } from '@nab/components';
import { store as NAB_DATA } from '@nab/data';
import { store as NAB_EXPERIMENTS } from '@nab/experiments';
import { numberFormat } from '@nab/i18n';
import type {
	Experiment,
	ExperimentId,
	ExperimentTypeName,
	GoalId,
	Maybe,
	ResultStatus,
} from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { SummaryChart } from './summary-chart';

export type AlternativeExperimentProps = {
	readonly id: ExperimentId;
	readonly type: ExperimentTypeName;
	readonly name: Experiment[ 'name' ];
};

export const AlternativeExperiment = ( {
	id,
	name,
	type,
}: AlternativeExperimentProps ): JSX.Element => {
	const [ goalIndex, setGoalIndex ] = useState( 0 );
	const minSampleSize = useMinSampleSize();
	const {
		experiment,
		preview,
		ecommerce,
		goalCount,
		result: {
			status: originalStatus,
			views = 0,
			daysRunning = 0,
			conversionRates = [],
			values = [],
		} = {},
	} = useResults( id, goalIndex );

	const nextGoal = () => setGoalIndex( ( goalIndex + 1 ) % goalCount );
	const prevGoal = () =>
		setGoalIndex( ( goalCount + goalIndex - 1 ) % goalCount );

	const experimentType = useExperimentType( type );
	const Icon = experimentType?.icon ?? ( () => <></> );

	const areResultsLoaded = !! conversionRates.length;
	const isThereEnoughData = minSampleSize <= views;

	let status = originalStatus ?? 'testing';
	let message = getStatusMessage( status );
	if ( ! areResultsLoaded ) {
		message = _x( 'Loading…', 'text', 'nelio-ab-testing' );
	} else if ( ! isThereEnoughData ) {
		message = _x(
			'There isn’t enough data to find a winning variant',
			'text',
			'nelio-ab-testing'
		);
		status = 'testing';
	} //end if

	return (
		<article className="nab-experiment">
			<header className="nab-experiment__header">
				<h1 className="nab-experiment__title">
					{ Icon && <Icon className="nab-experiment__icon" /> }
					{ name }
				</h1>
				<Tooltip placement="left" text={ message }>
					<div
						className={ classnames( {
							'nab-experiment__status': true,
							[ `nab-experiment__status--${ status }` ]:
								areResultsLoaded,
							'nab-experiment__status--loading':
								! areResultsLoaded,
						} ) }
					></div>
				</Tooltip>
			</header>

			<div className="nab-experiment__content">
				<Preview
					className="nab-experiment__screenshot"
					url={ preview }
					caption={ _x(
						'Test screenshot.',
						'text',
						'nelio-ab-testing'
					) }
				/>

				<p className="screen-reader-text">
					{ _x(
						'Collected data about this test:',
						'text',
						'nelio-ab-testing'
					) }
				</p>

				<ul className="nab-experiment__data">
					{ goalCount > 1 && (
						<li className="nab-experiment__data-item nab-experiment__goals">
							<Tooltip
								placement="bottom"
								text={ getTooltipGoalName(
									experiment,
									goalIndex
								) }
							>
								<span className="nab-experiment__data-measure">
									{ getShortGoalName(
										experiment,
										goalIndex
									) }
								</span>
							</Tooltip>
							<span className="nab-experiment__data-value">
								<Button
									className="nab-experiment__goal-switch nab-experiment__prev-switch"
									onClick={ prevGoal }
									icon="arrow-left-alt2"
									title={ _x(
										'View previous goal',
										'command',
										'nelio-ab-testing'
									) }
								/>
								<Button
									className="nab-experiment__goal-switch nab-experiment__next-switch"
									onClick={ nextGoal }
									icon="arrow-right-alt2"
									title={ _x(
										'View next goal',
										'command',
										'nelio-ab-testing'
									) }
								/>
							</span>
						</li>
					) }
					<li className="nab-experiment__data-item">
						<span className="nab-experiment__data-measure">
							{ _x( 'Page views', 'text', 'nelio-ab-testing' ) }
							<span className="screen-reader-text">:</span>
						</span>
						<span className="nab-experiment__data-value">
							{ numberFormat( views ) }
						</span>
					</li>
					<li className="nab-experiment__data-item">
						<span className="nab-experiment__data-measure">
							{ _x( 'Days running', 'text', 'nelio-ab-testing' ) }
							<span className="screen-reader-text">:</span>
						</span>
						<span className="nab-experiment__data-value">
							{ numberFormat( daysRunning ) }
						</span>
					</li>
				</ul>

				<div className="nab-experiment__graphic">
					<SummaryChart
						type={ !! ecommerce ? 'revenue' : 'conversion-rates' }
						data={ !! ecommerce ? values : conversionRates }
						ecommerce={ ecommerce }
					/>
				</div>
			</div>

			<a
				className="nab-experiment__link"
				href={ addQueryArgs( 'admin.php', {
					page: 'nelio-ab-testing-experiment-view',
					experiment: id,
				} ) }
			>
				<span className="screen-reader-text">
					{ _x( 'View', 'command', 'nelio-ab-testing' ) }
				</span>
			</a>
		</article>
	);
};

// =====
// HOOKS
// =====

const useExperimentType = ( type: ExperimentTypeName ) =>
	useSelect( ( select ) =>
		select( NAB_EXPERIMENTS ).getExperimentType( type )
	);

const useMinSampleSize = () =>
	useSelect( ( select ) =>
		select( NAB_DATA ).getPluginSetting( 'minSampleSize' )
	);

const useResults = ( id: ExperimentId, goalIndex: number ) =>
	useSelect( ( select ) => {
		const {
			getConversionRatesOfAlternativesInGoal,
			getDaysRunning,
			getExperiment,
			getExperimentResultsStatus,
			getPageViews,
			getRevenuesOfAlternativesInGoal,
			getECommercePlugin,
		} = select( NAB_DATA );

		const experiment = getExperiment( id );
		const goals = experiment?.goals;
		const goalCount = goals?.length || 0;
		const goalId: Maybe< GoalId > = goals?.[ goalIndex ]?.id;

		return {
			experiment,
			preview: experiment?.links.preview ?? '',
			ecommerce: getECommercePlugin( id, goalId ),
			goalCount,
			result: {
				status: getExperimentResultsStatus( id, goalId ),
				views: getPageViews( id ),
				daysRunning: getDaysRunning( id ),
				conversionRates: getConversionRatesOfAlternativesInGoal(
					id,
					goalId
				),
				values: getRevenuesOfAlternativesInGoal( id, goalId ),
			},
		};
	} );

// =======
// HELPERS
// =======

function getStatusMessage( status?: ResultStatus ) {
	switch ( status ) {
		case 'winner':
			return _x( 'There is a winner!', 'text', 'nelio-ab-testing' );

		case 'possible-winner':
			return _x(
				'There is a winner with low confidence',
				'text',
				'nelio-ab-testing'
			);

		case 'testing':
		default:
			return _x( 'No winner found', 'text', 'nelio-ab-testing' );
	} //end switch
} //end getStatusMessage()

function getTooltipGoalName(
	experiment: Maybe< Experiment >,
	goalIndex: number
): Maybe< string > {
	const actualName = getActualGoalName( experiment, goalIndex );
	const shortName = getShortGoalName( experiment, goalIndex );
	return actualName !== shortName ? actualName : undefined;
} //end getTooltipGoalName()

function getShortGoalName(
	experiment: Maybe< Experiment >,
	goalIndex: number
): string {
	const name = getActualGoalName( experiment, goalIndex ) ?? '';
	const shortName = name.substring( 0, 20 ) + ( name.length > 20 ? '…' : '' );
	const defaultName =
		0 !== goalIndex
			? sprintf(
					/* translators: goal index */
					_x( 'Goal %d', 'text (short format)', 'nelio-ab-testing' ),
					goalIndex
			  )
			: _x( 'Default Goal', 'text (short format)', 'nelio-ab-testing' );
	return shortName || defaultName;
} //end getShortGoalName()

function getActualGoalName(
	experiment: Maybe< Experiment >,
	goalIndex: number
): Maybe< string > {
	return experiment?.goals[ goalIndex ]?.attributes?.name;
} //end getActualGoalName()
