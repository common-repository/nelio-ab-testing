/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { ExternalLink, Spinner } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { Invoice } from '../invoice';
import './style.scss';

import { store as NAB_ACCOUNT } from '../../store';

export const Billing = (): JSX.Element | null => {
	const isVisible = useIsVisible();
	const isLoading = useIsLoading();
	const invoices = useInvoices();
	const urlToManagePayments = usePaymentsUrl();

	if ( ! isVisible ) {
		return null;
	} //end if

	return (
		<div className="nab-account-container__box nab-billing">
			<h3 className="nab-billing__title">
				{ _x( 'Billing History', 'text', 'nelio-ab-testing' ) }
				{ isLoading && <Spinner /> }
			</h3>

			{ ! isLoading && (
				<>
					<ExternalLink
						className="nab-billing__action"
						href={ urlToManagePayments }
					>
						{ _x( 'Manage Payments', 'user', 'nelio-ab-testing' ) }
					</ExternalLink>

					<table className="nab-billing__container">
						<thead>
							<tr>
								<th className="nab-billing__reference">
									{ _x(
										'Invoice Reference',
										'text (account, billing table title)',
										'nelio-ab-testing'
									) }
								</th>
								<th className="nab-billing__date">
									{ _x(
										'Date',
										'text (account, billing table title)',
										'nelio-ab-testing'
									) }
								</th>
								<th className="nab-billing__total">
									{ _x(
										'Total',
										'text (account, billing table title)',
										'nelio-ab-testing'
									) }
								</th>
							</tr>
						</thead>

						<tbody className="invoice-list">
							{ invoices.map( ( invoice ) => (
								<Invoice
									key={ invoice.reference }
									{ ...invoice }
								/>
							) ) }
						</tbody>
					</table>
				</>
			) }
		</div>
	);
};

// =====
// HOOKS
// =====

const useIsVisible = () =>
	useSelect( ( select ) => {
		const {
			getMode,
			isAgency,
			isAgencyFullViewEnabled,
			isSubscriptionDeprecated,
		} = select( NAB_ACCOUNT );

		const isSubscribed = getMode() === 'regular';
		const isDeprecated = isSubscriptionDeprecated();
		const isAgencySummary = isAgency() && ! isAgencyFullViewEnabled();
		return isSubscribed && ! isDeprecated && ! isAgencySummary;
	} );

const useIsLoading = () =>
	useSelect(
		( select ) =>
			! select( NAB_ACCOUNT ).hasFinishedResolution( 'getInvoices', [
				select( NAB_ACCOUNT ).getSubscriptionId(),
			] )
	);

const useInvoices = () =>
	useSelect( ( select ) =>
		select( NAB_ACCOUNT ).getInvoices(
			select( NAB_ACCOUNT ).getSubscriptionId()
		)
	);

const usePaymentsUrl = () =>
	useSelect( ( select ) => select( NAB_ACCOUNT ).getUrlToManagePayments() );
