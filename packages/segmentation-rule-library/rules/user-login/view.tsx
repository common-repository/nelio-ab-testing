/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/*
 * External dependencies
 */
import type { SRViewProps } from '@nab/types';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export const View = ( {
	attributes: { condition },
}: SRViewProps< Attributes > ): JSX.Element => {
	switch ( condition ) {
		case 'is-logged-in':
			return (
				<>
					{ _x(
						'Visitor is logged in.',
						'text',
						'nelio-ab-testing'
					) }
				</>
			);
		case 'is-not-logged-in':
			return (
				<>
					{ _x(
						'Visitor is not logged in.',
						'text',
						'nelio-ab-testing'
					) }
				</>
			);
	} //end switch
};
