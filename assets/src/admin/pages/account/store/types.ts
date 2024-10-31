/**
 * External dependencies
 */
import type { Account, Invoice, Site } from '@nab/types';

export type State = {
	readonly account: Account;

	readonly invoices: ReadonlyArray< Invoice >;
	readonly sites: ReadonlyArray< Site >;

	readonly isPageLocked: boolean;
	readonly isAgencyFullViewEnabled: boolean;
};
