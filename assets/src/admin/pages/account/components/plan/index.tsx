/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, ExternalLink } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { createInterpolateElement, useState } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import {
	QuotaMeter,
	QuotaPurchasePopover,
	ConfirmationDialog,
} from '@nab/components';
import { store as NAB_DATA } from '@nab/data';
import { formatI18nDate } from '@nab/date';
import { getSubscribeLabel, getSubscribeLink } from '@nab/utils';
import type { SiteId } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { AgencyPlan } from './agency-plan';

import { AddonsPopover } from '../addons-popover';
import { LicensePopover } from '../license-popover';
import { UpgradePopover } from '../upgrade-popover';
import { store as NAB_ACCOUNT } from '../../store';

export type PlanProps = {
	readonly siteId: SiteId;
};

export const Plan = ( { siteId }: PlanProps ): JSX.Element => {
	const quota = useSubscriptionQuota();
	const isAgencySummary = useIsAgencySummary();

	if ( isAgencySummary ) {
		return <AgencyPlan siteId={ siteId } />;
	} //end if

	return (
		<div className="nab-account-container__box nab-plan">
			<div className="nab-plan__content">
				<Title />
				<Explanation />
				<QuotaMeter
					disabled={ quota.isLoading }
					subscriptionQuota={ quota.data }
				/>
			</div>
			<Actions />
		</div>
	);
};

// ============
// HELPER VIEWS
// ============

const Title = () => {
	const { period } = usePeriodAndPlan();
	const productDisplay = useProductDisplay();
	const state = useSubscriptionState();
	const isFree = useIsFree();

	const periodLabel =
		'month' === period
			? _x( 'Monthly', 'text', 'nelio-ab-testing' )
			: _x( 'Yearly', 'text', 'nelio-ab-testing' );

	return (
		<h3 className="nab-plan__title">
			{ productDisplay }
			<span className="nab-plan__period">
				{ isFree
					? _x( 'Free', 'text', 'nelio-ab-testing' )
					: periodLabel }
			</span>

			{ 'canceled' === state && (
				<span className="nab-plan__state">
					{ _x(
						'Canceled',
						'text (account state)',
						'nelio-ab-testing'
					) }
				</span>
			) }
		</h3>
	);
};

const Explanation = () => {
	const isFree = useIsFree();
	const isInvitation = useIsInvitation();
	const state = useSubscriptionState();
	const isSubscriptionDeprecated = useIsSubscriptionDeprecated();
	const deactivationDate = useDeactivationDate();
	const nextChargeDate = useNextChargeDate();
	const nextChargeTotal = useNextChargeTotal();

	if ( isFree ) {
		return (
			<div className="nab-plan__renewal">
				{ _x(
					'You are using the free version of Nelio A/B Testing.',
					'text',
					'nelio-ab-testing'
				) }
			</div>
		);
	} //end if

	if ( isInvitation ) {
		return (
			<div className="nab-plan__renewal">
				{ createInterpolateElement(
					sprintf(
						/* translators: 1 -> price and currency; 2 -> date */
						_x(
							'You’re currently using a premium version of Nelio A/B Testing for free. This invitation will end on %s and the plugin will be downgraded to a free plan. Please consider subscribing before that.',
							'user',
							'nelio-ab-testing'
						),
						`<date>${ formatI18nDate( nextChargeDate ) }</date>`
					),
					{
						date: <span className="nab-plan__renewal-date" />,
					}
				) }
			</div>
		);
	} //end if

	if ( 'canceled' === state ) {
		return (
			<div className="nab-plan__renewal">
				{ createInterpolateElement(
					sprintf(
						/* translators: date */
						_x(
							'Your subscription will end on %s.',
							'text',
							'nelio-ab-testing'
						),
						`<date>${ formatI18nDate( deactivationDate ) }</date>`
					),
					{
						date: <span className="nab-plan__renewal-date" />,
					}
				) }
			</div>
		);
	} //end if

	if ( isSubscriptionDeprecated ) {
		return (
			<div className="nab-plan__renewal">
				{ createInterpolateElement(
					_x(
						'<link>Contact us</link> to get additional features to manage your account.',
						'text',
						'nelio-ab-testing'
					),
					{
						link: (
							// eslint-disable-next-line
							<a href="mailto:support@neliosoftware.com" />
						),
					}
				) }
			</div>
		);
	} //end if

	return (
		<div className="nab-plan__renewal">
			{ createInterpolateElement(
				sprintf(
					/* translators: 1 -> price and currency; 2 -> date */
					_x(
						'Next charge will be %1$s on %2$s.',
						'text',
						'nelio-ab-testing'
					),
					`<money>${ nextChargeTotal }</money>`,
					`<date>${ formatI18nDate( nextChargeDate ) }</date>`
				),
				{
					date: <span className="nab-plan__renewal-date" />,
					money: <span className="nab-plan__renewal-amount" />,
				}
			) }
		</div>
	);
};

const Actions = () => {
	const isFree = useIsFree();
	const isInvitation = useIsInvitation();
	const state = useSubscriptionState();
	const isSubscriptionDeprecated = useIsSubscriptionDeprecated();

	if ( isSubscriptionDeprecated ) {
		return (
			<div className="nab-plan__actions">
				<BuyMoreQuotaLink />
				<UpgradeLink />
			</div>
		);
	} //end if

	if ( isFree || isInvitation ) {
		return (
			<div className="nab-plan__actions">
				<AddLicenseAction />
				<SubscribeAction />
			</div>
		);
	} //end if

	if ( 'canceled' === state ) {
		return (
			<div className="nab-plan__actions">
				<ReactivateSubscriptionAction />
			</div>
		);
	} //end if

	return (
		<div className="nab-plan__actions nab-plan__actions--separated">
			<CancelSubscriptionAction />
			<div className="nab-plan__actions-group">
				<BuyMoreQuotaAction />
				<AddonsAction />
				<UpgradeAction />
			</div>
		</div>
	);
};

const AddLicenseAction = () => {
	const [ isPopoverVisible, setPopoverVisible ] = useState( false );

	return (
		<span className="nab-plan__action-container">
			<Button
				variant="secondary"
				className="nab-plan__action"
				onClick={ () => setPopoverVisible( true ) }
			>
				{ _x( 'Use License', 'command', 'nelio-ab-testing' ) }
			</Button>
			<LicensePopover
				placement="bottom"
				onFocusOutside={ () => setPopoverVisible( false ) }
				onClick={ () => setPopoverVisible( false ) }
				isOpen={ isPopoverVisible }
			/>
		</span>
	);
};

const SubscribeAction = () => {
	const today = useToday();

	return (
		<ExternalLink
			className="nab-plan__action components-button is-primary"
			href={ getSubscribeLink( today ) }
		>
			{ getSubscribeLabel( today ) }
		</ExternalLink>
	);
};

const BuyMoreQuotaLink = () => {
	const { plan } = usePeriodAndPlan();

	if ( 'enterprise' === plan ) {
		return null;
	} //end if

	return (
		<ExternalLink
			className="nab-plan__action components-button is-secondary"
			href="mailto:support@neliosoftware.com?subject=Buy%20Quota"
		>
			{ _x( 'Buy More Quota', 'command', 'nelio-ab-testing' ) }
		</ExternalLink>
	);
};

const UpgradeLink = () => {
	return (
		<ExternalLink
			className="nab-plan__action components-button is-primary"
			href="mailto:support@neliosoftware.com?subject=Upgrade%20Subscription"
		>
			{ _x( 'Upgrade Subscription', 'command', 'nelio-ab-testing' ) }
		</ExternalLink>
	);
};

const CancelSubscriptionAction = () => {
	const [ isDialogOpen, setDialogOpen ] = useState( false );
	const { cancelSubscription } = useDispatch( NAB_ACCOUNT );
	const nextChargeDate = useNextChargeDate();

	return (
		<>
			<Button
				isDestructive
				className="nab-plan__action"
				onClick={ () => setDialogOpen( true ) }
			>
				{ _x( 'Cancel Subscription', 'command', 'nelio-ab-testing' ) }
			</Button>
			<ConfirmationDialog
				title={ _x(
					'Cancel Subscription?',
					'text',
					'nelio-ab-testing'
				) }
				text={ sprintf(
					/* translators: a date */
					_x(
						'Canceling your subscription will cause it not to renew. If you cancel your subscrition, it will continue until %s. Then, the subscription will expire and will not be invoiced again. Do you want to cancel your subscription?',
						'user',
						'nelio-ab-testing'
					),
					formatI18nDate( nextChargeDate )
				) }
				isDestructive
				confirmLabel={ _x(
					'Cancel Subscription',
					'command',
					'nelio-ab-testing'
				) }
				cancelLabel={ _x( 'Back', 'command', 'nelio-ab-testing' ) }
				onCancel={ () => setDialogOpen( false ) }
				onConfirm={ () => {
					setDialogOpen( false );
					void cancelSubscription();
				} }
				isOpen={ isDialogOpen }
			/>
		</>
	);
};

const BuyMoreQuotaAction = () => {
	const [ isPopoverVisible, setPopoverVisible ] = useState( false );
	const { plan } = usePeriodAndPlan();

	if ( 'enterprise' === plan ) {
		return null;
	} //end if

	return (
		<div>
			<Button
				variant="secondary"
				className="nab-plan__action"
				onClick={ () => setPopoverVisible( ! isPopoverVisible ) }
			>
				{ _x( 'Buy More Quota', 'command', 'nelio-ab-testing' ) }
			</Button>
			<QuotaPurchasePopover
				placement="bottom"
				onClick={ () => setPopoverVisible( false ) }
				onFocusOutside={ () => setPopoverVisible( false ) }
				isOpen={ isPopoverVisible }
			/>
		</div>
	);
};

const AddonsAction = () => {
	const [ isPopoverVisible, setPopoverVisible ] = useState( false );
	return (
		<div>
			<Button
				variant="secondary"
				className="nab-plan__action"
				onClick={ () => setPopoverVisible( ! isPopoverVisible ) }
			>
				{ _x( 'Addons', 'text', 'nelio-ab-testing' ) }
			</Button>
			<AddonsPopover
				placement="bottom"
				onFocusOutside={ () => setPopoverVisible( false ) }
				isOpen={ isPopoverVisible }
			/>
		</div>
	);
};

const UpgradeAction = () => {
	const [ isPopoverVisible, setPopoverVisible ] = useState( false );

	return (
		<div>
			<Button
				variant="primary"
				className="nab-plan__action"
				onClick={ () => setPopoverVisible( ! isPopoverVisible ) }
			>
				{ _x( 'Upgrade Subscription', 'command', 'nelio-ab-testing' ) }
			</Button>
			<UpgradePopover
				placement="bottom"
				onClick={ () => setPopoverVisible( false ) }
				onFocusOutside={ () => setPopoverVisible( false ) }
				isOpen={ isPopoverVisible }
			/>
		</div>
	);
};

const ReactivateSubscriptionAction = () => {
	const [ isDialogOpen, setDialogOpen ] = useState( false );
	const { uncancelSubscription } = useDispatch( NAB_ACCOUNT );
	const nextChargeDate = useNextChargeDate();

	return (
		<>
			<Button
				variant="primary"
				className="nab-plan__action"
				onClick={ () => setDialogOpen( true ) }
			>
				{ _x(
					'Reactivate Subscription',
					'command',
					'nelio-ab-testing'
				) }
			</Button>
			<ConfirmationDialog
				title={ _x(
					'Reactivate Subscription?',
					'text',
					'nelio-ab-testing'
				) }
				text={ sprintf(
					/* translators: a date */
					_x(
						'Reactivating your subscription will cause it to renew on %s. Do you want to reactivate your subscription?',
						'user',
						'nelio-ab-testing'
					),
					formatI18nDate( nextChargeDate )
				) }
				confirmLabel={ _x(
					'Reactivate Subscription',
					'command',
					'nelio-ab-testing'
				) }
				cancelLabel={ _x( 'Back', 'command', 'nelio-ab-testing' ) }
				onCancel={ () => setDialogOpen( false ) }
				onConfirm={ () => {
					setDialogOpen( false );
					void uncancelSubscription();
				} }
				isOpen={ isDialogOpen }
			/>
		</>
	);
};

// =====
// HOOKS
// =====

const usePeriodAndPlan = () =>
	useSelect( ( select ) => ( {
		period: select( NAB_ACCOUNT ).getPeriod(),
		plan: select( NAB_ACCOUNT ).getPlan(),
	} ) );

const useSubscriptionState = () =>
	useSelect( ( select ) => select( NAB_ACCOUNT ).getState() );

const useIsSubscriptionDeprecated = () =>
	useSelect( ( select ) => select( NAB_ACCOUNT ).isSubscriptionDeprecated() );

const useIsFree = () =>
	useSelect( ( select ) => 'free' === select( NAB_ACCOUNT ).getMode() );

const useIsInvitation = () =>
	useSelect( ( select ) => 'invitation' === select( NAB_ACCOUNT ).getMode() );

const useIsAgencySummary = () =>
	useSelect(
		( select ) =>
			select( NAB_ACCOUNT ).isAgency() &&
			! select( NAB_ACCOUNT ).isAgencyFullViewEnabled()
	);

const useProductDisplay = () =>
	useSelect( ( select ) => select( NAB_ACCOUNT ).getProductDisplay() );

const useDeactivationDate = () =>
	useSelect(
		( select ) =>
			select( NAB_ACCOUNT ).getDeactivationDate() ||
			select( NAB_DATA ).getToday()
	);

const useNextChargeDate = () =>
	useSelect(
		( select ) =>
			select( NAB_ACCOUNT ).getNextChargeDate() ||
			select( NAB_DATA ).getToday()
	);

const useNextChargeTotal = () =>
	useSelect( ( select ) => select( NAB_ACCOUNT ).getNextChargeTotal() );

const useToday = () => useSelect( ( select ) => select( NAB_DATA ).getToday() );

const useSubscriptionQuota = () =>
	useSelect( ( select ) => ( {
		data: select( NAB_ACCOUNT ).getSubscriptionQuota(),
		isLoading: ! select( NAB_ACCOUNT ).hasFinishedResolution(
			'getSubscriptionQuota'
		),
	} ) );
