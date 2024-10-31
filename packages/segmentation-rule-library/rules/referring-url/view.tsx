/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { createInterpolateElement } from '@safe-wordpress/element';
import { sprintf, _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim } from 'lodash';
import { isEmpty, listify } from '@nab/utils';
import type { SRViewProps } from '@nab/types';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export const View = ( {
	attributes: { condition, value: originalValue },
}: SRViewProps< Attributes > ): JSX.Element => {
	const value = originalValue
		.split( '\n' )
		.map( ( v ) => trim( v ) )
		.filter( ( v ) => !! v )
		.join( '\n' );

	if ( isEmpty( trim( value ) ) ) {
		return <>{ _x( 'URL to be defined.', 'text', 'nelio-ab-testing' ) }</>;
	} //end if

	switch ( condition ) {
		case 'is-equal-to':
			return createInterpolateElement(
				sprintf(
					/* translators: an URL */
					_x(
						'Referring URL is equal to %s.',
						'text',
						'nelio-ab-testing'
					),
					`<code>${ value }</code>`
				),
				{ code: <code /> }
			);

		case 'is-not-equal-to':
			return createInterpolateElement(
				sprintf(
					/* translators: an URL */
					_x(
						'Referring URL is not equal to %s.',
						'text',
						'nelio-ab-testing'
					),
					`<code>${ value }</code>`
				),
				{ code: <code /> }
			);

		case 'contains':
			return createInterpolateElement(
				sprintf(
					/* translators: a text */
					_x(
						'Referring URL contains %s.',
						'text',
						'nelio-ab-testing'
					),
					`<code>${ value }</code>`
				),
				{ code: <code /> }
			);

		case 'does-not-contain':
			return createInterpolateElement(
				sprintf(
					/* translators: a text */
					_x(
						'Referring URL does not contain %s.',
						'text',
						'nelio-ab-testing'
					),
					`<code>${ value }</code>`
				),
				{ code: <code /> }
			);

		case 'is-any-of':
			return createInterpolateElement(
				sprintf(
					/* translators: list of URL values */
					_x( 'Referring URL is %s.', 'text', 'nelio-ab-testing' ),
					makeList( value )
				),
				{ code: <code /> }
			);

		case 'is-none-of':
			return createInterpolateElement(
				sprintf(
					/* translators: list of URL values */
					_x(
						'Referring URL is not %s.',
						'text',
						'nelio-ab-testing'
					),
					makeList( value )
				),
				{ code: <code /> }
			);
	} //end switch
};

// =======
// HELPERS
// =======

const makeList = ( value: string ): string =>
	listify(
		'or',
		value
			.split( '\n' )
			.map( ( v ) => trim( v ) )
			.filter( ( v ) => !! v )
			.map( ( v ) => `<code>${ v }</code>` )
	);
