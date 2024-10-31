/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, resolveSelect } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { createErrorNotice } from '@nab/utils';
import type { CloudResults, ExperimentId } from '@nab/types';

/**
 * Internal dependencies
 */
import { store as NAB_DATA } from '../../../store';
import { processResult } from '../../utils';

export async function getExperimentResults(
	id: ExperimentId
): Promise< void > {
	try {
		const experiment = await resolveSelect( NAB_DATA ).getExperiment( id );
		if ( ! experiment ) {
			return;
		} //end if

		const data = await apiFetch< CloudResults >( {
			path: `/nab/v1/experiment/${ id }/result`,
		} );

		const result = processResult( data, experiment );
		await dispatch( NAB_DATA ).receiveExperimentResult( id, result );
	} catch ( error ) {
		await createErrorNotice(
			error,
			sprintf(
				/* translators: test id */
				_x(
					'Unable to retrieve results in test %d.',
					'text',
					'nelio-ab-testing'
				),
				id
			)
		);
	} //end try
} //end getExperimentResults()

export async function getPageViews( id: ExperimentId ): Promise< void > {
	await resolveSelect( NAB_DATA ).getExperimentResults( id );
} //end getPageViews()

export async function getAlternativePageViews(
	id: ExperimentId
): Promise< void > {
	await resolveSelect( NAB_DATA ).getExperimentResults( id );
} //end getAlternativePageViews()

export async function getDaysRunning( id: ExperimentId ): Promise< void > {
	await resolveSelect( NAB_DATA ).getExperimentResults( id );
} //end getDaysRunning()

export async function getExperimentResultsStatus(
	id: ExperimentId
): Promise< void > {
	await resolveSelect( NAB_DATA ).getExperimentResults( id );
} //end getExperimentResultsStatus()

export async function getConversionRatesOfAlternativesInGoal(
	id: ExperimentId
): Promise< void > {
	await resolveSelect( NAB_DATA ).getExperimentResults( id );
} //end getConversionRatesOfAlternativesInGoal()
