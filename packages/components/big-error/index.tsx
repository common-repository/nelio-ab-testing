/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';
import Logo from './logo.svg';

export type BigErrorProps = {
	readonly className?: string;
	readonly text?: string;
};

export const BigError = ( { className, text }: BigErrorProps ): JSX.Element => (
	<div className={ classnames( [ 'nab-big-error', className ] ) }>
		<Logo className="nab-big-error__logo" />
		{ !! text && <p className="nab-big-error__text">{ text }</p> }
	</div>
);
