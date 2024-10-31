/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { SiteId } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { ClipboardButton } from '@nab/components';

export type PageTitleProps = {
	readonly isSubscribed: boolean;
	readonly siteId: SiteId;
};

export const PageTitle = ( {
	isSubscribed,
	siteId,
}: PageTitleProps ): JSX.Element => (
	<h1 className="wp-heading-inline nelio-ab-testing-page-title">
		<span>
			{ isSubscribed
				? _x( 'Account Details', 'text', 'nelio-ab-testing' )
				: _x(
						'Upgrade to Nelio A/B Testing Premium',
						'user',
						'nelio-ab-testing'
				  ) }
		</span>
		<span className="nelio-ab-testing-page-title__support-key">
			<strong>
				{ _x( 'Support Key:', 'text', 'nelio-ab-testing' ) }
			</strong>
			<code>{ siteId }</code>
			<ClipboardButton text={ siteId } />
		</span>
	</h1>
);
