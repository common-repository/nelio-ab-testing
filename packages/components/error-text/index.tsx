/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon } from '@safe-wordpress/components';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';

export type ErrorTextProps = {
	readonly className?: string;
	readonly value?: string;
	readonly hasIcon?: boolean;
};

export const ErrorText = ( {
	className,
	value,
	hasIcon = true,
}: ErrorTextProps ): JSX.Element | null => {
	if ( ! value ) {
		return null;
	} //end if

	return (
		<span className={ classnames( 'nab-error-text', className ) }>
			{ !! hasIcon && <Dashicon icon="warning" /> }
			{ value }
		</span>
	);
};
