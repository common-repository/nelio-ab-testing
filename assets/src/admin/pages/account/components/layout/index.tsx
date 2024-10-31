/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import type { SiteId } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';

import { Plan } from '../plan';
import { AccountInfo } from '../account-info';
import { Sites } from '../sites';
import { Billing } from '../billing';
import { LoadingModal } from '../loading-modal';

export type LayoutProps = {
	readonly siteId: SiteId;
};

export const Layout = ( { siteId }: LayoutProps ): JSX.Element => (
	<div className="nab-account-container">
		<Plan siteId={ siteId } />
		<AccountInfo />
		<Sites />
		<Billing />
		<LoadingModal />
	</div>
);
