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
	const wildcard = usesWildcard( values );

	if ( isEmpty( values ) ) {
		return (
			<>
				{ _x(
					'Visitor’s IP address to be defined.',
					'text',
					'nelio-ab-testing'
				) }
			</>
		);
	} //end if

	const list = listify(
		'or',
		values.map( ( i ) => `<strong>${ i }</strong>` )
	);

	switch ( condition ) {
		case 'is-equal-to':
			const isEqualTo = wildcard
				? /* translators: list of IP addresses */
				  _x(
						'Visitor’s IP address matches %s.',
						'text',
						'nelio-ab-testing'
				  )
				: /* translators: list of IP addresses */
				  _x(
						'Visitor’s IP address is %s.',
						'text',
						'nelio-ab-testing'
				  );
			return createInterpolateElement( sprintf( isEqualTo, list ), {
				strong: <strong />,
			} );

		case 'is-not-equal-to':
			const isNotEqualTo = wildcard
				? /* translators: list of IP addresses */
				  _x(
						'Visitor’s IP address does not match %s.',
						'text',
						'nelio-ab-testing'
				  )
				: /* translators: list of IP addresses */
				  _x(
						'Visitor’s IP address is not %s.',
						'text',
						'nelio-ab-testing'
				  );
			return createInterpolateElement( sprintf( isNotEqualTo, list ), {
				strong: <strong />,
			} );
	} //end switch
};

function usesWildcard( values: ReadonlyArray< string > ) {
	return values.some( ( value ) => value.includes( '*' ) );
} //end usesWildcard()
