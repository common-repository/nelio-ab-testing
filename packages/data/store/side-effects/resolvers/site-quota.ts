/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { createErrorNotice } from '@nab/utils';
import type { Quota } from '@nab/types';

/**
 * Internal dependencies
 */
import { store as NAB_DATA } from '../../../store';

export async function getQuota(): Promise< void > {
	try {
		const quota = await apiFetch< Quota >( {
			path: '/nab/v1/site/quota',
		} );
		await dispatch( NAB_DATA ).receiveSiteQuota( quota );
	} catch ( error ) {
		await createErrorNotice(
			error,
			_x( 'Unable to retrieve quota.', 'text', 'nelio-ab-testing' )
		);
		throw error;
	} //end try
} //end getQuota()
