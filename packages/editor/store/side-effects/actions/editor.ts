/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, select } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';
import { store as NOTICES } from '@safe-wordpress/notices';

/**
 * External dependencies
 */
import { values } from 'lodash';
import { store as NAB_DATA } from '@nab/data';
import type {
	Alternative,
	AlternativeId,
	ConversionAction,
	ECommercePlugin,
	Experiment,
	Goal,
	Heatmap,
	Maybe,
	OrderStatus,
	OrderStatusName,
	Segment,
	Url,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { store as NAB_EDITOR } from '../../../store';

export async function saveExperiment(): Promise< void > {
	const isSaving = select( NAB_EDITOR ).isExperimentBeingSaved();
	if ( isSaving ) {
		return;
	} //end if
	await dispatch( NAB_EDITOR ).setExperimentAsBeingSaved( true );

	const goals: Goal[] = [];
	const goalsWithoutActions = select( NAB_EDITOR ).getGoals();
	for ( const goal of goalsWithoutActions ) {
		const actions = select( NAB_EDITOR ).getConversionActions( goal.id );
		const ecommerce = getECommercePlugin( actions );

		goals.push( {
			...goal,
			attributes: {
				...goal.attributes,
				useOrderRevenue: !! ecommerce
					? goal.attributes.useOrderRevenue ?? true
					: undefined,
				orderStatusForConversion: !! ecommerce
					? getOrderStatusForConversion( ecommerce, goal )
					: undefined,
			},
			conversionActions: actions,
		} );
	} //end for

	const segments: Segment[] = [];
	const segmentsWithoutRules = select( NAB_EDITOR ).getSegments();
	for ( const segment of segmentsWithoutRules ) {
		segments.push( {
			...segment,
			segmentationRules: select( NAB_EDITOR ).getSegmentationRules(
				segment.id
			),
		} );
	} //end for

	const nonControlAlternatives: Alternative[] = [];
	const alternativeIds = select( NAB_EDITOR ).getAlternativeIds();
	const isTestedElementInvalid =
		select( NAB_EDITOR ).isTestedElementInvalid();

	const control = select( NAB_EDITOR ).getAlternative( 'control' );
	for ( const alternativeId of alternativeIds ) {
		if ( 'control' === alternativeId ) {
			continue;
		} //end if
		const alt = select( NAB_EDITOR ).getAlternative( alternativeId );
		if ( alt ) {
			nonControlAlternatives.push( alt );
		} //end if
	} //end for

	let experiment: Omit< Experiment, 'links' > | Omit< Heatmap, 'links' >;
	const type = select( NAB_EDITOR ).getExperimentType();
	if ( 'nab/heatmap' === type ) {
		experiment = {
			id: select( NAB_EDITOR ).getExperimentId(),
			type,
			name: select( NAB_EDITOR ).getExperimentAttribute( 'name' ),
			description:
				select( NAB_EDITOR ).getExperimentAttribute( 'description' ),
			status: select( NAB_EDITOR ).getExperimentAttribute( 'status' ),
			startDate:
				select( NAB_EDITOR ).getExperimentAttribute( 'startDate' ),
			endDate: false,
			endMode: select( NAB_EDITOR ).getExperimentAttribute( 'endMode' ),
			endValue: select( NAB_EDITOR ).getExperimentAttribute( 'endValue' ),
			trackingMode:
				select( NAB_EDITOR ).getHeatmapAttribute( 'trackingMode' ) ??
				'post',
			trackedPostId:
				select( NAB_EDITOR ).getHeatmapAttribute( 'trackedPostId' ) ??
				0,
			trackedPostType:
				select( NAB_EDITOR ).getHeatmapAttribute( 'trackedPostType' ) ??
				'page',
			trackedUrl:
				select( NAB_EDITOR ).getHeatmapAttribute( 'trackedUrl' ) ??
				( '' as Url ),
			participationConditions:
				select( NAB_EDITOR ).getHeatmapAttribute(
					'participationConditions'
				) ?? [],
		};
	} else {
		experiment = {
			id: select( NAB_EDITOR ).getExperimentId(),
			type,
			name: select( NAB_EDITOR ).getExperimentAttribute( 'name' ),
			description:
				select( NAB_EDITOR ).getExperimentAttribute( 'description' ),
			status: select( NAB_EDITOR ).getExperimentAttribute( 'status' ),
			startDate:
				select( NAB_EDITOR ).getExperimentAttribute( 'startDate' ),
			endDate: false,
			endMode: select( NAB_EDITOR ).getExperimentAttribute( 'endMode' ),
			endValue: select( NAB_EDITOR ).getExperimentAttribute( 'endValue' ),
			scope: select( NAB_EDITOR ).getScope(),
			// TODO. Can we make this safer, without an explicit cast?
			alternatives: isTestedElementInvalid
				? [ control as Alternative ]
				: [ control as Alternative, ...nonControlAlternatives ],
			goals,
			segmentEvaluation: select( NAB_EDITOR ).getSegmentEvaluation(),
			segments,
		};
	} //end if

	try {
		let savedExperiment = await apiFetch< Experiment >( {
			path: `/nab/v1/experiment/${ experiment.id }`,
			method: 'PUT',
			data: experiment,
		} );

		if ( 'nab/heatmap' !== experiment.type && isTestedElementInvalid ) {
			savedExperiment = {
				...savedExperiment,
				alternatives: [
					savedExperiment.alternatives[ 0 ],
					...nonControlAlternatives,
				],
			};
		} //end if

		await dispatch( NAB_EDITOR ).setupEditor( savedExperiment );
		await dispatch( NAB_EDITOR ).setExperimentAsBeingSaved( false );
		await dispatch( NAB_EDITOR ).setExperimentAsRecentlySaved();
	} catch ( e ) {
		const message = getErrorMessage( e );
		await dispatch( NOTICES ).createErrorNotice( message );
		await dispatch( NAB_EDITOR ).setExperimentAsBeingSaved( false );
	} //end try
} //end saveExperiment()

export async function saveExperimentAndEditAlternative(
	alternativeId: AlternativeId
): Promise< void > {
	await saveExperiment();
	if ( ! select( NAB_EDITOR ).hasExperimentBeenRecentlySaved() ) {
		return;
	} //end if

	const alternativeIds = select( NAB_EDITOR ).getAlternativeIds();
	if ( ! alternativeIds.includes( alternativeId ) ) {
		return;
	} //end if

	const alternative = select( NAB_EDITOR ).getAlternative( alternativeId );
	if ( ! alternative ) {
		return;
	} //end if

	if ( ! alternative.links.edit ) {
		return;
	} //end if

	window.location.href = alternative.links.edit; // phpcs:ignore
} //end saveExperimentAndEditAlternative()

export async function saveExperimentAndPreviewAlternative(
	alternativeId: AlternativeId
): Promise< void > {
	await saveExperiment();
	if ( ! select( NAB_EDITOR ).hasExperimentBeenRecentlySaved() ) {
		return;
	} //end if

	const alternativeIds = select( NAB_EDITOR ).getAlternativeIds();
	if ( ! alternativeIds.includes( alternativeId ) ) {
		return;
	} //end if

	const alternative = select( NAB_EDITOR ).getAlternative( alternativeId );
	if ( ! alternative?.links.preview ) {
		return;
	} //end if

	await dispatch( NAB_EDITOR ).openAlternativePreviewer(
		alternative.links.preview
	);
} //end saveExperimentAndPreviewAlternative()

export async function moveToTrash(): Promise< void > {
	await dispatch( NAB_EDITOR ).setExperimentData( { status: 'trash' } );
	await saveExperiment();
	// phpcs:ignore
	window.location.href = select( NAB_DATA ).getAdminUrl( 'edit.php', {
		post_type: 'nab_experiment',
	} );
} //end moveToTrash()

export async function startExperiment(): Promise< void > {
	await startOrResumeExperiment(
		'start',
		_x( 'Test can’t be started', 'text', 'nelio-ab-testing' )
	);
} //end startExperiment()

export async function resumeExperiment(): Promise< void > {
	await startOrResumeExperiment(
		'resume',
		_x( 'Test can’t be resumed', 'text', 'nelio-ab-testing' )
	);
} //end resumeExperiment()

// =======
// HELPERS
// =======

async function startOrResumeExperiment(
	action: 'start' | 'resume',
	errorMessage?: string
): Promise< void > {
	await saveExperiment();
	if ( ! select( NAB_EDITOR ).hasExperimentBeenRecentlySaved() ) {
		return;
	} //end if

	await dispatch( NAB_EDITOR ).setExperimentAsBeingSaved( true );
	const experimentId = select( NAB_EDITOR ).getExperimentId();

	try {
		await apiFetch( {
			path: `/nab/v1/experiment/${ experimentId }/${ action }`,
			method: 'PUT',
		} );
	} catch ( e ) {
		const message = getErrorMessage( e, errorMessage );
		await dispatch( NOTICES ).createErrorNotice( message );
		await dispatch( NAB_EDITOR ).setExperimentAsBeingSaved( false );
		return;
	} //end if

	// phpcs:ignore
	window.location.href = select( NAB_DATA ).getAdminUrl( 'admin.php', {
		page: 'nelio-ab-testing-experiment-view',
		experiment: experimentId,
	} );
} //end startOrResumeExperiment()

function getECommercePlugin(
	actions: ReadonlyArray< ConversionAction >
): Maybe< ECommercePlugin > {
	if ( ! actions.length ) {
		return undefined;
	} //end if

	const isWcOrder = ( { type }: ConversionAction ) => 'nab/wc-order' === type;
	if ( actions.every( isWcOrder ) ) {
		return 'woocommerce';
	} //end if

	const isEddOrder = ( { type }: ConversionAction ) =>
		'nab/edd-order' === type;
	if ( actions.every( isEddOrder ) ) {
		return 'edd';
	} //end if

	return undefined;
} //end getECommercePlugin()

function getOrderStatusForConversion(
	plugin: ECommercePlugin,
	goal: Omit< Goal, 'conversionActions' >
): OrderStatusName {
	const validStatuses = select( NAB_DATA ).getECommerceSetting(
		plugin,
		'orderStatuses'
	);

	const status = goal.attributes.orderStatusForConversion;
	return status &&
		validStatuses.map( ( s: OrderStatus ) => s.value ).includes( status )
		? status
		: getDefaultOrderStatus( plugin );
} //end getOrderStatusForConversion()

function getDefaultOrderStatus( plugin: ECommercePlugin ): string {
	switch ( plugin ) {
		case 'woocommerce':
			return 'wc-completed';

		case 'edd':
			return 'complete';
	} //end switch
} //end getDefaultOrderStatus()

function getErrorMessage( e: unknown, defaultMessage?: string ): string {
	const fallback =
		defaultMessage || _x( 'Unknown error', 'text', 'nelio-ab-testing' );

	if ( ! e || 'object' !== typeof e ) {
		return fallback;
	} //end if

	if ( 'errors' in e && 'object' === typeof e.errors ) {
		const errors = Array.isArray( e.errors )
			? e.errors
			: values( e.errors );

		if ( 'string' === typeof errors[ 0 ] ) {
			return errors[ 0 ] || fallback;
		} //end if

		const firstError =
			Array.isArray( errors[ 0 ] ) && 'string' === typeof errors[ 0 ][ 0 ]
				? errors[ 0 ][ 0 ]
				: undefined;
		if ( firstError ) {
			return firstError || fallback;
		} //end if
	} //end if

	if ( 'message' in e && 'string' === typeof e.message ) {
		return e.message || fallback;
	} //end if

	return fallback;
} //end getErrorMessage()
