/**
 * External dependencies
 */
import { find } from 'lodash';
import type {
	Account,
	AccountMode,
	FastSpringProduct,
	Invoice,
	License,
	Maybe,
	Quota,
	Site,
	SiteId,
	SubscriptionId,
	SubscriptionPlan,
	SubscriptionPeriod,
	SubscriptionState,
	FastSpringProductId,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { State } from './types';

export function getAccount( state: State ): Account {
	return state.account;
} //end getAccount()

export function getSites(
	state: State,
	id?: SubscriptionId
): ReadonlyArray< Site > {
	if ( ! id ) {
		return [];
	} //end if
	return state.sites;
} //end getSites()

export function getSite( state: State, id: SiteId ): Maybe< Site > {
	return find( state.sites, { id } );
} //end getSites()

export function getInvoices(
	state: State,
	id: SubscriptionId
): ReadonlyArray< Invoice > {
	if ( ! id ) {
		return [];
	} //end if
	return state.invoices;
} //end getInvoices()

export function getSubscriptionQuota( state: State ): Quota {
	const { quota, quotaExtra, quotaPerMonth } = state.account;

	const availableQuota = quota + quotaExtra;
	const percentage = Math.floor(
		( 100 * ( availableQuota + 0.1 ) ) / quotaPerMonth
	);

	return {
		mode: 'subscription',
		availableQuota,
		percentage,
	};
} //end getSubscriptionId()

export function getSubscriptionId( state: State ): SubscriptionId {
	return state.account.subscription;
} //end getSubscriptionId()

export function getSubscriptionAddons(
	state: State
): ReadonlyArray< FastSpringProductId > {
	return state.account.addons || [];
} //end getSubscriptionAddons()

export function isSubscriptionDeprecated( state: State ): boolean {
	return !! state.account.subscription.startsWith( 'OL' );
} //end isSubscriptionDeprecated()

export function getFullname( state: State ): string {
	return state.account.fullname;
} //end getFullname()

export function getFirstname( state: State ): string {
	return state.account.firstname;
} //end getFirstname()

export function getLastname( state: State ): string {
	return state.account.lastname;
} //end getLastname()

export function getEmail( state: State ): string {
	return state.account.email;
} //end getEmail()

export function getStartDate( state: State ): string {
	return state.account.startDate;
} //end getStartDate()

export function getSubscriptionProduct(
	state: State
): FastSpringProduct[ 'id' ] {
	return state.account.productId;
} //end getSubscriptionProduct()

export function getPlan( state: State ): 'free' | SubscriptionPlan {
	return state.account.plan;
} //end getPlan()

export function getLicense( state: State ): License {
	return state.account.license;
} //end getLicense()

export function getPhoto( state: State ): string {
	return state.account.photo;
} //end getPhoto()

export function getProductDisplay( state: State ): string {
	return state.account.productDisplay;
} //end getProductDisplay()

export function getMode( state: State ): AccountMode {
	return state.account.mode;
} //end getMode()

export function getPeriod( state: State ): SubscriptionPeriod {
	return state.account.period;
} //end getPeriod()

export function getExtraQuotaUnits( state: State ): number {
	return (
		state.account.addonDetails[
			'nab-pageviews-monthly' as FastSpringProductId
		] ??
		state.account.addonDetails[
			'nab-pageviews-yearly' as FastSpringProductId
		] ??
		0
	);
} //end getExtraQuotaUnits()

export function getState( state: State ): SubscriptionState {
	return state.account.state;
} //end getState()

export function getDeactivationDate( state: State ): string {
	return state.account.deactivationDate;
} //end getDeactivationDate()

export function getNextChargeDate( state: State ): string {
	return state.account.nextChargeDate;
} //end getNextChargeDate()

export function getNextChargeTotal( state: State ): string {
	return state.account.nextChargeTotal;
} //end getNextChargeTotal()

export function getSitesAllowed( state: State ): number {
	return state.account.sitesAllowed;
} //end getSitesAllowed()

export function getCurrency( state: State ): string {
	return state.account.currency;
} //end getCurrency()

export function getUrlToManagePayments( state: State ): string {
	return state.account.urlToManagePayments;
} //end getUrlToManagePayments()

export function isAgency( state: State ): boolean {
	return !! state.account.isAgency;
} //end isAgency()

export function isLocked( state: State ): boolean {
	return !! state.isPageLocked;
} //end isLocked()

export function isAgencyFullViewEnabled( state: State ): boolean {
	return isAgency( state ) && !! state.isAgencyFullViewEnabled;
} //end isAgencyFullViewEnabled()
