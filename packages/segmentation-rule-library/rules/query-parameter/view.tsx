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
	attributes: { name, condition, value: originalValue },
}: SRViewProps< Attributes > ): JSX.Element => {
	if ( isEmpty( name ) ) {
		return (
			<>
				{ _x(
					'URL parameter to be defined.',
					'text',
					'nelio-ab-testing'
				) }
			</>
		);
	} //end if

	if ( condition === 'exists' ) {
		return createInterpolateElement(
			sprintf(
				/* translators: a parameter name */
				_x( 'URL parameter %s exists.', 'text', 'nelio-ab-testing' ),
				`<code>${ name }</code>`
			),
			{ code: <code /> }
		);
	} //end if

	if ( condition === 'does-not-exist' ) {
		return createInterpolateElement(
			sprintf(
				/* translators: a parameter name */
				_x(
					'URL parameter %s does not exist.',
					'text',
					'nelio-ab-testing'
				),
				`<code>${ name }</code>`
			),
			{ code: <code /> }
		);
	} //end if

	const value = originalValue
		.split( '\n' )
		.map( ( v ) => trim( v ) )
		.filter( ( v ) => !! v )
		.join( '\n' );

	if ( isEmpty( value ) ) {
		return (
			<>
				{ _x(
					'URL parameter’s value to be defined.',
					'text',
					'nelio-ab-testing'
				) }
			</>
		);
	} //end if

	switch ( condition ) {
		case 'is-equal-to':
			return createInterpolateElement(
				sprintf(
					/* translators: 1 - a parameter name, 2 - a text value */
					_x(
						'URL parameter %1$s is equal to %2$s.',
						'text',
						'nelio-ab-testing'
					),
					`<code>${ name }</code>`,
					`<code>${ value }</code>`
				),
				{ code: <code /> }
			);

		case 'is-not-equal-to':
			return createInterpolateElement(
				sprintf(
					/* translators: 1 - a parameter name, 2 - a text value */
					_x(
						'URL parameter %1$s is not equal to %2$s.',
						'text',
						'nelio-ab-testing'
					),
					`<code>${ name }</code>`,
					`<code>${ value }</code>`
				),
				{ code: <code /> }
			);

		case 'contains':
			return createInterpolateElement(
				sprintf(
					/* translators: 1 - a parameter name, 2 - a text value */
					_x(
						'URL parameter %1$s contains %2$s.',
						'text',
						'nelio-ab-testing'
					),
					`<code>${ name }</code>`,
					`<code>${ value }</code>`
				),
				{ code: <code /> }
			);

		case 'does-not-contain':
			return createInterpolateElement(
				sprintf(
					/* translators: 1 - a parameter name, 2 - list of parameter values */
					_x(
						'URL parameter %1$s does not contain %2$s.',
						'text',
						'nelio-ab-testing'
					),
					`<code>${ name }</code>`,
					`<code>${ value }</code>`
				),
				{ code: <code /> }
			);

		case 'is-any-of':
			return createInterpolateElement(
				sprintf(
					/* translators: 1 - a parameter name, 2 - list of parameter values */
					_x(
						'URL parameter %1$s is %2$s.',
						'text',
						'nelio-ab-testing'
					),
					`<code>${ name }</code>`,
					makeList( value )
				),
				{ code: <code /> }
			);

		case 'is-none-of':
			return createInterpolateElement(
				sprintf(
					/* translators: 1 - a parameter name, 2 - a text value */
					_x(
						'URL parameter %1$s is not %2$s.',
						'text',
						'nelio-ab-testing'
					),
					`<code>${ name }</code>`,
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
