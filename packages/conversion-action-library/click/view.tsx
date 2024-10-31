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
}: CAViewProps< Attributes > ): JSX.Element => {
	if ( ! value ) {
		return (
			<>
				{ _x(
					'A visitor clicks on an HTML element.',
					'text',
					'nelio-ab-testing'
				) }
			</>
		);
	} //end if

	switch ( mode ) {
		case 'css':
			return (
				<>
					{ createInterpolateElement(
						sprintf(
							/* translators: a CSS selector, such as "a.button" */
							_x(
								'A visitor clicks on an element matching the CSS selector %s.',
								'text',
								'nelio-ab-testing'
							),
							`<code>${ value }</code>`
						),
						{ code: <code /> }
					) }
				</>
			);

		case 'id':
			return (
				<>
					{ createInterpolateElement(
						sprintf(
							/* translators: an HTML id, such as "content" */
							_x(
								'A visitor clicks on the %s element',
								'text',
								'nelio-ab-testing'
							),
							`<code>${ value }</code>`
						),
						{ code: <code /> }
					) }
				</>
			);

		case 'class':
			return (
				<>
					{ createInterpolateElement(
						sprintf(
							/* translators: an HTML id, such as "content" */
							_x(
								'A visitor clicks on an element with class %s',
								'text',
								'nelio-ab-testing'
							),
							`<code>${ value }</code>`
						),
						{ code: <code /> }
					) }
				</>
			);
	} //end switch
};
