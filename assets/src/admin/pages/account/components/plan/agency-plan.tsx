/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import apiFetch from '@safe-wordpress/api-fetch';
import { Button, Popover, TextControl } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim } from 'lodash';
import { QuotaMeter, ConfirmationDialog } from '@nab/components';
import type { Account, SiteId } from '@nab/types';
import { store as NAB_ACCOUNT } from '../../store';

export type AgencyPlanProps = {
	readonly siteId: SiteId;
};

export const AgencyPlan = ( { siteId }: AgencyPlanProps ): JSX.Element => {
	const productDisplay = useSelect( ( select ) =>
		select( NAB_ACCOUNT ).getProductDisplay()
	);

	return (
		<div className="nab-account-container__box nab-plan">
			<div className="nab-plan__content">
				<h3 className="nab-plan__title">
					{ productDisplay }
					<span className="nab-plan__period">
						{ _x( 'Agency Plan', 'text', 'nelio-ab-testing' ) }
					</span>
				</h3>
				<div className="nab-plan__renewal">
					{ _x(
						'You’re currently using an agency subscription plan.',
						'user',
						'nelio-ab-testing'
					) }
				</div>
				<QuotaMeter />
			</div>
			<div className="nab-plan__actions">
				<DowngradeButton siteId={ siteId } />
				<ViewDetailsButton />
			</div>
		</div>
	);
};

// =======
// HELPERS
// =======

const DowngradeButton = ( { siteId }: { siteId: SiteId } ) => {
	const [ isOpen, setIsOpen ] = useState( false );
	const { unlinkSite } = useDispatch( NAB_ACCOUNT );

	const open = () => setIsOpen( true );
	const close = () => setIsOpen( false );
	const confirm = () => {
		close();
		void unlinkSite( siteId );
	};

	return (
		<>
			<Button isDestructive className="nab-plan__action" onClick={ open }>
				{ _x(
					'Downgrade to Free Version',
					'command',
					'nelio-ab-testing'
				) }
			</Button>
			<ConfirmationDialog
				title={ _x(
					'Downgrade to Free version?',
					'text',
					'nelio-ab-testing'
				) }
				text={ _x(
					'This will remove the subscription license from the site and you’ll be using Nelio A/B Testing’s free version.',
					'text',
					'nelio-ab-testing'
				) }
				confirmLabel={ _x(
					'Downgrade',
					'command',
					'nelio-ab-testing'
				) }
				isOpen={ isOpen }
				onCancel={ close }
				onConfirm={ confirm }
			/>
		</>
	);
};

const ViewDetailsButton = () => {
	const [ isOpen, setIsOpen ] = useState( false );
	const [ license, setLicense ] = useState( '' );
	const [ validating, setValidating ] = useState( false );
	const { enableAgencyFullView, receiveAccount } = useDispatch( NAB_ACCOUNT );

	const open = () => setIsOpen( true );
	const close = () => setIsOpen( false );
	const validate = () => {
		setValidating( true );
		void apiFetch< Account >( {
			path: '/nab/v1/account/agency',
			method: 'POST',
			data: { license },
		} )
			.then( ( account ) => {
				void receiveAccount( account );
				void enableAgencyFullView();
				setValidating( false );
				close();
			} )
			.catch( () => {
				setValidating( false );
			} );
	};

	return (
		<div>
			<Button
				variant="secondary"
				className="nab-plan__action"
				onClick={ open }
			>
				{ _x( 'View Details', 'command', 'nelio-ab-testing' ) }
			</Button>
			{ isOpen && (
				<Popover
					className="nab-license-form"
					noArrow={ false }
					placement="bottom"
				>
					<TextControl
						value={ license }
						placeholder={ _x(
							'Type your license here',
							'user',
							'nelio-ab-testing'
						) }
						className="nab-license-form__text-control"
						onChange={ ( v ) => setLicense( trim( v ) ) }
					/>
					<Button
						variant="primary"
						isBusy={ validating }
						className="nab-license-form__button"
						onClick={ validate }
						disabled={ ! license.length || validating }
					>
						{ validating
							? _x( 'Validating…', 'text', 'nelio-ab-testing' )
							: _x( 'Validate', 'command', 'nelio-ab-testing' ) }
					</Button>
				</Popover>
			) }
		</div>
	);
};
