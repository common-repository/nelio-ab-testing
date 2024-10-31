/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useEffect, useState } from '@safe-wordpress/element';
import { Button, Snackbar } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';

type ClipboardButtonProps = {
	readonly text: string;
	readonly onSuccess?: () => void;
};

export const ClipboardButton = ( {
	text,
	onSuccess,
}: ClipboardButtonProps ): JSX.Element | null => {
	const [ copied, setCopied ] = useState( false );

	useEffect( () => {
		const timeout = setTimeout( () => setCopied( false ), 1500 );
		return () => clearTimeout( timeout );
	}, [ copied ] );

	if ( ! navigator.clipboard?.writeText ) {
		return null;
	} //end if

	return (
		<div className="nelio-ab-testing-clipboard-button">
			<Button
				icon="admin-page"
				onClick={ () =>
					void navigator.clipboard.writeText( text ).then( () => {
						setCopied( true );
						if ( onSuccess ) {
							onSuccess();
						} //end if
					} )
				}
			/>
			{ !! copied && (
				<Snackbar className="nelio-ab-testing-clipboard-button__text-copied">
					{ _x( 'Copied!', 'text', 'nelio-ab-testing' ) }
				</Snackbar>
			) }
		</div>
	);
};
