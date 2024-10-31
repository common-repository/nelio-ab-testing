/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Modal } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';

export type ConfirmationDialogProps = {
	readonly title: string;
	readonly text: string | JSX.Element;
	readonly className?: string;
	readonly cancelLabel?: string;
	readonly confirmLabel?: string;
	readonly isCancelEnabled?: boolean;
	readonly isConfirmBusy?: boolean;
	readonly isConfirmEnabled?: boolean;
	readonly isDestructive?: boolean;
	readonly isDismissible?: boolean;
	readonly isOpen?: boolean;
	readonly onCancel: () => void;
	readonly onConfirm: () => void;
};

export const ConfirmationDialog = (
	props: ConfirmationDialogProps
): JSX.Element | null => {
	const {
		isOpen,
		className,
		title,
		onCancel,
		onConfirm,
		isDestructive,
		text,
		confirmLabel = _x( 'OK', 'command', 'nelio-ab-testing' ),
		cancelLabel = _x( 'Cancel', 'command', 'nelio-ab-testing' ),
		isConfirmBusy,
		isConfirmEnabled = true,
		isCancelEnabled = true,
		isDismissible = false,
	} = props;

	if ( ! isOpen ) {
		return null;
	} //end if

	return (
		<Modal
			className={ classnames( 'nab-confirmation-dialog', className ) }
			isDismissible={ isDismissible }
			title={ title }
			onRequestClose={ () => isDismissible && onCancel() }
		>
			<p>{ text }</p>
			<div className="nab-confirmation-dialog__actions">
				<Button
					variant="secondary"
					disabled={ ! isCancelEnabled }
					className="nab-confirmation-dialog__cancel-action"
					onClick={ onCancel }
				>
					{ cancelLabel }
				</Button>
				<Button
					variant={ ! isDestructive ? 'primary' : undefined }
					isBusy={ isConfirmBusy }
					isDestructive={ isDestructive }
					disabled={ ! isConfirmEnabled }
					className="nab-confirmation-dialog__confirm-action"
					onClick={ onConfirm }
				>
					{ confirmLabel }
				</Button>
			</div>
		</Modal>
	);
};
