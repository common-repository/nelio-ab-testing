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

export type LoadingAnimationProps = {
	readonly className?: string;
	readonly text?: string;
};

export const LoadingAnimation = ( {
	className,
	text,
}: LoadingAnimationProps ): JSX.Element => (
	<div className={ classnames( [ 'nab-loading-animation', className ] ) }>
		<Logo className="nab-loading-animation__logo" />
		{ !! text && <p className="nab-loading-animation__text">{ text }</p> }
	</div>
);
