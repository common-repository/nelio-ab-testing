/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import apiFetch from '@safe-wordpress/api-fetch';
import domReady from '@safe-wordpress/dom-ready';
import { select } from '@safe-wordpress/data';
import { render } from '@safe-wordpress/element';
import { addQueryArgs } from '@safe-wordpress/url';

/**
 * External dependencies
 */
import { map, trim } from 'lodash';
import { store as NAB_DATA } from '@nab/data';
import type { SiteId, Url } from '@nab/types';

/**
 * Internal dependencies
 */
import { ContextualHelp } from './contextual-help';
import type { Question, TutorialStep } from './types';

type Args = {
	readonly screen: string;
	readonly questions: ReadonlyArray< Question >;
	readonly walkthrough?: ReadonlyArray< TutorialStep >;
};

export * from './types';

export function appendContextualHelp( {
	screen,
	questions,
	walkthrough = [],
}: Args ): void {
	domReady( () => {
		const wrapper = document.createElement( 'div' );
		document.body.appendChild( wrapper );

		const { getPluginSetting } = select( NAB_DATA );
		const siteId = getPluginSetting( 'siteId' );
		const homeUrl = getPluginSetting( 'homeUrl' );
		const isSubscribed = !! getPluginSetting( 'subscription' );
		const apiUrl = getPluginSetting( 'apiUrl' );

		render(
			<ContextualHelp
				screen={ screen }
				questions={ map( questions, addUtmArgs( screen ) ) }
				walkthrough={ walkthrough ?? [] }
				onSubmitTicket={ ( { email, description, success, error } ) => {
					success();
					apiFetch( {
						url: `${ apiUrl }/ticket`,
						credentials: 'omit',
						method: 'POST',
						mode: 'cors',
						data: {
							email,
							description: getDescription(
								description,
								siteId,
								homeUrl,
								isSubscribed
							),
							subject: `I need help in ${ screen }`,
						},
					} ).then( success, error );
				} }
			/>,
			wrapper
		);
	} );
} //end appendContextualHelp()

// =======
// HELPERS
// =======

const addUtmArgs = ( screen: string ) => ( question: Question ) => ( {
	...question,
	link: addQueryArgs( question.link, {
		utm_source: 'nelio-ab-testing',
		utm_medium: 'plugin',
		utm_campaign: 'support',
		utm_content: `${ screen }-page`,
	} ),
} );

function getDescription(
	description: string,
	siteId: SiteId,
	homeUrl: Url,
	isSubscribed: boolean
): string {
	const div = document.createElement( 'div' );
	const br = () => document.createElement( 'br' );

	const extra = document.createElement( 'strong' );
	extra.textContent = 'Additional Information';

	const ul = document.createElement( 'ul' );
	const li1 = document.createElement( 'li' );
	li1.textContent = `Site ID: ${ siteId }`;
	const li2 = document.createElement( 'li' );
	li2.textContent = `Site URL: ${ homeUrl }`;
	const li3 = document.createElement( 'li' );
	li3.textContent = `Subscribed: ${ isSubscribed ? 'yes' : 'no' }`;
	ul.appendChild( li1 );
	ul.appendChild( li2 );
	ul.appendChild( li3 );

	trim( description )
		.split( /\n+/ )
		.forEach( ( t ) => {
			const p = document.createTextNode( t );
			div.appendChild( p );
			div.appendChild( br() );
			div.appendChild( br() );
		} );

	div.appendChild( extra );
	div.appendChild( br() );
	div.appendChild( ul );

	return div.innerHTML;
}
