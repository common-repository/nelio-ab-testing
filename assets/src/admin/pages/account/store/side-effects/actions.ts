/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, select } from '@safe-wordpress/data';
/**
 * External dependencies
 */
import { createErrorNotice } from '@nab/utils';
import type { FastSpringProductId, Site, SiteId } from '@nab/types';

/**
 * Internal dependencies
 */
import { store as NAB_ACCOUNT } from '../../store';

/**
 * Connects the site with a subscription and reloads the page.
 *
 * @param {string} license Subscription license.
 */
export async function linkSite( license: string ): Promise< void > {
	try {
		await dispatch( NAB_ACCOUNT ).lock();

		await apiFetch( {
			path: `/nab/v1/site/subscription`,
			method: 'POST',
			data: { license },
		} );

		window.location.reload();
	} catch ( error ) {
		await dispatch( NAB_ACCOUNT ).unlock();
		await createErrorNotice( error );
	} //end try
} //end linkSite()

/**
 * Returns an action object used in signalling that a site is unlinked for the account.
 * If the site is the current one, reload the page instead of returning an action.
 *
 * @param {string} id Site id.
 */
export async function unlinkSite( id: SiteId ): Promise< void > {
	try {
		await dispatch( NAB_ACCOUNT ).lock();

		await apiFetch( {
			path: `/nab/v1/site/${ id }/subscription`,
			method: 'DELETE',
		} );

		const site = select( NAB_ACCOUNT ).getSite( id );

		if ( site?.isCurrentSite ) {
			window.location.reload();
			return;
		} //end if

		await dispatch( NAB_ACCOUNT ).unlock();
		await dispatch( NAB_ACCOUNT ).removeSiteAfterUnlink( id );
	} catch ( error ) {
		await dispatch( NAB_ACCOUNT ).unlock();
		await createErrorNotice( error );
	}
} //end unlinkSite()

/**
 * Cancels the subscription and reloads the page.
 */
export async function cancelSubscription(): Promise< void > {
	try {
		await dispatch( NAB_ACCOUNT ).lock();

		const subscriptionId = select( NAB_ACCOUNT ).getSubscriptionId();
		await apiFetch( {
			path: `/nab/v1/subscription/${ subscriptionId }`,
			method: 'DELETE',
		} );

		window.location.reload();
	} catch ( error ) {
		await dispatch( NAB_ACCOUNT ).unlock();
		await createErrorNotice( error );
	}
} //end cancelSubscription()

/**
 * Uncancels the subscription and reloads the page.
 */
export async function uncancelSubscription(): Promise< void > {
	try {
		await dispatch( NAB_ACCOUNT ).lock();

		const subscriptionId = select( NAB_ACCOUNT ).getSubscriptionId();
		await apiFetch( {
			path: `/nab/v1/subscription/${ subscriptionId }/uncancel`,
			method: 'POST',
		} );

		window.location.reload();
	} catch ( error ) {
		await dispatch( NAB_ACCOUNT ).unlock();
		await createErrorNotice( error );
	}
} //end uncancelSubscription()

export async function upgradeSubscription(
	product: FastSpringProductId,
	extraQuotaUnits: number
): Promise< void > {
	try {
		await dispatch( NAB_ACCOUNT ).lock();

		const subscriptionId = select( NAB_ACCOUNT ).getSubscriptionId();
		await apiFetch( {
			path: `/nab/v1/subscription/${ subscriptionId }`,
			method: 'PUT',
			data: { product, extraQuotaUnits },
		} );

		window.location.reload();
	} catch ( error ) {
		await dispatch( NAB_ACCOUNT ).unlock();
		await createErrorNotice( error );
	}
} //end upgradeSubscription()

export async function limitSiteQuota(
	siteId: SiteId,
	maxMonthlyQuota: number
): Promise< void > {
	try {
		const subscription = select( NAB_ACCOUNT ).getSubscriptionId();
		const sites = select( NAB_ACCOUNT ).getSites( subscription );

		const site = await apiFetch< Partial< Site > >( {
			path: `/nab/v1/site/${ siteId }`,
			method: 'PUT',
			data: { maxMonthlyQuota },
		} );

		await dispatch( NAB_ACCOUNT ).receiveSites(
			sites.map( ( s ) =>
				s.id === site.id ? { ...s, ...site, maxMonthlyQuota } : s
			)
		);
	} catch ( error ) {
		await createErrorNotice( error );
	}
} //end limitSiteQuota()
