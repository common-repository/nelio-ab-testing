/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import '@safe-wordpress/dom-ready';
import { render } from '@safe-wordpress/element';
import { Popover, SlotFillProvider } from '@safe-wordpress/components';

/**
 * Internal dependencies
 */
import './style.scss';

import { DeactivationAction } from './components/deactivation-action';
import type { DeactivationActionProps } from './components/deactivation-action';

type Settings = DeactivationActionProps;

export function initPage( settings: Settings ): void {
	const { isSubscribed, cleanNonce, deactivationUrl } = settings;

	const wrapper = document.querySelector(
		'.nelio-ab-testing-deactivate-link'
	);
	if ( ! wrapper ) {
		return;
	} //end if

	render(
		<SlotFillProvider>
			<DeactivationAction
				isSubscribed={ isSubscribed }
				deactivationUrl={ deactivationUrl }
				cleanNonce={ cleanNonce }
			/>
			<Popover.Slot />
		</SlotFillProvider>,
		wrapper
	);
} //end initPage()
