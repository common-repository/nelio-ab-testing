/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, select } from '@safe-wordpress/data';
/**
 * External dependencies
 */
import { createErrorNotice } from '@nab/utils';

/**
 * Internal dependencies
 */
import { store as NAB_DATA } from '../../../store';

export async function purchaseQuota(
	quantity: number,
	currency: string
): Promise< void > {
	const subscriptionId = select( NAB_DATA ).getSubscriptionId();
	if ( ! subscriptionId ) {
		return;
	} //end if

	try {
		await dispatch( NAB_DATA ).lock();

		await apiFetch( {
			path: `/nab/v1/subscription/${ subscriptionId }/quota`,
			method: 'POST',
			data: {
				quantity,
				currency,
			},
		} );

		window.location.reload();
	} catch ( error ) {
		await dispatch( NAB_DATA ).unlock();
		await createErrorNotice( error );
	}
} //end purchaseQuota()
