/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { ConfirmationDialog } from '@nab/components';
import { store as NAB_DATA } from '@nab/data';

/**
 * Internal dependencies
 */
import { store as NAB_ACCOUNT } from '../../store';

export const RemoveLicenseAction = ( {
	label,
	...buttonProps
}: Button.Props ): JSX.Element => {
	const [ isVisible, setVisible ] = useState( false );

	const siteId = useSelect( ( select ) =>
		select( NAB_DATA ).getPluginSetting( 'siteId' )
	);
	const isLocked = useSelect( ( select ) =>
		select( NAB_ACCOUNT ).isLocked()
	);
	const { unlinkSite } = useDispatch( NAB_ACCOUNT );

	return (
		<>
			<Button
				onClick={ () => setVisible( true ) }
				disabled={ isLocked }
				{ ...buttonProps }
			>
				{ label }
			</Button>

			<ConfirmationDialog
				title={ _x(
					'Downgrade to Free Version?',
					'text',
					'nelio-ab-testing'
				) }
				text={ _x(
					'This action will remove the license from this site so that you can use it somewhere else. Nelio A/B Testing will remain active on this site, but you will be using the free version instead. Do you want to continue?',
					'user',
					'nelio-ab-testing'
				) }
				confirmLabel={ _x(
					'Downgrade',
					'command (remove license)',
					'nelio-ab-testing'
				) }
				cancelLabel={ _x( 'Back', 'command', 'nelio-ab-testing' ) }
				isDestructive
				onCancel={ () => setVisible( false ) }
				onConfirm={ () => {
					void unlinkSite( siteId );
					setVisible( false );
				} }
				isOpen={ isVisible }
			/>
		</>
	);
};
