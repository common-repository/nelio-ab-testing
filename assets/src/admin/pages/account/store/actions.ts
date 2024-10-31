/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type { Account, Site, Invoice, SiteId } from '@nab/types';

export type Action =
	| LockPage
	| UnlockPage
	| EnableAgencyFullView
	| ReceiveAccount
	| ReceiveInvoices
	| ReceiveSites
	| RemoveSiteAfterUnlink;

export function lock(): LockPage {
	return {
		type: 'LOCK_PAGE',
	};
} //end lock()

export function unlock(): UnlockPage {
	return {
		type: 'UNLOCK_PAGE',
	};
} //end unlock()

export function enableAgencyFullView(): EnableAgencyFullView {
	return {
		type: 'ENABLE_AGENCY_FULL_VIEW',
	};
} //end enableAgencyFullView()

export function receiveAccount( account: Account ): ReceiveAccount {
	return {
		type: 'RECEIVE_ACCOUNT',
		account,
	};
} //end receiveAccount()

export function receiveSites(
	sites: Site | ReadonlyArray< Site >
): ReceiveSites {
	return {
		type: 'RECEIVE_SITES',
		sites: castArray( sites ),
	};
} //end receiveSites()

export function receiveInvoices(
	invoices: Invoice | ReadonlyArray< Invoice >
): ReceiveInvoices {
	return {
		type: 'RECEIVE_INVOICES',
		invoices: castArray( invoices ),
	};
} //end receiveInvoices()

export function removeSiteAfterUnlink( id: SiteId ): RemoveSiteAfterUnlink {
	return {
		type: 'UNLINK_SITE',
		id,
	};
} //end removeSiteAfterUnlink()

// ============
// HELPER TYPES
// ============

type ReceiveAccount = {
	readonly type: 'RECEIVE_ACCOUNT';
	readonly account: Account;
};

type ReceiveSites = {
	readonly type: 'RECEIVE_SITES';
	readonly sites: ReadonlyArray< Site >;
};

type ReceiveInvoices = {
	readonly type: 'RECEIVE_INVOICES';
	readonly invoices: ReadonlyArray< Invoice >;
};

type RemoveSiteAfterUnlink = {
	readonly type: 'UNLINK_SITE';
	readonly id: SiteId;
};

type LockPage = {
	readonly type: 'LOCK_PAGE';
};

type UnlockPage = {
	readonly type: 'UNLOCK_PAGE';
};

type EnableAgencyFullView = {
	readonly type: 'ENABLE_AGENCY_FULL_VIEW';
};
