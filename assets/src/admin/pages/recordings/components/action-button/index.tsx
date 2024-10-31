/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	createInterpolateElement,
	useState,
	useEffect,
} from '@safe-wordpress/element';
import apiFetch from '@safe-wordpress/api-fetch';
import { Button } from '@safe-wordpress/components';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { ConfirmationDialog } from '@nab/components';
import { useAdminUrl } from '@nab/data';
import { addFreeTracker, createErrorNotice } from '@nab/utils';
import type {
	Currency,
	FastSpringProduct,
	FastSpringProductId,
} from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import type { Settings } from '../../types';

type ActionButtonProps = {
	readonly settings: Settings;
};
export const ActionButton = ( {
	settings,
}: ActionButtonProps ): JSX.Element | null => {
	const [ isLoading, setIsLoading ] = useState( false );
	const [ isLoadingData, setIsLoadingData ] = useState( false );
	const [ isConfirmationOpen, setIsConfirmationOpen ] = useState( false );
	const [ addonPrice, setAddonPrice ] = useState( '' );
	const recordingsUrl = useAdminUrl( 'admin.php', {
		page: 'nelio-session-recordings',
	} );

	const {
		isSubscribed,
		isSubscribedToAddon,
		isPluginInstalled,
		isPluginActive,
	} = settings;

	useEffect( () => {
		if ( ! isSubscribedToAddon ) {
			setIsLoadingData( true );
			void apiFetch< FastspringData >( {
				path: '/nab/v1/fastspring',
			} )
				.then( ( data: FastspringData ) => {
					const { currency, currentPlan } = data;
					const requiredAddonId = ( data.products.find(
						( p ) => p.id === currentPlan
					)?.allowedAddons || [] )[ 0 ];
					const addon = data.products.find(
						( p ) => p.isAddon && p.id === requiredAddonId
					);
					const addonPriceValue = addon?.price[ currency ];
					if ( addonPriceValue ) {
						setAddonPrice(
							formatPrice(
								addonPriceValue,
								currency,
								addon.period
							)
						);
					} //end if
				} )
				.catch( ( error ) => createErrorNotice( error ) )
				.finally( () => setIsLoadingData( false ) );
		} //end if
	}, [ isSubscribedToAddon ] );

	if (
		isSubscribed &&
		isSubscribedToAddon &&
		isPluginInstalled &&
		isPluginActive
	) {
		return null;
	} //end if

	if ( ! isSubscribed ) {
		return (
			<a
				className="nab-action-button components components-button is-primary"
				href={ getSubscribeLink() }
				target="_blank"
				rel="noreferrer"
			>
				{ _x( 'Subscribe', 'command', 'nelio-ab-testing' ) }
			</a>
		);
	} //end if

	return (
		<>
			<Button
				className="nab-action-button"
				variant="primary"
				disabled={ isLoading || isLoadingData }
				isBusy={ isLoading }
				onClick={ () => {
					if (
						isSubscribedToAddon &&
						( ! isPluginInstalled || ! isPluginActive )
					) {
						setIsLoading( true );
						void apiFetch( {
							path: '/nab/v1/activate/recordings',
							method: 'POST',
						} )
							.then( () => {
								window.location.href = recordingsUrl;
							} )
							.catch( ( error ) => createErrorNotice( error ) )
							.finally( () => setIsLoading( false ) );
					} else {
						setIsConfirmationOpen( true );
					} //end if
				} }
			>
				{ getActionButtonLabel(
					isLoading,
					isSubscribedToAddon,
					isPluginInstalled,
					addonPrice
				) }
			</Button>
			<ConfirmationDialog
				title={ _x(
					'Upgrade your subscription to include session recordings?',
					'user',
					'nelio-ab-testing'
				) }
				text={ createInterpolateElement(
					sprintf(
						/* translators: addon price */
						_x(
							'This will include the Nelio Session Recordings addon to your subscription for an additional charge of %s. You will be charged today.',
							'user',
							'nelio-ab-testing'
						),
						`<strong>${ addonPrice }</strong>`
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
				isConfirmBusy={ isLoading }
				onCancel={ () => setIsConfirmationOpen( false ) }
				onConfirm={ () => {
					setIsLoading( true );
					void apiFetch( {
						path: '/nab/v1/activate/recordings',
						method: 'POST',
					} )
						.then( () => {
							window.location.href = recordingsUrl;
						} )
						.catch( ( error ) => createErrorNotice( error ) )
						.finally( () => {
							setIsLoading( false );
							setIsConfirmationOpen( false );
						} );
				} }
			/>
		</>
	);
};

type FastspringData = {
	readonly currency: Currency;
	readonly currentPlan: FastSpringProductId;
	readonly products: ReadonlyArray< FastSpringProduct >;
};

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

function getActionButtonLabel(
	isLoading: boolean,
	isSubscribedToAddon: boolean,
	isPluginInstalled: boolean,
	addonPrice: string
): string {
	if ( ! isSubscribedToAddon ) {
		if ( isLoading ) {
			return _x( 'Enabling…', 'text', 'nelio-ab-testing' );
		} //end if

		return addonPrice.length
			? sprintf(
					/* translators: addon price */
					_x( 'Enable for %s', 'text', 'nelio-ab-testing' ),
					addonPrice
			  )
			: _x( 'Enable', 'text', 'nelio-ab-testing' );
	} //end if

	if ( ! isPluginInstalled ) {
		return isLoading
			? _x( 'Installing & Activating…', 'text', 'nelio-ab-testing' )
			: _x( 'Install & Activate Plugin', 'command', 'nelio-ab-testing' );
	} //end if

	return isLoading
		? _x( 'Activating…', 'text', 'nelio-ab-testing' )
		: _x( 'Activate Plugin', 'command', 'nelio-ab-testing' );
} //end getActionButtonLabel()

function getSubscribeLink(): string {
	return addFreeTracker(
		_x(
			'https://neliosoftware.com/testing/pricing/',
			'text',
			'nelio-ab-testing'
		)
	);
} //end getSubscribeLink()
