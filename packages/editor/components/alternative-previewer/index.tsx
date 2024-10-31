/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Modal } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NAB_EDITOR } from '../../store';

export const AlternativePreviewer = (): JSX.Element | null => {
	const { closeAlternativePreviewer: close } = useDispatch( NAB_EDITOR );
	const url = useSelect( ( select ) =>
		select( NAB_EDITOR ).getAlternativePreviewerUrl()
	);

	if ( ! url ) {
		return null;
	} //end if

	return (
		<Modal
			className="nab-alternative-previewer"
			title={ _x( 'Alternative Preview', 'text', 'nelio-ab-testing' ) }
			isDismissible={ true }
			onRequestClose={ close }
			shouldCloseOnClickOutside={ false }
		>
			<iframe
				className="nab-alternative-previewer__iframe"
				title={ _x(
					'Alternative Preview Frame',
					'text',
					'nelio-ab-testing'
				) }
				src={ url }
			></iframe>
		</Modal>
	);
};
