/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, ExternalLink } from '@safe-wordpress/components';
import { useState } from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies.
 */
import { store as NAB_DATA } from '@nab/data';
import { getSubscribeLabel, getSubscribeLink } from '@nab/utils';

/**
 * Internal dependencies
 */
import './style.scss';

import { QuotaPurchasePopover } from '../quota-purchase-popover';

export type TitleActionProps = {
	readonly isSubscribed?: boolean;
	readonly isDeprecated?: boolean;
};

export const TitleAction = ( {
	isSubscribed,
	isDeprecated,
}: TitleActionProps ): JSX.Element | null => {
	const today = useToday();
	const canPurchaseQuota = useCanPurchaseQuota();
	const [ isQuotaVisible, showQuota ] = useState( false );

	if ( isDeprecated ) {
		return null;
	} //end if

	if ( ! canPurchaseQuota ) {
		return null;
	} //end if

	if ( ! isSubscribed ) {
		return (
			<ExternalLink
				className="nab-title-action page-title-action nab-subscribe-title-action"
				href={ getSubscribeLink( today ) }
			>
				{ getSubscribeLabel( today ) }
			</ExternalLink>
		);
	} // end if

	return (
		<>
			<Button
				className="page-title-action"
				onClick={ () => showQuota( true ) }
				style={ { height: 'auto' } }
			>
				{ _x( 'Buy More Quota', 'command', 'nelio-ab-testing' ) }
			</Button>
			<QuotaPurchasePopover
				placement="bottom"
				onClick={ () => showQuota( false ) }
				onFocusOutside={ () => showQuota( false ) }
				isOpen={ isQuotaVisible }
			/>
		</>
	);
};

// =====
// HOOKS
// =====

const useToday = () => useSelect( ( select ) => select( NAB_DATA ).getToday() );

const useCanPurchaseQuota = () =>
	useSelect( ( select ) => {
		return (
			! select( NAB_DATA ).isSubscribedTo( 'enterprise' ) &&
			! select( NAB_DATA ).getPluginSetting(
				'areSubscriptionControlsDisabled'
			) &&
			select( NAB_DATA ).hasCapability( 'manage_nab_account' ) &&
			!! select( NAB_DATA ).getSubscriptionId()
		);
	} );
