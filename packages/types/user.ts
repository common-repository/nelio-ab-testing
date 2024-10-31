/**
 * External dependencies
 */
import type { Brand } from 'ts-brand';

/**
 * Internal dependencies
 */
import type { Url } from './utils';

// =======
// ACCOUNT
// =======

export type Account = {
	readonly currency: string;
	readonly deactivationDate: string;
	readonly email: string;
	readonly firstname: string;
	readonly fullname: string;
	readonly isAgency?: boolean;
	readonly lastname: string;
	readonly license: License;
	readonly mode: AccountMode;
	readonly nextChargeDate: string;
	readonly nextChargeTotal: string;
	readonly period: SubscriptionPeriod;
	readonly photo: string;
	readonly plan: 'free' | SubscriptionPlan;
	readonly productDisplay: string;
	readonly productId: FastSpringProductId;
	readonly quota: number;
	readonly quotaExtra: number;
	readonly quotaPerMonth: number;
	readonly sitesAllowed: number;
	readonly startDate: string;
	readonly state: SubscriptionState;
	readonly subscription: SubscriptionId;
	readonly addons: ReadonlyArray< FastSpringProductId >;
	readonly addonDetails: Partial< Record< FastSpringProductId, number > >;
	readonly urlToManagePayments: string;
};

export type AccountMode = 'regular' | 'free' | 'invitation';

export type SubscriptionId = Brand< string, 'SubscriptionId' >;

export type SubscriptionState = 'active' | 'canceled' | 'deactivated';

export type License = Brand< string, 'License' >;

// =====
// PLANS
// =====

export type SubscriptionPlan = 'basic' | 'professional' | 'enterprise';

export type SubscriptionPeriod = 'month' | 'year';

// =====
// SITES
// =====

export type SiteId = Brand< string, 'SiteId' >;

export type Site = {
	readonly id: SiteId;
	readonly isCurrentSite?: boolean;
	readonly url: string;
	readonly actualUrl?: Url;
	readonly maxMonthlyQuota: number;
	readonly usedMonthlyQuota: number;
};

// ========
// INVOICES
// ========

export type Invoice = {
	readonly invoiceUrl: Url;
	readonly reference: string;
	readonly chargeDate: string;
	readonly isRefunded: boolean;
	readonly subtotalDisplay: string;
};

// =====
// Quota
// =====

export type Quota = {
	readonly mode: 'site' | 'subscription';
	readonly availableQuota: number;
	readonly percentage: number;
};

// ===========
// FS PRODUCTS
// ===========

export type Currency = string;

export type FastSpringProductId = Brand< string, 'FastSpringProductId' >;

export type FastSpringProduct = {
	readonly id: FastSpringProductId;
	readonly price: Record< Currency, number >;
	readonly quantityDiscounts: Record< string, number >;
	readonly upgradeableFrom: ReadonlyArray< FastSpringProductId >;
	readonly displayName: FSLocalizedString;
	readonly description: FSLocalizedString;
	readonly attributes?: {
		readonly pageviews?: string;
	};
	readonly isSubscription?: boolean;
	readonly period?: 'month' | 'year';
	readonly isAddon?: boolean;
	readonly allowedAddons?: ReadonlyArray< FastSpringProductId >;
};

export type FSLocalizedString = {
	readonly es: string;
	readonly en: string;
};
