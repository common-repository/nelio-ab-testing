/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { createInterpolateElement } from '@safe-wordpress/element';
import { sprintf, _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { isEmpty, listify } from '@nab/utils';
import type { SRViewProps } from '@nab/types';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export const View = ( {
	attributes: { condition, values },
}: SRViewProps< Attributes > ): JSX.Element => {
	if ( isEmpty( values ) ) {
		return (
			<>
				{ _x(
					'Visitor’s operating system to be defined.',
					'text',
					'nelio-ab-testing'
				) }
			</>
		);
	} //end if

	const list = listify(
		'or',
		values.map( ( i ) => `<strong>${ i.label }</strong>` )
	);

	switch ( condition ) {
		case 'is-equal-to':
			return createInterpolateElement(
				sprintf(
					/* translators: an operating system name */
					_x(
						'Visitor’s operating system is %s.',
						'text',
						'nelio-ab-testing'
					),
					list
				),
				{ strong: <strong /> }
			);

		case 'is-not-equal-to':
			return createInterpolateElement(
				sprintf(
					/* translators: an operating system name */
					_x(
						'Visitor’s operating system is not %s.',
						'text',
						'nelio-ab-testing'
					),
					list
				),
				{ strong: <strong /> }
			);
	} //end switch
};
