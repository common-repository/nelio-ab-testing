/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { createInterpolateElement } from '@safe-wordpress/element';
import { sprintf, _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { SRViewProps } from '@nab/types';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export const View = ( {
	attributes: { condition, value, interval },
}: SRViewProps< Attributes > ): JSX.Element => {
	switch ( condition ) {
		case 'is-greater-than':
			return createInterpolateElement(
				sprintf(
					/* translators: a number */
					_x(
						'Window width is greater than %s pixels.',
						'text',
						'nelio-ab-testing'
					),
					`<strong>${ value ?? 0 }</strong>`
				),
				{ strong: <strong /> }
			);

		case 'is-less-than':
			return createInterpolateElement(
				sprintf(
					/* translators: a number */
					_x(
						'Window width is less than %s pixels.',
						'text',
						'nelio-ab-testing'
					),
					`<strong>${ value ?? 0 }</strong>`
				),
				{ strong: <strong /> }
			);

		case 'between':
			const { min, max } = interval;
			if ( undefined === min || undefined === max || min >= max ) {
				return (
					<>
						{ _x(
							'Window width interval to be defined.',
							'text',
							'nelio-ab-testing'
						) }
					</>
				);
			} //end if

			return createInterpolateElement(
				sprintf(
					/* translators: 1 - a number, 2 - a number */
					_x(
						'Window width is between %1$s and %2$s pixels.',
						'text',
						'nelio-ab-testing'
					),
					`<strong>${ min }</strong>`,
					`<strong>${ max }</strong>`
				),
				{ strong: <strong /> }
			);
	} //end switch
};
