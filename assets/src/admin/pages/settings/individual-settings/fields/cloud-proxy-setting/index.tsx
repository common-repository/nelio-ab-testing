/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import apiFetch from '@safe-wordpress/api-fetch';
import {
	BaseControl,
	Button,
	Dashicon,
	NoticeList,
	SelectControl,
	TextControl,
} from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { createInterpolateElement, useState } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';
import { store as NOTICES } from '@safe-wordpress/notices';

/**
 * External dependencies
 */
import { trim } from 'lodash';
import { ConfirmationDialog } from '@nab/components';
import { store as NAB_DATA } from '@nab/data';
import { v4 as uuid } from 'uuid';

/**
 * Internal dependencies
 */
import './style.scss';

import { useAttributes } from '../hooks';

import { DEFAULT_ATTRS, Attrs } from './config';
import type { FieldSettingProps } from '../types';

export const CloudProxySetting = ( {
	name,
}: FieldSettingProps ): JSX.Element => {
	const [ attributes, setAttributes ] = useAttributes( name, DEFAULT_ATTRS );
	const options = useModeOptions();
	const setMode = ( m: Attrs[ 'mode' ] ) => setAttributes( { mode: m } );
	const { mode } = attributes;

	return (
		<>
			<SelectControl
				className="nab-cloud-proxy-setting__selector"
				options={ options }
				value={ mode }
				onChange={ setMode }
			/>
			<CloudProxySettingDetails name={ name } />
		</>
	);
};

const CloudProxySettingDetails = ( {
	name,
}: FieldSettingProps ): JSX.Element | null => {
	const [ attributes, setAttributes ] = useAttributes( name, DEFAULT_ATTRS );
	const setValue = ( v: Attrs[ 'value' ] ) => setAttributes( { value: v } );
	const { mode, value } = attributes;

	if ( mode === 'disabled' ) {
		return (
			<input
				type="hidden"
				name="nelio-ab-testing_settings[cloud_proxy_setting]"
				value={ JSON.stringify( attributes ) }
			/>
		);
	} //end if

	if ( mode === 'rest' ) {
		return (
			<div className="nab-cloud-proxy-setting__detail">
				<TextControl
					className="nab-cloud-proxy-setting__detail-value"
					label={ _x(
						'WordPress REST API Endpoint',
						'text',
						'nelio-ab-testing'
					) }
					placeholder={ _x(
						'/namespace/route',
						'text',
						'nelio-ab-testing'
					) }
					value={ value }
					onChange={ ( v ) => setValue( trim( v ) ) }
					help={
						! /^\/[a-z0-9-]+\/[a-z0-9-]+$/.test( value )
							? _x(
									'Please write a valid endpoint (/namespace/route)',
									'user',
									'nelio-ab-testing'
							  )
							: undefined
					}
				/>
				<input
					type="hidden"
					name="nelio-ab-testing_settings[cloud_proxy_setting]"
					value={ JSON.stringify( attributes ) }
				/>
			</div>
		);
	}

	return <DomainForwardingSettings name={ name } />;
};

type CheckResponse = {
	readonly status: Attrs[ 'domainStatus' ];
	readonly recordName?: string;
	readonly recordValue?: string;
};

const DomainForwardingSettings = ( {
	name,
}: FieldSettingProps ): JSX.Element | null => {
	const [ attributes, setAttributes ] = useAttributes( name, DEFAULT_ATTRS );
	const [ isReset, setIsReset ] = useState( false );
	const [ isVisible, setVisible ] = useState( false );

	const setDomain = ( d: Attrs[ 'domain' ] ) =>
		setAttributes( { mode: 'domain-forwarding', domain: d } );
	const setDomainStatus = ( ds: Attrs[ 'domainStatus' ] ) =>
		setAttributes( { domainStatus: ds } );
	const setCheckingStatus = ( b: Attrs[ 'isCheckingStatus' ] ) =>
		setAttributes( { isCheckingStatus: b } );
	const setDnsValidation = ( dv: Attrs[ 'dnsValidation' ] ) =>
		setAttributes( { dnsValidation: dv } );

	const { mode, isCheckingStatus, domain, domainStatus, dnsValidation } =
		attributes;

	const statusExplanation = useStatusExplanation(
		domain,
		domainStatus,
		dnsValidation
	);
	const actionLabel = useActionLabel(
		domainStatus,
		dnsValidation,
		isCheckingStatus && ! isReset
	);
	const showError = useShowError();
	const notices = useNotices();
	const { removeNotice } = useDispatch( NOTICES );

	if ( mode !== 'domain-forwarding' ) {
		return null;
	} //end if

	const isResetAvailable = [
		'cert-validation-pending',
		'cert-validation-success',
		'success',
	].includes( domainStatus );

	return (
		<div className="nab-cloud-proxy-setting__detail">
			<BaseControl
				id="nab-cloud-domain-forwarder"
				className="nab-cloud-proxy-setting__detail-domain"
				label={
					<>
						{ _x(
							'Custom Forwarding Domain',
							'text',
							'nelio-ab-testing'
						) }
						{ domainStatus === 'success' ? (
							<Dashicon icon="yes-alt" />
						) : (
							<Dashicon icon="warning" />
						) }
					</>
				}
				help={ statusExplanation }
			>
				<TextControl
					placeholder={ _x(
						'forwarder.yourdomain.com',
						'text',
						'nelio-ab-testing'
					) }
					name="nelio-ab-testing_settings[cloud_domain_forwarder]"
					disabled={ isCheckingStatus || isResetAvailable }
					value={ domain }
					onChange={ setDomain }
				/>
				{ domainStatus !== 'success' && (
					<Button
						className="nab-cloud-proxy-setting__detail-checker"
						variant="secondary"
						disabled={
							isCheckingStatus || ! isValidDomain( domain )
						}
						isBusy={ isCheckingStatus && ! isReset }
						onClick={ () => {
							setCheckingStatus( true );
							void apiFetch< CheckResponse >( {
								path: '/nab/v1/domain/check',
								method: 'POST',
								data: { domain, domainStatus },
							} )
								.then( ( response ) => {
									setDomainStatus( response.status );
									if (
										response.status ===
										'cert-validation-pending'
									) {
										setDnsValidation( {
											recordName:
												response.recordName || '',
											recordValue:
												response.recordValue || '',
										} );
									} //end if

									setCheckingStatus( false );
									if (
										response.status !== domainStatus &&
										response.status === 'success'
									) {
										saveSettings();
									} //end if
								} )
								.catch( ( err: { message: string } ) => {
									showError( err.message );
									setCheckingStatus( false );
								} );
						} }
					>
						{ actionLabel }
					</Button>
				) }
				{ isResetAvailable && (
					<>
						<Button
							className="nab-cloud-proxy-setting__detail-reset"
							isDestructive
							disabled={ isCheckingStatus }
							isBusy={ isCheckingStatus && isReset }
							onClick={ () => setVisible( true ) }
						>
							{ _x( 'Disable', 'text', 'nelio-ab-testing' ) }
						</Button>

						<ConfirmationDialog
							title={ _x(
								'Disable Domain Forwarding?',
								'text',
								'nelio-ab-testing'
							) }
							text={ _x(
								'This action will remove the domain forwarding configuration in our servers. You will need to start the process from the beginning to set up domain forwarding again. Do you want to continue?',
								'user',
								'nelio-ab-testing'
							) }
							confirmLabel={ _x(
								'Continue',
								'command',
								'nelio-ab-testing'
							) }
							cancelLabel={ _x(
								'Back',
								'command',
								'nelio-ab-testing'
							) }
							isDestructive
							onCancel={ () => setVisible( false ) }
							onConfirm={ () => {
								setVisible( false );
								setCheckingStatus( true );
								setIsReset( true );
								void apiFetch< Attrs[ 'domainStatus' ] >( {
									path: '/nab/v1/domain/reset',
									method: 'POST',
								} )
									.then( () => {
										setDomainStatus( 'disabled' );
									} )
									.catch( ( err: { message: string } ) => {
										showError( err.message );
									} )
									.finally( () => {
										setCheckingStatus( false );
										setIsReset( false );
										saveSettings();
									} );
							} }
							isOpen={ isVisible }
						/>
					</>
				) }
			</BaseControl>
			{ domainStatus === 'cert-validation-pending' &&
				!! dnsValidation.recordName &&
				!! dnsValidation.recordValue && (
					<DnsRecord
						domain={ domain }
						recordName={ dnsValidation.recordName }
						recordValue={ dnsValidation.recordValue }
					/>
				) }
			<input
				type="hidden"
				name="nelio-ab-testing_settings[cloud_proxy_setting]"
				value={ JSON.stringify( attributes ) }
			/>
			<NoticeList
				className="nab-cloud-proxy-setting__detail-errors"
				notices={ notices }
				onRemove={ removeNotice }
			/>
		</div>
	);
};

type DnsRecordProps = {
	readonly domain: Attrs[ 'domain' ];
	readonly recordName: string;
	readonly recordValue: string;
};
const DnsRecord = ( {
	domain,
	recordName,
	recordValue,
}: DnsRecordProps ): JSX.Element => (
	<table className="nab-cloud-proxy-setting__detail-dns-record">
		<thead>
			<tr>
				<th>{ _x( 'Domain Name', 'text', 'nelio-ab-testing' ) }</th>
				<th>{ _x( 'Record Name', 'text', 'nelio-ab-testing' ) }</th>
				<th>{ _x( 'Record Type', 'text', 'nelio-ab-testing' ) }</th>
				<th>{ _x( 'Record Value', 'text', 'nelio-ab-testing' ) }</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>{ domain }</td>
				<td>{ recordName }</td>
				<td>CNAME</td>
				<td>{ recordValue }</td>
			</tr>
		</tbody>
	</table>
);

// =======
// HELPERS
// =======
const isValidDomain = ( d: string ): boolean =>
	/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}$/i.test( d );

const saveSettings = (): void => {
	document.getElementById( 'submit' )?.click();
};

// =====
// HOOKS
// =====

const useModeOptions = (): ReadonlyArray< {
	readonly value: Attrs[ 'mode' ];
	readonly label: string;
	readonly disabled?: boolean;
} > => {
	const isEnterpriseSubscriber = useSelect( ( select ) =>
		select( NAB_DATA ).isSubscribedTo( 'enterprise' )
	);
	return [
		{
			value: 'disabled',
			label: _x( 'Disabled', 'text (proxy)', 'nelio-ab-testing' ),
		},
		{
			value: 'rest',
			label: _x( 'REST API', 'command', 'nelio-ab-testing' ),
		},
		{
			disabled: ! isEnterpriseSubscriber,
			value: 'domain-forwarding',
			label: ! isEnterpriseSubscriber
				? _x(
						'Domain Forwarding (enterprise only)',
						'text (proxy)',
						'nelio-ab-testing'
				  )
				: _x( 'Domain Forwarding', 'text (proxy)', 'nelio-ab-testing' ),
		},
	];
};

const useActionLabel = (
	status: Attrs[ 'domainStatus' ],
	validation: Attrs[ 'dnsValidation' ],
	isProcessing: boolean
): string => {
	switch ( status ) {
		case 'disabled':
		case 'missing-forward':
		case 'cert-validation-success':
			return isProcessing
				? _x( 'Checking…', 'command', 'nelio-ab-testing' )
				: _x( 'Check', 'command', 'nelio-ab-testing' );

		case 'cert-validation-pending':
			if ( ! validation.recordName || ! validation.recordValue ) {
				return isProcessing
					? _x( 'Refreshing…', 'command', 'nelio-ab-testing' )
					: _x( 'Refresh', 'command', 'nelio-ab-testing' );
			} //end if
			return isProcessing
				? _x( 'Validating…', 'command', 'nelio-ab-testing' )
				: _x( 'Validate', 'command', 'nelio-ab-testing' );

		case 'success':
			return _x( 'Disable', 'text', 'nelio-ab-testing' );
	} //end switch
};

const useStatusExplanation = (
	domain: Attrs[ 'domain' ],
	status: Attrs[ 'domainStatus' ],
	validation: Attrs[ 'dnsValidation' ]
): string | JSX.Element => {
	switch ( status ) {
		case 'disabled':
			return _x(
				'Domain forwarding disabled',
				'text',
				'nelio-ab-testing'
			);

		case 'missing-forward':
			return createInterpolateElement(
				sprintf(
					/* translators: domain */
					_x(
						'<strong>Step 1 of 3:</strong> To configure domain forwarding for %1$s, please add a CNAME record in your DNS configuration for %1$s and set the destination or target to <code>api.nelioabtesting.com</code>. If you are not familiar with CNAME records, contact your domain host, who can help you. Once created, <strong>check again</strong>. Note that the propagation of DNS records may take some time.',
						'user',
						'nelio-ab-testing'
					),
					`<code>${ domain }</code>`,
					`<code>${ domain }</code>`
				),
				{
					code: <code />,
					strong: <strong />,
				}
			);

		case 'cert-validation-pending':
			return !! validation.recordName && !! validation.recordValue
				? createInterpolateElement(
						_x(
							'Your domain is CNAMED correctly to our servers.<break></break><strong>Step 2 of 3:</strong> To validate the ownership of your domain, create the following DNS record:',
							'user',
							'nelio-ab-testing'
						),
						{
							break: <br />,
							strong: <strong />,
						}
				  )
				: createInterpolateElement(
						_x(
							'Your domain is CNAMED correctly to our servers.<break></break><strong>Step 2 of 3:</strong> Now we need to validate that you are the owner of your domain by creating an additional DNS record. Click on the <strong>Refresh</strong> button to get the details about the DNS record that you need to create.',
							'user',
							'nelio-ab-testing'
						),
						{
							break: <br />,
							strong: <strong />,
						}
				  );

		case 'cert-validation-success':
			return createInterpolateElement(
				_x(
					'Your domain is CNAMED correctly to our servers.<break></break><strong>Step 3 of 3:</strong> We are configuring the forwarding on our end. Wait a few minutes and check again.',
					'user',
					'nelio-ab-testing'
				),
				{
					break: <br />,
					strong: <strong />,
				}
			);

		case 'success':
			return _x(
				'Domain forwarding successfully configured',
				'text',
				'nelio-ab-testing'
			);
	} //end switch
};

const useShowError = () => {
	const { createErrorNotice, removeNotice } = useDispatch( NOTICES );
	const defaultMessage = _x(
		'Unknown error while checking domain forwarding status.',
		'text',
		'nelio-ab-testing'
	);

	return ( message: string ) => {
		const id = uuid();
		const msg = message || defaultMessage;
		void createErrorNotice( msg, {
			id,
			onDismiss: () => removeNotice( id ),
		} );
	};
};

const useNotices = () =>
	useSelect( ( select ) => select( NOTICES ).getNotices() );
