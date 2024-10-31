/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, resolveSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { createErrorNotice } from '@nab/utils';

/**
 * Internal dependencies
 */
import { store as NAB_DATA } from '../../../store';
import type { State } from '../../types';

export async function getProducts(): Promise< void > {
	try {
		const { currency, products, subscriptionId } = await apiFetch<
			State[ 'fastspring' ]
		>( {
			path: '/nab/v1/fastspring',
		} );
		await dispatch( NAB_DATA ).receiveFSCurrency( currency );
		await dispatch( NAB_DATA ).receiveFSProducts( products );
		await dispatch( NAB_DATA ).receiveFSSubscriptionId( subscriptionId );
	} catch ( error ) {
		await createErrorNotice(
			error,
			_x(
				'Error while retrieving NC products.',
				'text',
				'nelio-ab-testing'
			)
		);
		throw error;
	} //end try
} //end getProducts()

export const getCurrency = async (): Promise< void > =>
	void ( await resolveSelect( NAB_DATA ).getProducts() );

export const getSubscriptionId = async (): Promise< void > =>
	void ( await resolveSelect( NAB_DATA ).getProducts() );
