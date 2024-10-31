/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	Popover,
	Button,
	Spinner,
	CheckboxControl,
	SelectControl,
} from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { useState } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { range, toPairs } from 'lodash';
import { store as NAB_DATA } from '@nab/data';
import { getLocale } from '@nab/date';
import type {
	Currency,
	FastSpringProduct,
	FastSpringProductId,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { store as NAB_ACCOUNT } from '../../store';

import type { UpgradePopoverProps } from './props';

type Props = UpgradePopoverProps & {
	readonly back: false | ( () => void );
};

const PRODUCTS = {
	monthly: {
		product: 'nab-enterprise-monthly' as FastSpringProductId,
		quotaAddon: 'nab-pageviews-monthly' as FastSpringProductId,
	},
	yearly: {
		product: 'nab-enterprise-yearly' as FastSpringProductId,
		quotaAddon: 'nab-pageviews-yearly' as FastSpringProductId,
	},
} as const;

const PRODUCT_LIST = [ PRODUCTS.monthly.product, PRODUCTS.yearly.product ];

const BASE_VIEWS = 200_000;
const ADDON_VIEWS = 50_000;
const ADDON_OPTIONS = [ 0, 2, 4, 6, 11, 16 ];

export const EnterpriseUpgradePopover = ( {
	back,
	isOpen,
	placement,
	onClick,
	onFocusOutside,
}: Props ): JSX.Element | null => {
	const isLoading = useIsLoading();
	const products = useProducts();

	const { wasYearly, previousAddonQuantity } = useCurrentStatus();

	const options = expandOptionsAndDropFirst(
		[
			previousAddonQuantity,
			...ADDON_OPTIONS.filter( ( v ) => v > previousAddonQuantity ),
		],
		7
	);

	const [ addonQuantity, setAddonQuantity ] = useState( options[ 0 ] );
	const [ isYearly, setYearly ] = useState( wasYearly );

	const price = useTotal( isYearly ? 'yearly' : 'monthly', addonQuantity );
	const pricePeriod = wasYearly
		? '/' + _x( 'year', 'text', 'nelio-ab-testing' )
		: '';
	const { upgradeSubscription } = useDispatch( NAB_ACCOUNT );

	if ( ! isOpen ) {
		return null;
	} //end if

	if (
		PRODUCT_LIST.some(
			( p ) => ! products.map( ( x ) => x.id ).includes( p )
		)
	) {
		return (
			<Popover
				className="nab-enterprise-upgrade-form nab-enterprise-upgrade-form nab-enterprise-upgrade-form--error"
				noArrow={ false }
				placement={ placement }
				onFocusOutside={ onFocusOutside }
			>
				<p>
					{ _x(
						'Something went wrong while retrieving plans. Please contact Nelio support.',
						'user',
						'nelio-ab-testing'
					) }
				</p>
			</Popover>
		);
	} //end if

	if ( isLoading ) {
		return (
			<Popover
				className="nab-enterprise-upgrade-form nab-enterprise-upgrade-form--loading"
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
			className="nab-enterprise-upgrade-form"
			noArrow={ false }
			placement={ placement }
			onFocusOutside={ onFocusOutside }
		>
			<div className="nab-enterprise-upgrade-form__container">
				<h3>
					{ sprintf(
						'Enterprise%1$s',
						price ? ` (${ price }${ pricePeriod })` : ''
					) }
				</h3>

				<SelectControl
					label={ _x(
						'Monthly Page Views',
						'text',
						'nelio-ab-testing'
					) }
					value={ `${ addonQuantity }` }
					options={ options.map( ( value ) => ( {
						value: `${ value }`,
						label: formatViews( BASE_VIEWS + value * ADDON_VIEWS ),
					} ) ) }
					onChange={ ( v ) =>
						setAddonQuantity( Number.parseInt( v ) )
					}
					help={
						previousAddonQuantity >= 0
							? sprintf(
									/* translators: number of page views */
									_x(
										'Currently set to %s',
										'text',
										'nelio-ab-testing'
									),
									formatViews(
										BASE_VIEWS +
											previousAddonQuantity * ADDON_VIEWS
									)
							  )
							: undefined
					}
				/>

				{ ! wasYearly && (
					<CheckboxControl
						checked={ isYearly }
						onChange={ ( checked ) => setYearly( checked ) }
						label={ _x(
							'Pay yearly',
							'command',
							'nelio-ab-testing'
						) }
					/>
				) }
			</div>

			<div className="nab-enterprise-upgrade-form__button-container">
				{ back && (
					<Button
						variant="secondary"
						className="nab-enterprise-upgrade-form__button"
						onClick={ back }
					>
						{ _x( 'Back', 'command', 'nelio-ab-testing' ) }
					</Button>
				) }
				<Button
					variant="primary"
					className="nab-enterprise-upgrade-form__button"
					onClick={ () => {
						onClick();
						void upgradeSubscription(
							isYearly
								? PRODUCTS.yearly.product
								: PRODUCTS.monthly.product,
							addonQuantity
						);
					} }
				>
					{ _x(
						'Upgrade Subscription',
						'command (subscription)',
						'nelio-ab-testing'
					) }
				</Button>
			</div>
		</Popover>
	);
};

// =====
// HOOKS
// =====

const useIsLoading = () =>
	useSelect(
		( select ) =>
			! select( NAB_DATA ).hasFinishedResolution( 'getProducts' )
	);

const useProducts = () =>
	useSelect( ( select ) => select( NAB_DATA ).getProducts() );

const useTotal = ( mode: 'yearly' | 'monthly', quantity: number ) =>
	useSelect( ( select ) => {
		const products = select( NAB_DATA ).getProducts();
		const currency = select( NAB_ACCOUNT ).getCurrency() || 'USD';

		const baseProduct = products.find(
			( p ) => p.id === PRODUCTS[ mode ].product
		);
		const addonProduct = products.find(
			( p ) => p.id === PRODUCTS[ mode ].quotaAddon
		);

		if ( ! baseProduct || ! addonProduct ) {
			return '';
		} //end if

		const price = ( p: FastSpringProduct ) =>
			p.price[ currency ] ?? p.price.USD ?? 0;

		const perc = toPairs( addonProduct.quantityDiscounts ?? {} )
			.map( ( [ q, d ] ) => [ Number.parseInt( q ), d ] as const )
			.reduce( ( r, [ q, d ] ) => ( q <= quantity ? d : r ), 0 );
		const discount = perc / 100;
		const total =
			price( baseProduct ) +
			price( addonProduct ) * quantity * ( 1 - discount );

		return formatPrice( total, currency );
	} );

const useCurrentStatus = () =>
	useSelect( ( select ) => ( {
		wasYearly: 'year' === select( NAB_ACCOUNT ).getPeriod(),
		previousAddonQuantity:
			select( NAB_ACCOUNT ).getPlan() !== 'enterprise'
				? -1
				: select( NAB_ACCOUNT ).getExtraQuotaUnits(),
	} ) );

// =======
// HELPERS
// =======

const formatter = ( () => {
	try {
		return new Intl.NumberFormat( getLocale().replace( '_', '-' ) );
	} catch ( _ ) {
		return new Intl.NumberFormat( 'en-US' );
	} //end try
} )();

const formatPrice = ( price: number, currency: Currency ) =>
	'EUR' === currency
		? `${ formatter.format( Math.ceil( price ) ) }€`
		: `USD${ formatter.format( Math.ceil( price ) ) }`;

const formatViews = ( value: number ) => formatter.format( value );

const expandOptionsAndDropFirst = (
	values: number[],
	options: number
): [ number, ...number[] ] => {
	const max = values[ values.length - 1 ] || 0;
	const result = [
		...values,
		...range( 1, options ).map( ( i ) => max + i * 20 ),
	].slice( 1, options );
	return [ result[ 0 ] ?? 0, ...result.slice( 1 ) ];
};
