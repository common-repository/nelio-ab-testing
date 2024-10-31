/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export function validate( {
	condition,
	value,
	interval,
}: Attributes ): Partial< Record< keyof Attributes, string > > {
	if ( 'between' !== condition && ! value ) {
		return {
			value: _x(
				'Please write a value for the window width',
				'user',
				'nelio-ab-testing'
			),
		};
	} //end if

	if ( 'between' === condition ) {
		if ( ! interval.min ) {
			return {
				value: _x(
					'Please write a minimum value for the window width',
					'user',
					'nelio-ab-testing'
				),
			};
		} //end if

		if ( ! interval.max ) {
			return {
				interval: _x(
					'Please write a maximum value for the window width',
					'user',
					'nelio-ab-testing'
				),
			};
		} //end if

		if ( interval.min >= interval.max ) {
			return {
				interval: _x(
					'Please write a maximum value greater than the minimum value for the window width',
					'user',
					'nelio-ab-testing'
				),
			};
		} //end if
	} //end if

	return {};
} //end validate()
