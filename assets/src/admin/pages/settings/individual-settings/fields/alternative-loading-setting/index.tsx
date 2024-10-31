/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { CheckboxControl } from '@safe-wordpress/components';
import { createInterpolateElement, useEffect } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';

import { useAttributes } from '../hooks';

import { DEFAULT_ATTRS } from './config';
import type { FieldSettingProps } from '../types';

const INCOMPATIBLE_SETTINGS = [ 'match_all_segments', 'preload_query_args' ];

const PARTICIPATION_SETTINGS = [
	'exclude_bots',
	'percentage_of_tested_visitors',
];

export const AlternativeLoadingSetting = ( {
	name,
}: FieldSettingProps ): JSX.Element => {
	const [ attributes, setAttributes ] = useAttributes( name, DEFAULT_ATTRS );

	useEffect( () => {
		INCOMPATIBLE_SETTINGS.forEach(
			attributes.mode === 'cookie' ? lock : unlock
		);
		PARTICIPATION_SETTINGS.forEach(
			attributes.mode === 'cookie' && attributes.lockParticipationSettings
				? lock
				: unlock
		);
	}, [ attributes ] );

	return (
		<div id="alternative-loading-setting">
			<CheckboxControl
				label={ createInterpolateElement(
					sprintf(
						'%1$s <link>%2$s</link>',
						sprintf(
							/* translators: a cookie name */
							_x(
								'Load variants using %s cookie',
								'command',
								'nelio-ab-testing'
							),
							'<code>nabAlternative</code>'
						),
						_x( 'Read more…', 'user', 'nelio-ab-testing' )
					),
					{
						code: <code />,
						link: (
							// eslint-disable-next-line
							<a href="https://neliosoftware.com/testing/help/is-nelio-ab-testing-compatible-with-cache-plugins/#toc-method-2-cookie-based-testing-with-dynamic-caching-beta-6" />
						),
					}
				) }
				checked={ 'cookie' === attributes.mode }
				onChange={ ( checked ) =>
					setAttributes( {
						mode: checked ? 'cookie' : 'redirection',
					} )
				}
			/>

			{ 'cookie' === attributes.mode && (
				<CheckboxControl
					label={ _x(
						'Run JavaScript redirection if cookie is missing',
						'command',
						'nelio-ab-testing'
					) }
					checked={ !! attributes.redirectIfCookieIsMissing }
					onChange={ ( checked ) =>
						setAttributes( {
							redirectIfCookieIsMissing: checked || undefined,
						} )
					}
				/>
			) }

			{ 'cookie' === attributes.mode && (
				<CheckboxControl
					label={ _x(
						'Lock participation settings',
						'command',
						'nelio-ab-testing'
					) }
					checked={ !! attributes.lockParticipationSettings }
					onChange={ ( checked ) =>
						setAttributes( {
							lockParticipationSettings: checked || undefined,
						} )
					}
				/>
			) }

			<input
				type="hidden"
				name={ name }
				value={ JSON.stringify( attributes ) }
			/>
		</div>
	);
};

// =======
// HELPERS
// =======

function lock( id: string ): void {
	id = id.replaceAll( '_', '-' );
	const el = document.getElementById( id );
	if ( el && 'disabled' in el ) {
		el.disabled = true;
	} //end if
	const parent = el?.parentElement;
	if ( parent ) {
		parent.style.opacity = '0.8';
	} //end if
} //end lock

function unlock( id: string ): void {
	id = id.replaceAll( '_', '-' );
	const el = document.getElementById( id );
	if ( el && 'disabled' in el ) {
		el.disabled = false;
	} //end if
	const parent = el?.parentElement;
	if ( parent ) {
		parent.style.opacity = '';
	} //end if
} //end lock
