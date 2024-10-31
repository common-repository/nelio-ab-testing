/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import apiFetch from '@safe-wordpress/api-fetch';
import { Button, ExternalLink, Tooltip } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { useEffect, useState } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';
import { addQueryArgs } from '@safe-wordpress/url';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isFunction, noop } from 'lodash';
import { ConfirmationDialog, FancyIcon, Preview } from '@nab/components';
import { store as NAB_DATA, usePluginSetting } from '@nab/data';
import { store as NAB_EXPERIMENTS } from '@nab/experiments';
import {
	addFreeTracker,
	getLetter,
	isExperimentTooOldToHaveHeatmaps,
} from '@nab/utils';
import type {
	Alternative,
	AlternativeTrackingData,
	ECommercePlugin,
	Experiment,
	ExperimentId,
	GoalId,
} from '@nab/types';

/**
 * Internal dependencies
 */
import {
	getAlternativeName,
	getMoneyLabel,
	getNumberLabel,
	getPercentageLabel,
	getImprovementLabel,
} from '../utils';

export type AlternativeContainerProps = {
	readonly index: number;
	readonly alternative: Alternative;
	readonly areResultsUnique: boolean;
	readonly isPublicView: boolean;
	readonly ecommerce?: ECommercePlugin;
	readonly experimentId: ExperimentId;
	readonly experimentStatus: Experiment[ 'status' ];
	readonly goal: GoalId;
	readonly result?: AlternativeTrackingData;
	readonly controlRevenue?: number;
	readonly controlArpc?: number;
	readonly isWinner?: boolean;
	readonly totalPageViews?: number;
};

export const AlternativeContainer = (
	props: AlternativeContainerProps
): JSX.Element => {
	const [ isApplyDialogOpen, openApplyDialog ] = useState( false );
	const heatmapDataStatus = useHeatmapDataStatus(
		props.experimentId,
		props.alternative.id
	);
	const minSampleSize = usePluginSetting( 'minSampleSize' );
	const {
		homeUrl,
		alternativeBeingApplied,
		endDate,
		supportsAlternativeApplication,
		supportsAlternativePreviewDialog,
	} = useAttributes( props ) || {};
	const { applyAlternative, viewAlternative } =
		useAlternativeActions( props );

	const {
		index,
		experimentId,
		alternative: {
			isLastApplied,
			attributes: { name },
			links: { heatmap, preview },
		},
		areResultsUnique: isUnique,
		isPublicView,
		result: {
			visits: allVisits,
			conversions: allConversions = {},
			conversionRates: allConvRates = {},
			values: allValues = {},
			improvementFactors: allImprovFactors = {},

			uniqueVisits: uniqVisits,
			uniqueConversions: uniqConversions = {},
			uniqueConversionRates: uniqConvRates = {},
			uniqueValues: uniqValues = {},
			uniqueImprovementFactors: uniqImprovFactors = {},
		} = {},
		ecommerce,
		experimentStatus,
		goal,
		controlRevenue,
		controlArpc,
		isWinner,
		totalPageViews = 0,
	} = props;

	const visits = isUnique ? uniqVisits : allVisits;
	const conversions = isUnique ? uniqConversions : allConversions;
	const conversionRates = isUnique ? uniqConvRates : allConvRates;
	const revenues = isUnique ? uniqValues : allValues;
	const improvementFactors = isUnique ? uniqImprovFactors : allImprovFactors;

	const revenue = revenues[ goal ] || 0;
	const revenueImprovement = ! controlRevenue
		? 0
		: Math.round(
				( ( revenue - controlRevenue ) / controlRevenue ) * 1000
		  ) / 10;

	const conv = conversions[ goal ] ?? 0;
	const arpc = conversions[ goal ] ? revenue / conv : 0;
	const arpcImprovement = ! controlArpc
		? 0
		: Math.round( ( ( arpc - controlArpc ) / controlArpc ) * 1000 ) / 10;

	const screenshot = preview;
	const alternativeName = getAlternativeName( index, name );

	const showHeatmapButton =
		!! heatmap && ! isExperimentTooOldToHaveHeatmaps( endDate );
	const showApplyButton =
		experimentStatus === 'finished' &&
		!! supportsAlternativeApplication &&
		!! applyAlternative;
	const showPreviewInDialog = !! supportsAlternativePreviewDialog;
	const isClearWinner = isWinner && minSampleSize <= totalPageViews;

	const heatmapResultPageUrl = isPublicView
		? addQueryArgs( homeUrl, {
				'nab-result': true,
				experiment: experimentId,
				heatmap: index,
				preview: '',
		  } )
		: addQueryArgs( 'admin.php', {
				page: 'nelio-ab-testing-experiment-view',
				experiment: experimentId,
				heatmap: index,
		  } );

	return (
		<div
			className={ classnames( [
				'nab-alternative',
				'nab-alternative-list__alternative',
				{ 'nab-alternative-list__alternative--original': ! index },
				{ 'nab-alternative-list__alternative--winner': isClearWinner },
			] ) }
		>
			{ isClearWinner && (
				<FancyIcon
					icon="winner"
					className="nab-alternative__winner-medal"
				/>
			) }

			<h3
				className={ classnames( [
					'nab-alternative__title',
					{ 'nab-alternative__title--winner': isClearWinner },
				] ) }
			>
				<span className="nab-alternative__letter">
					{ getLetter( index ) }
				</span>
				{ !! preview ? (
					<ExternalLink
						className="nab-alternative__name-link"
						href={ preview }
					>
						{ alternativeName }
					</ExternalLink>
				) : (
					alternativeName
				) }
			</h3>

			<div className="nab-alternative__content">
				<div className="nab-alternative__screenshot-wrapper">
					{ !! preview ? (
						<ExternalLink
							href={ preview }
							className="nab-alternative__screenshot-link"
						>
							<Preview
								className="nab-alternative__screenshot"
								url={ screenshot }
								caption={ sprintf(
									/* translators: alternative name */
									_x(
										'Screenshot of “%s.”',
										'text',
										'nelio-ab-testing'
									),
									alternativeName
								) }
							/>
						</ExternalLink>
					) : (
						<Preview
							className="nab-alternative__screenshot"
							url={ screenshot }
							caption={ sprintf(
								/* translators: alternative name */
								_x(
									'Screenshot of “%s.”',
									'text',
									'nelio-ab-testing'
								),
								alternativeName
							) }
						/>
					) }
				</div>

				<div
					className={ classnames( [
						'nab-alternative__metrics',
						{
							'nab-alternative__metrics--condensed': !! ecommerce,
						},
					] ) }
				>
					<div className="nab-alternative-metric">
						<span className="nab-alternative-metric__label">
							{ _x( 'Page Views', 'text', 'nelio-ab-testing' ) }
						</span>
						<span className="nab-alternative-metric__value">
							{ getNumberLabel( visits ) }
						</span>
					</div>
					<div className="nab-alternative-metric">
						<span className="nab-alternative-metric__label">
							{ _x( 'Conversions', 'text', 'nelio-ab-testing' ) }
						</span>
						<span className="nab-alternative-metric__value">
							{ getNumberLabel( conversions[ goal ] ) }
						</span>
					</div>
					<div className="nab-alternative-metric">
						<span className="nab-alternative-metric__label">
							{ _x(
								'Conversion Rate',
								'text',
								'nelio-ab-testing'
							) }
						</span>
						<span className="nab-alternative-metric__value">
							{ getPercentageLabel(
								conversionRates[ goal ] || 0
							) }
							{ !! index && (
								<span
									className={ classnames( [
										{
											'nab-alternative-metric__value--better':
												( improvementFactors[ goal ] ||
													0 ) > 0,
										},
										{
											'nab-alternative-metric__value--worse':
												( improvementFactors[ goal ] ||
													0 ) < 0,
										},
									] ) }
								>
									{ getImprovementLabel(
										improvementFactors[ goal ] || 0
									) }
								</span>
							) }
						</span>
					</div>
					{ !! ecommerce && (
						<>
							<div className="nab-alternative-metric">
								<span className="nab-alternative-metric__label">
									{ _x(
										'Revenue',
										'text',
										'nelio-ab-testing'
									) }
								</span>
								<span className="nab-alternative-metric__value">
									{ getMoneyLabel( revenue, ecommerce ) }
									{ !! index && (
										<span
											className={ classnames( [
												{
													'nab-alternative-metric__value--better':
														revenueImprovement > 0,
												},
												{
													'nab-alternative-metric__value--worse':
														revenueImprovement < 0,
												},
											] ) }
										>
											{ getImprovementLabel(
												revenueImprovement
											) }
										</span>
									) }
								</span>
							</div>
							<div className="nab-alternative-metric">
								<Tooltip
									text={ _x(
										'Average Revenue Per Conversion',
										'text',
										'nelio-ab-testing'
									) }
								>
									<span className="nab-alternative-metric__label">
										{ _x(
											'ARPC',
											'text',
											'nelio-ab-testing'
										) }
									</span>
								</Tooltip>
								<span className="nab-alternative-metric__value">
									{ getMoneyLabel( arpc, ecommerce ) }
									{ !! index && (
										<span
											className={ classnames( [
												{
													'nab-alternative-metric__value--better':
														arpcImprovement > 0,
												},
												{
													'nab-alternative-metric__value--worse':
														arpcImprovement < 0,
												},
											] ) }
										>
											{ getImprovementLabel(
												arpcImprovement
											) }
										</span>
									) }
								</span>
							</div>
						</>
					) }
				</div>
			</div>

			{ ( showHeatmapButton ||
				showApplyButton ||
				showPreviewInDialog ) && (
				<ul className="nab-alternative__actions">
					{ showHeatmapButton &&
						'available' === heatmapDataStatus && (
							<ExternalLink
								className="components-button is-secondary"
								href={ heatmapResultPageUrl }
							>
								{ _x(
									'Heatmap',
									'command',
									'nelio-ab-testing'
								) }
							</ExternalLink>
						) }

					{ showHeatmapButton && 'loading' === heatmapDataStatus && (
						<Button variant="secondary" disabled>
							{ _x( 'Heatmap', 'command', 'nelio-ab-testing' ) }
						</Button>
					) }

					{ showHeatmapButton &&
						'nothing' === heatmapDataStatus &&
						'finished' !== experimentStatus && (
							<ExternalLink
								className="components-button is-secondary"
								href={ addFreeTracker(
									_x(
										'https://neliosoftware.com/testing/pricing/',
										'text',
										'nelio-ab-testing'
									)
								) }
							>
								{ _x(
									'Subscribe to Track Heatmap',
									'command',
									'nelio-ab-testing'
								) }
							</ExternalLink>
						) }

					{ showApplyButton && (
						<>
							<Button
								variant={
									isLastApplied ? 'secondary' : 'primary'
								}
								onClick={ () => openApplyDialog( true ) }
							>
								{ isLastApplied
									? _x(
											'Re-Apply',
											'command (an alternative)',
											'nelio-ab-testing'
									  )
									: _x(
											'Apply',
											'command (an alternative)',
											'nelio-ab-testing'
									  ) }
							</Button>
							<ConfirmationDialog
								title={ _x(
									'Apply Variant',
									'text',
									'nelio-ab-testing'
								) }
								text={ _x(
									'You’re about to overwrite the tested element with this variant. This operation can’t be undone. Are you sure you want to continue?',
									'user',
									'nelio-ab-testing'
								) }
								confirmLabel={
									alternativeBeingApplied
										? _x(
												'Applying Variant…',
												'text (an alternative)',
												'nelio-ab-testing'
										  )
										: _x(
												'Apply Variant',
												'command',
												'nelio-ab-testing'
										  )
								}
								isConfirmBusy={ !! alternativeBeingApplied }
								isConfirmEnabled={ ! alternativeBeingApplied }
								isCancelEnabled={ ! alternativeBeingApplied }
								isOpen={ isApplyDialogOpen }
								onCancel={ () => openApplyDialog( false ) }
								onConfirm={ () => {
									void applyAlternative().then( () =>
										openApplyDialog( false )
									);
								} }
							/>
						</>
					) }

					{ showPreviewInDialog && (
						<Button variant="secondary" onClick={ viewAlternative }>
							{ _x( 'View', 'command', 'nelio-ab-testing' ) }
						</Button>
					) }
				</ul>
			) }
		</div>
	);
};

// =====
// HOOKS
// =====

const useAttributes = ( {
	experimentId,
	alternative: { id: alternativeId },
}: AlternativeContainerProps ) =>
	useSelect( ( select ): typeof NO_ATTRIBUTES => {
		const { getExperiment, getPluginSetting } = select( NAB_DATA );

		const experiment = getExperiment( experimentId );
		if ( ! experiment ) {
			return NO_ATTRIBUTES;
		} //end if

		const { getExperimentAttribute, getPageAttribute } = select( NAB_DATA );
		const { getExperimentSupport } = select( NAB_EXPERIMENTS );

		const alternativeApplication = getExperimentSupport(
			experiment.type,
			'alternativeApplication'
		);

		return {
			homeUrl: getPluginSetting( 'homeUrl' ),

			supportsAlternativeApplication: isFunction( alternativeApplication )
				? alternativeApplication( experiment.alternatives )
				: !! alternativeApplication,

			supportsAlternativePreviewDialog:
				'control' !== alternativeId &&
				!! getExperimentSupport(
					experiment.type,
					'alternativePreviewDialog'
				),

			alternativeBeingApplied: !! getPageAttribute(
				'editor/alternativeBeingApplied'
			),

			endDate: getExperimentAttribute( experimentId, 'endDate' ) || '',
		};
	} );

const useAlternativeActions = (
	props: AlternativeContainerProps
): typeof NO_ACTIONS => {
	const { applyAlternative, setPageAttribute } = useDispatch( NAB_DATA );
	if ( ! props.alternative?.id ) {
		return NO_ACTIONS;
	} //end if

	return {
		applyAlternative: () => applyAlternative( props.alternative.id ),
		viewAlternative: () =>
			setPageAttribute(
				'editor/alternativeInPreviewDialog',
				props.alternative.id
			),
	};
};

const useHeatmapDataStatus = (
	experimentId: ExperimentId,
	alternativeId: string
): 'available' | 'loading' | 'nothing' => {
	const [ status, setStatus ] = useState<
		'available' | 'loading' | 'nothing'
	>( 'nothing' );
	const isSubscribed = !! usePluginSetting( 'subscription' );

	useEffect( () => {
		if ( isSubscribed ) {
			return;
		} //end if

		setStatus( 'loading' );
		void apiFetch( {
			path: `/nab/v1/experiment/${ experimentId }/has-heatmap-data/${ alternativeId }`,
		} ).then( ( r ) => setStatus( !! r ? 'available' : 'nothing' ) );
	}, [ isSubscribed, experimentId, alternativeId ] );

	return isSubscribed ? 'available' : status;
};

// ====
// DATA
// ====

const NO_ATTRIBUTES = {
	homeUrl: '',
	supportsAlternativeApplication: false,
	supportsAlternativePreviewDialog: false,
	alternativeBeingApplied: false,
	endDate: '',
};

const NO_ACTIONS = {
	applyAlternative: noop as () => Promise< unknown >,
	viewAlternative: noop,
};
