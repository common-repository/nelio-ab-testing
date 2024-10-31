/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, resolveSelect, select } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { keyBy } from 'lodash';
import { createErrorNotice } from '@nab/utils';
import type { Alternative, AlternativeId, Experiment, Maybe } from '@nab/types';

/**
 * Internal dependencies
 */
import { store as NAB_DATA } from '../../../store';

/**
 * Stops the experiment in the database.
 */
export async function stopExperiment(): Promise< void > {
	const experimentId = select( NAB_DATA ).getPageAttribute(
		'editor/activeExperiment'
	);
	if ( ! experimentId ) {
		return;
	} //end if

	await dispatch( NAB_DATA ).setPageAttribute(
		'editor/isExperimentBeingStopped',
		true
	);

	let experiment: Maybe< Experiment >;
	try {
		experiment =
			await resolveSelect( NAB_DATA ).getExperiment( experimentId );
		if ( ! experiment ) {
			return;
		} //end if
	} catch ( e ) {
		await createErrorNotice( e );
		return;
	} //end try

	let stoppedExperiment: Experiment;
	try {
		stoppedExperiment = await apiFetch< Experiment >( {
			path: `/nab/v1/experiment/${ experimentId }/stop`,
			method: 'PUT',
		} );
	} catch ( e ) {
		await createErrorNotice(
			e,
			_x( 'Test can’t be stopped', 'text', 'nelio-ab-testing' )
		);
		await dispatch( NAB_DATA ).setPageAttribute(
			'editor/isExperimentBeingStopped',
			false
		);
		return;
	} //end try

	const newAlternatives = keyBy( stoppedExperiment.alternatives || [], 'id' );

	const newExperiment: Experiment = {
		...stoppedExperiment,
		links: {
			...stoppedExperiment.links,
			...experiment.links,
		},
		alternatives: ( experiment.alternatives || [] ).map(
			( alternative ) => ( {
				...alternative,
				links: updateLinksKeepingPreviewAndHeatmap(
					alternative,
					newAlternatives[ alternative.id ]
				),
			} )
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		) as any as Experiment[ 'alternatives' ],
	};

	await dispatch( NAB_DATA ).receiveExperiment(
		experiment.id,
		newExperiment
	);
	await dispatch( NAB_DATA ).setPageAttribute(
		'editor/isExperimentBeingStopped',
		false
	);
} //end stopExperiment()

/**
 * Pauses the experiment in the database.
 */
export async function pauseExperiment(): Promise< void > {
	const experimentId = select( NAB_DATA ).getPageAttribute(
		'editor/activeExperiment'
	);
	if ( ! experimentId ) {
		return;
	} //end if

	await dispatch( NAB_DATA ).setPageAttribute(
		'editor/isExperimentBeingPaused',
		true
	);

	try {
		await apiFetch( {
			path: `/nab/v1/experiment/${ experimentId }/pause`,
			method: 'PUT',
		} );
	} catch ( e ) {
		await createErrorNotice(
			e,
			_x( 'Test can’t be paused', 'text', 'nelio-ab-testing' )
		);
		await dispatch( NAB_DATA ).setPageAttribute(
			'editor/isExperimentBeingPaused',
			false
		);
		return;
	} //end if

	// phpcs:ignore
	window.location.href = select( NAB_DATA ).getAdminUrl( 'admin.php', {
		page: 'nelio-ab-testing-experiment-edit',
		experiment: experimentId,
	} );
} //end pauseExperiment()

/**
 * Applies the given alternative.
 *
 * @param {string} alternativeId the alternative to apply.
 */
export async function applyAlternative(
	alternativeId: AlternativeId
): Promise< void > {
	const experimentId = select( NAB_DATA ).getPageAttribute(
		'editor/activeExperiment'
	);
	if ( ! experimentId ) {
		return;
	} //end if

	await dispatch( NAB_DATA ).setPageAttribute(
		'editor/alternativeBeingApplied',
		alternativeId
	);

	let experiment: Experiment;
	try {
		experiment = await apiFetch( {
			path: `/nab/v1/experiment/${ experimentId }/apply/${ alternativeId }`,
			method: 'PUT',
		} );
	} catch ( e ) {
		await createErrorNotice(
			e,
			_x( 'Alternative can’t be applied', 'text', 'nelio-ab-testing' )
		);
		await dispatch( NAB_DATA ).setPageAttribute(
			'editor/alternativeBeingApplied',
			false
		);
		return;
	} //end if

	await dispatch( NAB_DATA ).changeLastAppliedAlternative(
		experiment.id,
		alternativeId
	);
	await dispatch( NAB_DATA ).setPageAttribute(
		'editor/alternativeBeingApplied',
		false
	);
} //end applyAlternative()

/**
 * Changes the public result status of the experiment in the database.
 * @param status
 */
export async function setPublicResultStatus(
	status: boolean
): Promise< void > {
	const experimentId = select( NAB_DATA ).getPageAttribute(
		'editor/activeExperiment'
	);
	if ( ! experimentId ) {
		return;
	} //end if

	await dispatch( NAB_DATA ).setPageAttribute( 'isLocked', true );

	let changedStatus = status;
	try {
		changedStatus = await apiFetch< boolean >( {
			path: `/nab/v1/experiment/${ experimentId }/public-result-status`,
			method: 'PUT',
			data: { status },
		} );
	} catch ( e ) {
		await createErrorNotice(
			e,
			_x(
				'Public result’s status can’t be changed',
				'text',
				'nelio-ab-testing'
			)
		);
		await dispatch( NAB_DATA ).setPageAttribute( 'isLocked', false );
		return;
	} //end try

	await dispatch( NAB_DATA ).setPageAttribute( 'isLocked', false );
	await dispatch( NAB_DATA ).setPageAttribute(
		'editor/isReadOnlyActive',
		changedStatus
	);
} //end setPublicResultStatus()

// =======
// HELPERS
// =======

function updateLinksKeepingPreviewAndHeatmap(
	oldAlternative?: Alternative,
	newAlternative?: Alternative
): Maybe< Alternative[ 'links' ] > {
	if ( ! oldAlternative?.links ) {
		return;
	} //end if

	if ( ! newAlternative?.links ) {
		return oldAlternative.links;
	} //end if

	return {
		...newAlternative.links,
		heatmap: oldAlternative.links.heatmap,
		preview: oldAlternative.links.preview,
	};
} //end newAlternative()
