/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import apiFetch from '@safe-wordpress/api-fetch';

/**
 * External dependencies
 */
import { usePageAttribute } from '@nab/data';

/**
 * Internal dependencies
 */
import './style.scss';
import Logo from '../../../../../images/full-logo.svg';

import { WelcomeNewUser } from './new-user';

export const WelcomeBox = (): JSX.Element => {
	const [ isInitializingPlugin, initPlugin ] = usePluginInitializer();
	const [ isPolicyAccepted, togglePolicy ] = usePageAttribute(
		'welcome/isPolicyAccepted',
		false
	);

	return (
		<div className="nab-welcome-message">
			<Logo
				className="nab-welcome-message__logo"
				title="Nelio A/B Testing"
				alt="Nelio A/B Testing"
			/>

			<WelcomeNewUser
				initPluginInAws={ initPlugin }
				isPluginBeingInitialized={ isInitializingPlugin }
				isPolicyAccepted={ isPolicyAccepted }
				togglePolicy={ togglePolicy }
			/>
		</div>
	);
};

// =====
// HOOKS
// =====

const usePluginInitializer = () => {
	const [ initting, markAsInitting ] = usePageAttribute(
		'welcome/isPluginBeingInitialized',
		false
	);

	const init = () => {
		markAsInitting( true );
		void apiFetch< string >( {
			path: '/nab/v1/site/free',
			method: 'POST',
		} ).then( ( url ) => {
			window.location.href = url;
		} );
	};
	return [ initting, init ] as const;
};
