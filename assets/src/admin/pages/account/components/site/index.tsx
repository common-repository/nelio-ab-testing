/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	Button,
	CheckboxControl,
	Modal,
	TextControl,
} from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { useState } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { noop } from 'lodash';
import { HelpIcon, ConfirmationDialog } from '@nab/components';
import { store as NAB_DATA } from '@nab/data';
import { numberFormat } from '@nab/i18n';
import type { Site as SiteType, SiteId } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NAB_ACCOUNT } from '../../store';

export type SiteProps = SiteType & {
	readonly displayQuotaLimit?: boolean;
};

export const Site = ( {
	displayQuotaLimit,
	actualUrl,
	id,
	isCurrentSite,
	usedMonthlyQuota,
	maxMonthlyQuota,
	url,
}: SiteProps ): JSX.Element => (
	<li className="nab-site">
		<span className="nab-site__details">
			{ isCurrentSite ? (
				<span className="nab-site__url">
					<span className="nab-site__current-site">
						{ actualUrl }
						{ !! actualUrl && url !== actualUrl && (
							<HelpIcon
								className="nab-site__current-site-help"
								type="info"
								text={ sprintf(
									/* translators: site URL */
									_x(
										'Activation URL is “%s”',
										'text',
										'nelio-ab-testing'
									),
									url
								) }
							/>
						) }
					</span>
					<span className="nab-site__label">
						{ _x( 'This site', 'text', 'nelio-ab-testing' ) }
					</span>
				</span>
			) : (
				<span className="nab-site__url">
					<a
						href={ url }
						className={ classnames( 'nab-site__link', {
							'nab-site__link--current': isCurrentSite,
						} ) }
						target="_blank"
						rel="noopener noreferrer"
					>
						{ url }
					</a>
				</span>
			) }
			{ !! displayQuotaLimit && (
				<small>
					<strong>
						{ _x( 'Quota Usage', 'text', 'nelio-ab-testing' ) }
						{ ': ' }
					</strong>
					{ numberFormat( usedMonthlyQuota ) }
					{ ' / ' }
					{ stringifyMaxQuota( maxMonthlyQuota ) }
				</small>
			) }
		</span>

		<LimitQuotaAction siteId={ id } />
		<DeleteAction siteId={ id } />
	</li>
);

// ==============
// INTERNAL VIEWS
// ==============

type ActionProps = {
	readonly siteId: SiteId;
};

const LimitQuotaAction = ( { siteId }: ActionProps ) => {
	const [ isDialogOpen, setDialogOpen ] = useState( false );
	const canLimitQuota = useSelect( ( select ) =>
		select( NAB_DATA ).canLimitSiteQuota()
	);
	const { limitSiteQuota } = useDispatch( NAB_ACCOUNT );
	const currentSiteLimit = useSelect(
		( select ) =>
			select( NAB_ACCOUNT ).getSite( siteId )?.maxMonthlyQuota ?? -1
	);

	if ( ! canLimitQuota ) {
		return null;
	} //end if

	return (
		<>
			<Button
				variant="tertiary"
				className="nab-site__limit-quota-button"
				onClick={ () => setDialogOpen( true ) }
			>
				{ _x( 'Limit Quota', 'command', 'nelio-ab-testing' ) }
			</Button>
			{ isDialogOpen && (
				<SiteQuotaDialog
					initialValue={ `${ currentSiteLimit }` }
					onClose={ () => setDialogOpen( false ) }
					onSave={ ( value ) => limitSiteQuota( siteId, value ) }
				/>
			) }
		</>
	);
};

const DeleteAction = ( { siteId }: ActionProps ) => {
	const [ isDialogOpen, setDialogOpen ] = useState( false );
	const { unlinkSite } = useDispatch( NAB_ACCOUNT );

	return (
		<>
			<Button
				isDestructive
				variant="tertiary"
				className="nab-site__unlink-button"
				onClick={ () => setDialogOpen( true ) }
			>
				{ _x( 'Unlink Site', 'command', 'nelio-ab-testing' ) }
			</Button>

			<ConfirmationDialog
				title={ _x( 'Unlink Site?', 'text', 'nelio-ab-testing' ) }
				text={ _x(
					'This will remove the subscription license from the site.',
					'text',
					'nelio-ab-testing'
				) }
				confirmLabel={ _x( 'Unlink', 'command', 'nelio-ab-testing' ) }
				isOpen={ isDialogOpen }
				onCancel={ () => setDialogOpen( false ) }
				onConfirm={ () => {
					setDialogOpen( false );
					void unlinkSite( siteId );
				} }
			/>
		</>
	);
};

const SiteQuotaDialog = ( {
	initialValue,
	onClose,
	onSave: save,
}: {
	readonly initialValue: string;
	readonly onClose: () => void;
	readonly onSave: ( value: number ) => Promise< unknown >;
} ) => {
	const [ isSaving, setSaving ] = useState( false );
	const [ value, setValue ] = useState( initialValue );

	const isDirty = value !== initialValue;

	const isUnlimited = ( n: number ) => n === -1;
	const onSave = () => {
		const intValue = Number.parseInt( value );
		const limit = isUnlimited( intValue ) ? -1 : Math.abs( intValue );
		setSaving( true );
		save( limit )
			.then( onClose )
			.catch( () => setSaving( false ) );
	};

	return (
		<Modal
			className="site-quota-dialog"
			title={ _x( 'Site Quota', 'text', 'nelio-ab-testing' ) }
			onRequestClose={ noop }
			isDismissible={ false }
		>
			<CheckboxControl
				checked={ '-1' !== value }
				onChange={ ( enabled ) => setValue( enabled ? '1000' : '-1' ) }
				label={ _x(
					'Limit quota usage in this site',
					'command',
					'nelio-ab-testing'
				) }
			/>
			{ '-1' !== value && (
				<TextControl
					type="number"
					min="0"
					value={ value }
					onChange={ setValue }
				/>
			) }
			<div className="site-quota-dialog__actions">
				<Button variant="secondary" onClick={ onClose }>
					{ isDirty
						? _x( 'Discard Changes', 'command', 'nelio-ab-testing' )
						: _x( 'Close', 'command', 'nelio-ab-testing' ) }
				</Button>
				<Button
					variant="primary"
					onClick={ onSave }
					disabled={ ! isDirty || isSaving }
				>
					{ isSaving
						? _x( 'Saving…', 'text', 'nelio-ab-testing' )
						: _x( 'Save', 'command', 'nelio-ab-testing' ) }
				</Button>
			</div>
		</Modal>
	);
};

// =======
// HELPERS
// =======

const stringifyMaxQuota = ( n: number ) =>
	-1 === n ? '∞' : numberFormat( n );
