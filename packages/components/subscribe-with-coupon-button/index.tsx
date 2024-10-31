/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NAB_DATA } from '@nab/data';
import {
	hasSubscriptionPromo,
	getSubscribeLabel,
	getSubscribeLink,
} from '@nab/utils';

/**
 * Internal dependencies
 */
import './style.scss';

export type SubscribeWithCouponButtonProps = {
	readonly className?: string;
};

export const SubscribeWithCouponButton = ( {
	className = '',
}: SubscribeWithCouponButtonProps ): JSX.Element | null => {
	const today = useSelect( ( select ) => select( NAB_DATA ).getToday() );
	const hasPromo = hasSubscriptionPromo( today );
	const isSubscribed = useSelect(
		( select ) => !! select( NAB_DATA ).getPluginSetting( 'subscription' )
	);

	if ( isSubscribed || ! hasPromo ) {
		return null;
	} //end if

	return (
		<a
			className={ `nab-subscribe-with-coupon-button ${ className } components components-button is-secondary dashicons-before dashicons-buddicons-groups` }
			href={ getSubscribeLink( today ) }
			target="_blank"
			rel="noreferrer"
		>
			{ getSubscribeLabel( today ) }
		</a>
	);
};
