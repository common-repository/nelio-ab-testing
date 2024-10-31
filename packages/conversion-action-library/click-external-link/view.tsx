/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { createInterpolateElement } from '@safe-wordpress/element';
import { sprintf, _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { ConversionActionScopeView } from '@nab/components';
import type { CAViewProps } from '@nab/types';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export const View = ( props: CAViewProps< Attributes > ): JSX.Element => (
	<>
		<div>
			<ActualView { ...props } />
		</div>
		<ConversionActionScopeView scope={ props.scope } />
	</>
);

const ActualView = ( {
	attributes: { mode, value },
}: CAViewProps< Attributes > ): JSX.Element => (
	<>
		{ ! value &&
			_x( 'A visitor clicks on a link.', 'text', 'nelio-ab-testing' ) }

		{ value &&
			mode === 'partial' &&
			createInterpolateElement(
				sprintf(
					/* translators: some text that might appear in a URL, such as "wordpress", or "amazon", or "nelio" */
					_x(
						'A visitor clicks on a link whose URL contains this fragment: %s.',
						'text',
						'nelio-ab-testing'
					),
					`<code>${ value }</code>`
				),
				{ code: <code /> }
			) }

		{ value &&
			mode === 'start' &&
			createInterpolateElement(
				sprintf(
					/* translators: a URL fragment, such as "https://nelio" */
					_x(
						'A visitor clicks on a link whose URL starts with %s.',
						'text',
						'nelio-ab-testing'
					),
					`<code>${ value }</code>`
				),
				{ code: <code /> }
			) }

		{ value &&
			mode === 'end' &&
			createInterpolateElement(
				sprintf(
					/* translators: a URL fragment, such as "neliosoftware.com/blog/" */
					_x(
						'A visitor clicks on a link whose URL ends with %s.',
						'text',
						'nelio-ab-testing'
					),
					`<code>${ value }</code>`
				),
				{ code: <code /> }
			) }

		{ value &&
			! [ 'partial', 'start', 'end' ].includes( mode ) &&
			createInterpolateElement(
				sprintf(
					/* translators: a URL such as "https://wordpress.org" */
					_x(
						'A visitor clicks on a link with the URL %s.',
						'text',
						'nelio-ab-testing'
					),
					`<code>${ value }</code>`
				),
				{ code: <code /> }
			) }
	</>
);
