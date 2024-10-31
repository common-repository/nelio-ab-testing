/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import '@safe-wordpress/dom-ready';
import '@safe-wordpress/notices';
import { Popover, SlotFillProvider } from '@safe-wordpress/components';
import { render } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import type { SiteId } from '@nab/types';

/**
 * Internal dependencies
 */
import { renderHelp } from './help';

import { PageTitle } from './components/page-title';
import { AccountProvider } from './components/provider';
import { Layout } from './components/layout';

type Settings = {
	readonly isSubscribed: boolean;
	readonly siteId: SiteId;
};

export function initPage( id: string, settings: Settings ): void {
	const { siteId, isSubscribed } = settings;

	const content = document.getElementById( id );
	render(
		<SlotFillProvider>
			<PageTitle isSubscribed={ isSubscribed } siteId={ siteId } />
			<AccountProvider>
				<Layout siteId={ siteId } />
			</AccountProvider>
			<Popover.Slot />
		</SlotFillProvider>,
		content
	);

	renderHelp();
} //end initPage()
