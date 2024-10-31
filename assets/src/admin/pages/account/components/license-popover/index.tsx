/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useDispatch } from '@safe-wordpress/data';
import { useState } from '@safe-wordpress/element';
import { Popover, TextControl, Button } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim } from 'lodash';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NAB_ACCOUNT } from '../../store';

const LICENSE_LENGTH = 21;
const OLD_LICENSE_LENGTH = 26;

export type LicensePopoverProps = {
	readonly isOpen?: boolean;
	readonly placement: Popover.Props[ 'placement' ];
	readonly onClick: () => void;
	readonly onFocusOutside: () => void;
};

export const LicensePopover = ( {
	isOpen,
	placement,
	onClick,
	onFocusOutside,
}: LicensePopoverProps ): JSX.Element | null => {
	const [ license, setLicense ] = useState( '' );
	const { linkSite } = useDispatch( NAB_ACCOUNT );

	if ( ! isOpen ) {
		return null;
	} //end if

	return (
		<Popover
			className="nab-license-form"
			noArrow={ false }
			placement={ placement }
			onFocusOutside={ onFocusOutside }
		>
			<TextControl
				value={ license }
				placeholder={ _x(
					'Type your license here',
					'user',
					'nelio-ab-testing'
				) }
				maxLength={ Math.max( LICENSE_LENGTH, OLD_LICENSE_LENGTH ) }
				className="nab-license-form__text-control"
				onChange={ ( v ) => setLicense( trim( v ) ) }
			/>
			<Button
				variant="primary"
				className="nab-license-form__button"
				disabled={
					license.length !== LICENSE_LENGTH &&
					license.length !== OLD_LICENSE_LENGTH
				}
				onClick={ () => {
					onClick();
					void linkSite( license );
				} }
			>
				{ _x( 'Apply', 'command', 'nelio-ab-testing' ) }
			</Button>
		</Popover>
	);
};
