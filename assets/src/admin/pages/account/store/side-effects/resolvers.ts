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
import type { Account, Invoice, Site, SubscriptionId } from '@nab/types';

/**
 * Internal dependencies
 */
import { store as NAB_ACCOUNT } from '../../store';

export async function getAccount(): Promise< void > {
	try {
		const account = await apiFetch< Account >( {
			path: '/nab/v1/account',
		} );
		await dispatch( NAB_ACCOUNT ).receiveAccount( account );
	} catch ( error ) {
		await createErrorNotice(
			error,
			_x( 'Error while accessing site info.', 'text', 'nelio-ab-testing' )
		);
		throw error;
	} //end try
} //end getAccount()

export async function getSubscriptionQuota(): Promise< void > {
	await resolveSelect( NAB_ACCOUNT ).getAccount();
} //end getSubscriptionQuota()

export async function getSites( id: SubscriptionId ): Promise< void > {
	if ( ! id ) {
		return;
	} //end if

	try {
		const sites = await apiFetch< ReadonlyArray< Site > >( {
			path: `/nab/v1/subscription/${ id }/sites`,
		} );
		await dispatch( NAB_ACCOUNT ).receiveSites( sites );
	} catch ( error ) {
		await createErrorNotice(
			error,
			sprintf(
				/* translators: subscription id */
				_x(
					'Error while accessing sites in subscription %s.',
					'text',
					'nelio-ab-testing'
				),
				id
			)
		);
		throw error;
	} //end try
} //end getSites()

export async function getInvoices( id: SubscriptionId ): Promise< void > {
	if ( ! id ) {
		return;
	} //end if

	try {
		const invoices = await apiFetch< ReadonlyArray< Invoice > >( {
			path: `/nab/v1/subscription/${ id }/invoices`,
		} );
		await dispatch( NAB_ACCOUNT ).receiveInvoices( invoices );
	} catch ( error ) {
		await createErrorNotice(
			error,
			sprintf(
				/* translators: subscription id */
				_x(
					'Error while accessing invoices in subscription %s.',
					'text',
					'nelio-ab-testing'
				),
				id
			)
		);
		throw error;
	} //end try
} //end getInvoices()
