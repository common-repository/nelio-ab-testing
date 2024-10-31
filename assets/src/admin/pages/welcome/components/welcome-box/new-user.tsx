/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	Button,
	CheckboxControl,
	ExternalLink,
} from '@safe-wordpress/components';
import { createInterpolateElement } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { addFreeTracker } from '@nab/utils';

export type WelcomeNewUserProps = {
	readonly initPluginInAws: () => void;
	readonly isPluginBeingInitialized: boolean;
	readonly isPolicyAccepted: boolean;
	readonly togglePolicy: ( val: boolean ) => void;
};

export const WelcomeNewUser = ( {
	initPluginInAws,
	isPluginBeingInitialized,
	isPolicyAccepted,
	togglePolicy,
}: WelcomeNewUserProps ): JSX.Element => (
	<>
		<p className="nab-welcome-message__intro">
			{ createInterpolateElement(
				sprintf(
					/* translators: plugin name (Nelio A/B Testing) */
					_x( '%s is almost ready!', 'text', 'nelio-ab-testing' ),
					'<strong>Nelio A/B Testing</strong>'
				),
				{ strong: <strong /> }
			) }
		</p>

		<div className="nab-welcome-message__policy">
			<CheckboxControl
				label={ createInterpolateElement(
					_x(
						'Please accept our <tac>Terms and Conditions</tac> and <policy>Privacy Policy</policy> to start using Nelio A/B Testing in this site.',
						'user',
						'nelio-ab-testing'
					),
					{
						tac: (
							// @ts-expect-error children prop is set by createInterpolateComponent.
							<ExternalLink
								href={ addFreeTracker(
									_x(
										'https://neliosoftware.com/legal-information/nelio-ab-testing-terms-conditions/',
										'text',
										'nelio-ab-testing'
									)
								) }
							/>
						),
						policy: (
							// @ts-expect-error children prop is set by createInterpolateComponent.
							<ExternalLink
								href={ addFreeTracker(
									_x(
										'https://neliosoftware.com/privacy-policy-cookies/',
										'text',
										'nelio-ab-testing'
									)
								) }
							/>
						),
					}
				) }
				disabled={ isPluginBeingInitialized }
				checked={ isPolicyAccepted }
				onChange={ togglePolicy }
			/>
		</div>

		<div className="nab-welcome-message__actions">
			<Button
				className="nab-welcome-message__start"
				variant="primary"
				disabled={ isPluginBeingInitialized || ! isPolicyAccepted }
				onClick={ () => initPluginInAws() }
			>
				{ isPluginBeingInitialized
					? _x( 'Loading…', 'text', 'nelio-ab-testing' )
					: _x( 'Continue »', 'command', 'nelio-ab-testing' ) }
			</Button>
		</div>
	</>
);
