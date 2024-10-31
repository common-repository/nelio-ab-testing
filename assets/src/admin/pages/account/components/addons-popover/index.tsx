/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import apiFetch from '@safe-wordpress/api-fetch';
import { Button, Popover, Spinner } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { createInterpolateElement, useState } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { ConfirmationDialog } from '@nab/components';
import { store as NAB_DATA } from '@nab/data';
import { getLocale } from '@nab/date';
import { createErrorNotice } from '@nab/utils';
import type { Currency, FSLocalizedString } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NAB_ACCOUNT } from '../../store';

export type AddonsPopoverProps = {
	readonly isOpen?: boolean;
	readonly placement: Popover.Props[ 'placement' ];
	readonly onFocusOutside: () => void;
};

export const AddonsPopover = ( {
	isOpen,
	placement,
	onFocusOutside,
}: AddonsPopoverProps ): JSX.Element | null => {
	const isLoading = useIsLoading();
	const { addons, enabledAddons } = useAddons();
	const [ isConfirmationOpen, setIsConfirmationOpen ] = useState( false );
	const [ selectedAddon, setSelectedAddon ] = useState< SelectedAddon >();
	const currency = useCurrency();
	const isLocked = useSelect( ( select ) =>
		select( NAB_ACCOUNT ).isLocked()
	);
	const { lock, unlock } = useDispatch( NAB_ACCOUNT );

	if ( isConfirmationOpen ) {
		if ( ! selectedAddon ) {
			return null;
		} //end if

		const { displayName, displayPrice } = selectedAddon;
		return (
			<ConfirmationDialog
				title={ sprintf(
					/* translators: addon name */
					_x(
						'Upgrade your subscription to include %s?',
						'text',
						'nelio-ab-testing'
					),
					displayName
				) }
				text={ createInterpolateElement(
					sprintf(
						/* translators: 1 -> addon name, 2 -> addon price */
						_x(
							'This will include the %1$s addon to your subscription for an additional charge of %2$s. You will be charged today.',
							'text',
							'nelio-ab-testing'
						),
						displayName,
						`<strong>${ displayPrice }</strong>`
					),
					{
						strong: <strong />,
					}
				) }
				confirmLabel={ _x(
					'Upgrade Now',
					'command',
					'nelio-ab-testing'
				) }
				isOpen={ isConfirmationOpen }
				isConfirmBusy={ isLocked }
				onCancel={ () => setIsConfirmationOpen( false ) }
				onConfirm={ () => {
					void lock();
					void apiFetch( {
						path: '/nab/v1/activate/recordings',
						method: 'POST',
					} )
						.then( () => window.location.reload() )
						.catch( ( error ) => createErrorNotice( error ) )
						.finally( () => {
							void unlock();
							setSelectedAddon( undefined );
							setIsConfirmationOpen( false );
						} );
				} }
			/>
		);
	}

	if ( ! isOpen ) {
		return null;
	} //end if

	if ( isLoading ) {
		return (
			<Popover
				className="nab-addons nab-addons--loading"
				noArrow={ false }
				placement={ placement }
				onFocusOutside={ onFocusOutside }
			>
				<Spinner />
			</Popover>
		);
	} //end if

	return (
		<Popover
			className="nab-addons"
			noArrow={ false }
			placement={ placement }
			onFocusOutside={ onFocusOutside }
		>
			<div className="nab-addons__container">
				<div className="nab-addons__container-title">
					{ _x( 'Addons', 'text', 'nelio-ab-testing' ) }
				</div>
				<div className="nab-addons__container-list">
					{ addons.map( ( { id, displayName, price, period } ) => (
						<div className="nab-addons__product" key={ id }>
							<div className="nab-addons__product-details">
								<div className="nab-addons__product-name">
									{ localize( displayName ) }
								</div>
								{ ! enabledAddons.includes( id ) && (
									<div
										className="nab-addons__product-price"
										title={ currency }
									>
										{ formatPrice(
											price[ currency ] || 0,
											currency,
											period
										) }
									</div>
								) }
							</div>
							<div className="nab-addons__product-action">
								{ enabledAddons.includes( id ) ? (
									<span className="nab-addons__product--enabled">
										{ _x(
											'Enabled',
											'text',
											'nelio-ab-testing'
										) }
									</span>
								) : (
									<Button
										variant="primary"
										disabled={ isLocked }
										isBusy={ isLocked }
										onClick={ () => {
											setSelectedAddon( {
												displayName:
													localize( displayName ),
												displayPrice: formatPrice(
													price[ currency ] || 0,
													currency,
													period
												),
											} );
											setIsConfirmationOpen( true );
										} }
									>
										{ _x(
											'Enable',
											'text',
											'nelio-ab-testing'
										) }
									</Button>
								) }
							</div>
						</div>
					) ) }
				</div>
				<Button
					className="screen-reader-text"
					onClick={ onFocusOutside }
				>
					{ _x( 'Close addons', 'command', 'nelio-ab-testing' ) }
				</Button>
			</div>
		</Popover>
	);
};

// =====
// HOOKS
// =====

type SelectedAddon = {
	readonly displayName: string;
	readonly displayPrice: string;
};

const useIsLoading = () =>
	useSelect(
		( select ) =>
			! select( NAB_DATA ).hasFinishedResolution( 'getProducts' )
	);

const useAddons = () =>
	useSelect( ( select ) => {
		const { getProducts } = select( NAB_DATA );
		const { getSubscriptionProduct, getSubscriptionAddons } =
			select( NAB_ACCOUNT );

		const currentProduct = getSubscriptionProduct();
		const enabledAddons = getSubscriptionAddons();
		const products = getProducts();
		const allowedAddons =
			products.find( ( p ) => p.id === currentProduct )?.allowedAddons ||
			[];
		return {
			addons: products.filter(
				( p ) => p.isAddon && allowedAddons.includes( p.id )
			),
			enabledAddons,
		};
	} );

const useCurrency = () =>
	useSelect( ( select ) => select( NAB_ACCOUNT ).getCurrency() || 'USD' );

// =======
// HELPERS
// =======

const formatPrice = (
	price: number,
	currency: Currency,
	period?: 'month' | 'year'
) => {
	const periodText =
		period === 'month'
			? _x( '/ month', 'text', 'nelio-ab-testing' )
			: _x( '/ year', 'text', 'nelio-ab-testing' );
	const priceText = 'EUR' === currency ? `${ price }€` : `US$${ price }`;
	return `${ priceText } ${ periodText }`.trim();
};

const localize = ( str: FSLocalizedString ) => {
	const locale = getLocale();
	return locale.startsWith( 'es' ) ? str.es : str.en;
};
