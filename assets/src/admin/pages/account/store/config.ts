import { FastSpringProductId, License, SubscriptionId } from '@nab/types';
import type { State } from './types';

export const INIT_STATE: State = {
	account: {
		currency: 'USD',
		deactivationDate: '',
		email: '',
		firstname: '',
		fullname: '',
		isAgency: false,
		lastname: '',
		license: '' as License,
		mode: 'free',
		nextChargeDate: '',
		nextChargeTotal: '',
		period: 'month',
		photo: '',
		plan: 'free',
		productDisplay: '',
		productId: '' as FastSpringProductId,
		quota: 500,
		quotaExtra: 0,
		quotaPerMonth: 0,
		sitesAllowed: 1,
		startDate: '',
		state: 'active',
		subscription: '' as SubscriptionId,
		addons: [],
		addonDetails: {},
		urlToManagePayments: '',
	},

	invoices: [],
	sites: [],

	isPageLocked: false,
	isAgencyFullViewEnabled: false,
};
