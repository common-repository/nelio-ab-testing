/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	Button,
	ButtonGroup,
	Dashicon,
	ExternalLink,
	Popover,
	Spinner,
	TextControl,
} from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { createInterpolateElement, useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NAB_DATA } from '@nab/data';
import { numberFormat } from '@nab/i18n';
import { addFreeTracker } from '@nab/utils';

/**
 * Internal dependencies
 */
import './style.scss';

export type QuotaPurchasePopoverProps = {
	readonly isOpen: boolean;
	readonly placement: Popover.Props[ 'placement' ];
	readonly onClick: () => void;
	readonly onFocusOutside: () => void;
};

export const QuotaPurchasePopover = ( {
	isOpen,
	onClick,
	onFocusOutside,
	placement,
}: QuotaPurchasePopoverProps ): JSX.Element | null => {
	const [ quantity, setQuantity ] = useState( 1 );
	const { purchaseQuota } = useDispatch( NAB_DATA );
	const product = useQuotaProduct();

	if ( ! isOpen ) {
		return null;
	} //end if

	if ( ! product ) {
		return (
			<Popover
				className="nab-quota-purchase--loading"
				noArrow={ false }
				placement={ placement }
				onFocusOutside={ onFocusOutside }
			>
				<Spinner />
			</Popover>
		);
	} //end if

	const { pageviews, currency, price } = product;
	const value = pageviews * quantity;

	return (
		<Popover
			className="nab-quota-purchase"
			noArrow={ false }
			placement={ placement }
			onFocusOutside={ onFocusOutside }
		>
			<div className="nab-quota-purchase__container">
				<TextControl
					className="nab-quota-purchase__value"
					value={ numberFormat( value ) }
					onChange={ () => null }
					readOnly
				/>

				<ButtonGroup className="nab-quota-purchase__buttons">
					<Button
						variant="secondary"
						disabled={ quantity === 1 }
						onClick={ () => setQuantity( quantity - 1 ) }
					>
						<Dashicon icon="minus" />
					</Button>
					<Button
						variant="secondary"
						onClick={ () => setQuantity( quantity + 1 ) }
					>
						<Dashicon icon="plus" />
					</Button>
				</ButtonGroup>
			</div>

			<div className="nab-quota-purchase__footer-container">
				<span className="nab-quota-purchase__total">
					{ _x( 'Total:', 'text', 'command' ) }
					<span className="nab-quota-purchase__total-value">
						{ formatPrice( price * quantity, currency ) }
					</span>
				</span>

				<Button
					variant="primary"
					className="nab-quota-purchase-form__button"
					onClick={ () => {
						onClick();
						void purchaseQuota( quantity, currency );
					} }
				>
					{ _x( 'Purchase', 'command', 'nelio-ab-testing' ) }
				</Button>
			</div>

			<p className="nab-quota-purchase__help">
				{ createInterpolateElement(
					_x(
						'Please notice the system may need a few moments to increase your quota after the purchase. Visit our <help>Knowledge Base</help> for more details.',
						'user',
						'nelio-ab-testing'
					),
					{
						help: (
							// @ts-expect-error children prop is set by createInterpolateComponent.
							<ExternalLink
								href={ addFreeTracker(
									_x(
										'https://neliosoftware.com/testing/help/how-to-purchase-quota/',
										'text',
										'nelio-ab-testing'
									)
								) }
							/>
						),
					}
				) }
			</p>
		</Popover>
	);
};

// =====
// HOOKS
// =====

const useQuotaProduct = () => {
	const product = useSelect( ( select ) =>
		select( NAB_DATA )
			.getProducts()
			.find( ( p ) => p.id === 'nab-extra-quota' )
	);
	const currency = useSelect(
		( select ) => select( NAB_DATA ).getCurrency() || 'USD'
	);

	if ( ! product ) {
		return;
	} //end if

	const price = product.price[ currency ] || product.price.USD || 0;
	const pageviews =
		Number.parseInt( product?.attributes?.pageviews || '' ) || 0;

	return { currency, price, pageviews };
};

// =======
// HELPERS
// =======

const formatPrice = ( price: number, currency: string ): string => {
	switch ( currency ) {
		case 'EUR':
			return `${ numberFormat( price ) }€`;
		case 'USD':
		default:
			return `$${ numberFormat( price ) }`;
	} //end switch
}; //end formatPrice()
