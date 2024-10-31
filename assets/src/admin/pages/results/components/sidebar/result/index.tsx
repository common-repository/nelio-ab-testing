/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	PanelRow,
	PanelBody,
	SelectControl,
	ToggleControl,
} from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim } from 'lodash';
import { ClipboardButton, FancyIcon, LoadingAnimation } from '@nab/components';
import {
	store as NAB_DATA,
	usePageAttribute,
	usePluginSetting,
} from '@nab/data';
import { getLetter } from '@nab/utils';
import type { ECommercePlugin, GoalWinner, Maybe } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import {
	useAreUniqueResultsVisible,
	useExperimentAttribute,
	useHasUniqueResults,
} from '../../hooks';
import { addQueryArgs } from '@safe-wordpress/url';

export const Result = (): JSX.Element => {
	const confidence = useConfidence();
	const goals = useExperimentAttribute( 'goals' ) || [];
	const isLoading = useIsLoadingResults();
	const ecommerce = useECommercePluginInActiveGoal();
	const minConfidence = usePluginSetting( 'minConfidence' );
	const minSampleSize = usePluginSetting( 'minSampleSize' );
	const pageViews = usePageViews();
	const segments = useExperimentAttribute( 'segments' ) || [];
	const status = useExperimentAttribute( 'status' );
	const winner = useWinningAlternative();
	const hasUniqueResults = useHasUniqueResults();
	const homeUrl = useHomeUrl();
	const { setPublicResultStatus } = useDispatch( NAB_DATA );

	const [ experimentId ] = usePageAttribute( 'editor/activeExperiment', 0 );

	const [ activeGoalId, setActiveGoal ] = usePageAttribute(
		'editor/activeGoal',
		goals[ 0 ]?.id ?? ''
	);
	const [ activeSegment, setActiveSegment ] = usePageAttribute(
		'editor/activeSegment',
		'default'
	);
	const [ areResultsUnique, setResultsUnique ] = useAreUniqueResultsVisible();
	const [ isPublicView ] = usePageAttribute( 'editor/isPublicView', false );
	const [ isReadOnlyActive, setReadOnly ] = usePageAttribute(
		'editor/isReadOnlyActive',
		false
	);

	const goalOptions = goals.map( ( goal, index ) => {
		return {
			label:
				trim( goal.attributes.name ) ||
				getDefaulGoalNameForIndex( index ),
			value: goal.id,
		};
	} );

	let segmentOptions = segments.map( ( segment, index ) => {
		return {
			label:
				trim( segment.attributes.name ) ||
				getDefaulSegmentNameForIndex( index ),
			value: segment.id,
		};
	} );
	segmentOptions = [
		{
			label: _x( 'Default Segment', 'text', 'nelio-ab-testing' ),
			value: 'default',
		},
		...segmentOptions,
	];

	const needsMoreDataToFindWinner = minSampleSize > pageViews;
	const hasClearWinner =
		! needsMoreDataToFindWinner && !! winner && confidence >= minConfidence;
	const mayHaveWinner =
		! needsMoreDataToFindWinner && !! winner && confidence < minConfidence;
	const hasNoWinner = ! hasClearWinner && ! mayHaveWinner;

	const publicResultUrl = addQueryArgs( homeUrl, {
		'nab-result': true,
		experiment: experimentId,
		preview: '',
	} );

	return (
		<PanelBody className="nab-experiment-result-summary">
			<PanelRow className="nab-experiment-result-summary__title">
				<span className="nab-experiment-result-summary__title-text">
					{ !! ecommerce
						? _x(
								'Conversion Rate Result',
								'text (experiment)',
								'nelio-ab-testing'
						  )
						: _x(
								'Result',
								'text (experiment)',
								'nelio-ab-testing'
						  ) }
				</span>
				{ 1 < goals.length && (
					<span className="nab-experiment-result-summary__goal-selector">
						<SelectControl
							label={ _x( 'Goal', 'text', 'nelio-ab-testing' ) }
							value={ activeGoalId }
							options={ goalOptions }
							onChange={ ( selectedGoalId ) =>
								setActiveGoal( selectedGoalId )
							}
						/>
					</span>
				) }
				{ 1 < segments.length && (
					<span className="nab-experiment-result-summary__segment-selector">
						<SelectControl
							label={ _x(
								'Segment',
								'text',
								'nelio-ab-testing'
							) }
							value={ activeSegment }
							options={ segmentOptions }
							onChange={ ( selectedSegment ) =>
								setActiveSegment( selectedSegment )
							}
						/>
					</span>
				) }
			</PanelRow>

			<PanelRow className="nab-experiment-result-summary__icon">
				{ isLoading && (
					<LoadingAnimation
						text={ _x(
							'Loading results…',
							'text',
							'nelio-ab-testing'
						) }
					/>
				) }
				{ ! isLoading && hasClearWinner && (
					<FancyIcon icon="winner" isRounded />
				) }

				{ ! isLoading && mayHaveWinner && (
					<FancyIcon icon="possible-winner" isRounded />
				) }

				{ ! isLoading && hasNoWinner && ! needsMoreDataToFindWinner && (
					<FancyIcon icon="no-winner" isRounded />
				) }

				{ ! isLoading && hasNoWinner && needsMoreDataToFindWinner && (
					<FancyIcon icon="collecting-results" isRounded />
				) }
			</PanelRow>

			<PanelRow className="nab-experiment-result-summary__text">
				{ ! isLoading && hasClearWinner && (
					<>
						{ winner === 'control' ? (
							<>
								{ status === 'finished'
									? _x(
											'Control version was the best',
											'text',
											'nelio-ab-testing'
									  )
									: _x(
											'Control version is the best',
											'text',
											'nelio-ab-testing'
									  ) }
							</>
						) : (
							<>
								{ status === 'finished'
									? sprintf(
											/* translators: variant id, as in "Variant B was the best" */
											_x(
												'Variant %s was the best',
												'text',
												'nelio-ab-testing'
											),
											getLetter( winner )
									  )
									: sprintf(
											/* translators: variant id, as in "Variant B is the best" */
											_x(
												'Variant %s is the best',
												'text',
												'nelio-ab-testing'
											),
											getLetter( winner )
									  ) }
							</>
						) }
					</>
				) }

				{ ! isLoading && mayHaveWinner && (
					<>
						{ winner === 'control' ? (
							<>
								{ status === 'finished'
									? _x(
											'Control version seemed the best',
											'text',
											'nelio-ab-testing'
									  )
									: _x(
											'Control version seems the best',
											'text',
											'nelio-ab-testing'
									  ) }
							</>
						) : (
							<>
								{ status === 'finished'
									? sprintf(
											/* translators: variant id, as in "Variant B was the best" */
											_x(
												'Variant %s seemed the best',
												'text',
												'nelio-ab-testing'
											),
											getLetter( winner )
									  )
									: sprintf(
											/* translators: variant id, as in "Variant B is the best" */
											_x(
												'Variant %s seems the best',
												'text',
												'nelio-ab-testing'
											),
											getLetter( winner )
									  ) }
							</>
						) }
					</>
				) }

				{ ! isLoading && hasNoWinner && ! needsMoreDataToFindWinner && (
					<>
						{ status === 'finished'
							? _x(
									'No variant seemed better than the rest',
									'text',
									'nelio-ab-testing'
							  )
							: _x(
									'No variant seems better than the rest',
									'text',
									'nelio-ab-testing'
							  ) }
					</>
				) }

				{ ! isLoading &&
					hasNoWinner &&
					needsMoreDataToFindWinner &&
					_x(
						'There isn’t enough data to find a winning variant',
						'text',
						'nelio-ab-testing'
					) }
			</PanelRow>

			{ !! winner && ! needsMoreDataToFindWinner && (
				<PanelRow className="nab-experiment-result-summary__confidence">
					{ sprintf(
						/* translators: confidence, as in "Confidence: 95%" */
						_x( 'Confidence: %1$s%%', 'text', 'nelio-ab-testing' ),
						`${ confidence }`
					) }
				</PanelRow>
			) }

			{ !! hasUniqueResults && (
				<PanelRow className="nab-experiment-result-summary__uniqueness-selector">
					<ToggleControl
						label={ _x(
							'Unique results',
							'text',
							'nelio-ab-testing'
						) }
						help={
							areResultsUnique
								? _x(
										'Shows unique views and conversions.',
										'user',
										'nelio-ab-testing'
								  )
								: _x(
										'Shows all collected data from all visitors.',
										'user',
										'nelio-ab-testing'
								  )
						}
						checked={ areResultsUnique }
						onChange={ ( checked ) => setResultsUnique( checked ) }
					/>
				</PanelRow>
			) }

			{ ! isPublicView && (
				<PanelRow className="nab-experiment-result-summary__uniqueness-selector">
					<ToggleControl
						label={ _x(
							'Public results',
							'text',
							'nelio-ab-testing'
						) }
						checked={ isReadOnlyActive }
						onChange={ ( checked ) => {
							void setPublicResultStatus( checked );
							setReadOnly( checked );
						} }
					/>
					{ !! isReadOnlyActive && (
						<div className="nab-experiment-result-summary__public-result">
							<div className="nab-experiment-result-summary__public-result-url">
								<input
									className="nab-experiment-result-summary__public-result-url-input"
									type="text"
									value={ publicResultUrl }
									readOnly
								/>
								<ClipboardButton text={ publicResultUrl } />
							</div>
							<p className="nab-experiment-result-summary__public-result-description">
								{ _x(
									'Copy and share this URL.',
									'user',
									'nelio-ab-testing'
								) }
							</p>
						</div>
					) }
				</PanelRow>
			) }
		</PanelBody>
	);
};

// =====
// HOOKS
// =====

const useHomeUrl = () =>
	useSelect( ( select ) => select( NAB_DATA ).getPluginSetting( 'homeUrl' ) );

const useIsLoadingResults = () => {
	const [ activeExperiment ] = usePageAttribute(
		'editor/activeExperiment',
		0
	);
	return useSelect(
		( select ) =>
			! select( NAB_DATA ).hasFinishedResolution(
				'getExperimentResults',
				[ activeExperiment ]
			)
	);
};

const useECommercePluginInActiveGoal = () => {
	const [ expId ] = usePageAttribute( 'editor/activeExperiment', 0 );
	const goals = useExperimentAttribute( 'goals' ) || [];
	const [ goalId ] = usePageAttribute(
		'editor/activeGoal',
		goals[ 0 ]?.id ?? ''
	);
	return useSelect( ( select ): Maybe< ECommercePlugin > => {
		const { getECommercePlugin } = select( NAB_DATA );
		return expId && goalId
			? getECommercePlugin( expId, goalId )
			: undefined;
	} );
};

const usePageViews = () => {
	const [ activeExperiment ] = usePageAttribute(
		'editor/activeExperiment',
		0
	);
	return useSelect(
		( select ) => select( NAB_DATA ).getPageViews( activeExperiment ) || 0
	);
};

const useConfidence = () => useGoalWinner()?.confidence || 0;

const useWinningAlternative = (): Maybe< 'control' | number > => {
	const alternatives = useExperimentAttribute( 'alternatives' );
	const alternative = useGoalWinner()?.alternative;
	if ( undefined === alternative ) {
		return undefined;
	} //end if
	const winAlt = alternatives?.[ alternative ];
	return winAlt?.id === 'control' ? 'control' : alternative;
};

const useGoalWinner = (): Maybe< GoalWinner > => {
	const [ experimentId ] = usePageAttribute( 'editor/activeExperiment', 0 );
	const goals = useExperimentAttribute( 'goals' ) || [];
	const [ activeGoalId ] = usePageAttribute(
		'editor/activeGoal',
		goals[ 0 ]?.id ?? ''
	);
	const winners = useSelect( ( select ) =>
		select( NAB_DATA ).getWinnersInExperiment( experimentId )
	);
	return winners?.[ activeGoalId ];
};

// =======
// HELPERS
// =======

const getDefaulGoalNameForIndex = ( index: number ) =>
	index
		? sprintf(
				/* translators: a number */
				_x( 'Goal %d', 'text', 'nelio-ab-testing' ),
				index + 1
		  )
		: _x( 'Default Goal', 'text', 'nelio-ab-testing' );

const getDefaulSegmentNameForIndex = ( index: number ) =>
	sprintf(
		/* translators: a number */
		_x( 'Segment %d', 'text', 'nelio-ab-testing' ),
		index + 1
	);
