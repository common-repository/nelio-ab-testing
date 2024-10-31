/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import type { Experiment, ExperimentId } from '@nab/types';

/**
 * Internal dependencies
 */
import { store as NAB_DATA } from '../../../store';

export async function getExperiment( id: ExperimentId ): Promise< void > {
	try {
		const experiment = await apiFetch< Experiment >( {
			path: `/nab/v1/experiment/${ id }`,
		} );
		await dispatch( NAB_DATA ).receiveExperiment( id, experiment );
	} catch ( error ) {
		const message = error instanceof Error ? error.message : 'unknown';
		// eslint-disable-next-line
		console.warn(
			`Unable to retrieve experiment ${ id }. Error: ${ message }.`
		);
	} //end try
} //end getExperiment()
