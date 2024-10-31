/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Modal, Spinner } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { noop } from 'lodash';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NAB_ACCOUNT } from '../../store';

export const LoadingModal = (): JSX.Element | null => {
	const isLocked = useSelect( ( select ) =>
		select( NAB_ACCOUNT ).isLocked()
	);

	if ( ! isLocked ) {
		return null;
	} //end if

	return (
		<Modal
			className="nab-locked"
			title={ _x( 'Loading…', 'text', 'nelio-ab-testing' ) }
			shouldCloseOnEsc={ false }
			shouldCloseOnClickOutside={ false }
			isDismissible={ false }
			onRequestClose={ noop }
		>
			<Spinner />
		</Modal>
	);
};
