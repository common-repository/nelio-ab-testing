/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import type { Invoice as InvoiceProps } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';

export const Invoice = ( {
	invoiceUrl,
	reference,
	chargeDate,
	isRefunded,
	subtotalDisplay,
}: InvoiceProps ): JSX.Element => (
	<tr className="nab-invoice">
		<td className="nab-invoice__reference">
			<a
				href={ invoiceUrl }
				className="nab-invoice__link"
				target="_blank"
				rel="noopener noreferrer"
			>
				{ reference }
			</a>
		</td>

		<td className="nab-invoice__date">{ chargeDate }</td>

		<td className="nab-invoice__total">
			{ isRefunded && (
				<span className="nab-invoice__label">
					{ _x( '(Refunded)', 'text (invoice)', 'nelio-ab-testing' ) }
				</span>
			) }
			<span
				className={ classnames( 'nab-invoice__total-value', {
					'nab-invoice__total-value--refunded': isRefunded,
				} ) }
			>
				{ subtotalDisplay }
			</span>
		</td>
	</tr>
);
