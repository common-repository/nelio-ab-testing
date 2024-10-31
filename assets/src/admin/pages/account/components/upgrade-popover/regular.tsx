/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	Popover,
	Button,
	Spinner,
	RadioControl,
} from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { useState } from '@safe-wordpress/element';
import { sprintf, _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { mapValues, trim } from 'lodash';
import { store as NAB_DATA } from '@nab/data';
import { getLocale } from '@nab/date';
import type {
	Currency,
	FSLocalizedString,
	FastSpringProduct,
	FastSpringProductId,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { store as NAB_ACCOUNT } from '../../store';

import type { UpgradePopoverProps } from './props';

type Props = UpgradePopoverProps & {
	readonly showEnterprise: () => void;
};

export const RegularUpgradePopover = ( {
	isOpen,
	placement,
	onClick,
	onFocusOutside,
	showEnterprise,
}: Props ): JSX.Element | null => {
	const isLoading = useIsLoading();
	const products = useProducts();
	const currency = useCurrency();
	const { upgradeSubscription } = useDispatch( NAB_ACCOUNT );
	const [ selectedOption, setSelectedOption ] = useState(
		'' as FastSpringProductId
	);

	if ( ! isOpen ) {
		return null;
	} //end if

	if ( isLoading ) {
		return (
			<Popover
				className="nab-regular-upgrade-form nab-regular-upgrade-form--loading"
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
			className="nab-regular-upgrade-form"
			noArrow={ false }
			placement={ placement }
			onFocusOutside={ onFocusOutside }
		>
			<div className="nab-regular-upgrade-form__product-container">
				<h3>
					{ _x( 'Subscription Plans', 'text', 'nelio-ab-testing' ) }
				</h3>
				<RadioControl
					selected={ selectedOption }
					options={ products.map(
						( {
							id,
							displayName,
							price,
							description,
							enabledAddons,
						} ) => ( {
							label: (
								<div className="nab-regular-upgrade-form__product">
									<strong className="nab-regular-upgrade-form__product-name">
										{ localize( displayName ) }
									</strong>
									<span
										className="nab-regular-upgrade-form__product-price"
										title={ currency }
									>
										{ formatPrice(
											id,
											( price[ currency ] || 0 ) +
												enabledAddons.reduce(
													( acc, a ) =>
														acc +
														( a.price[ currency ] ||
															0 ),
													0
												),
											currency
										) }
									</span>
									<span className="nab-regular-upgrade-form__product-description">
										{ localize( description ) }
									</span>
								</div> // eslint-disable-next-line @typescript-eslint/no-explicit-any
							 ) as any as string,
							value: id,
						} )
					) }
					onChange={ ( option ) => {
						if ( ! option ) {
							return;
						}
						if ( 'nab-enterprise-placeholder' === option ) {
							showEnterprise();
							return;
						}
						setSelectedOption( option );
					} }
				/>
			</div>

			<div className="nab-regular-upgrade-form__button-container">
				<Button
					variant="primary"
					className="nab-regular-upgrade-form__button"
					disabled={ ! selectedOption }
					onClick={ () => {
						onClick();
						void upgradeSubscription( selectedOption, 0 );
					} }
				>
					{ _x(
						'Upgrade Subscription',
						'command',
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
	useSelect(
		(
			select
		): ReadonlyArray<
			Pick<
				FastSpringProduct,
				'id' | 'displayName' | 'price' | 'description'
			> & {
				readonly enabledAddons: ReadonlyArray< FastSpringProduct >;
			}
		> => {
			const { getProducts } = select( NAB_DATA );
			const { getSubscriptionProduct, getSubscriptionAddons } =
				select( NAB_ACCOUNT );

			const currentProduct = getSubscriptionProduct();
			const products = getProducts();
			const allUpgradeableProducts = products.filter(
				( { upgradeableFrom } ) =>
					upgradeableFrom.includes( currentProduct )
			);
			const upgradeableProducts = allUpgradeableProducts.filter(
				( p ) => ! p.id.includes( 'enterprise' )
			);

			const enterpriseProduct =
				allUpgradeableProducts.find( ( p ) =>
					p.id.includes( 'enterprise-monthly' )
				) ||
				allUpgradeableProducts.find( ( p ) =>
					p.id.includes( 'enterprise-yearly' )
				);

			const enabledAddons = getSubscriptionAddons();
			const addons = products.filter( ( p ) => p.isAddon );

			const getEnabledAddons = ( p?: FastSpringProduct ) =>
				( p?.allowedAddons ?? [] )
					.filter(
						( addonId ) =>
							!! enabledAddons.find( ( id ) =>
								areSameAddon( addonId, id )
							)
					)
					.map( ( addonId ) =>
						addons.find( ( a ) => a.id === addonId )
					)
					.filter(
						( a ) => !! a
					) as ReadonlyArray< FastSpringProduct >;
			return [
				...upgradeableProducts.map( ( p ) => ( {
					...p,
					enabledAddons: getEnabledAddons( p ),
				} ) ),
				{
					price: { USD: 0, EUR: 0 },
					description: { en: '', es: '' },
					enabledAddons: getEnabledAddons( enterpriseProduct ),
					...enterpriseProduct,
					id: 'nab-enterprise-placeholder' as FastSpringProductId,
					displayName: mapValues(
						enterpriseProduct?.displayName ?? { en: '', es: '' },
						( name ) => trim( name.replace( /\([^)]*\)/, '' ) )
					),
				},
			];
		}
	);

const useCurrency = () =>
	useSelect( ( select ) => select( NAB_ACCOUNT ).getCurrency() || 'USD' );

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

const formatPrice = (
	product: string,
	price: number,
	currency: Currency
): string => {
	const result =
		'EUR' === currency
			? `${ formatter.format( Math.ceil( price ) ) }€`
			: `USD${ formatter.format( Math.ceil( price ) ) }`;
	if ( 'nab-enterprise-placeholder' === product ) {
		return sprintf(
			/* translators: price */
			_x( 'starting from %s', 'text (money)', 'nelio-ab-testing' ),
			result
		);
	} //end if
	return result;
};

const localize = ( str: FSLocalizedString ) => {
	const locale = getLocale();
	return locale.startsWith( 'es' )
		? str.es.replace( 'de Nelio A/B Testing', '' )
		: str.en.replace( 'Nelio A/B Testing', '' );
};

const areSameAddon = ( a: string, b: string ): boolean => {
	const aprefix = a.substring( 0, a.indexOf( 'addon-' ) );
	const bprefix = b.substring( 0, b.indexOf( 'addon-' ) );
	return !! aprefix && !! bprefix && aprefix === bprefix;
};
