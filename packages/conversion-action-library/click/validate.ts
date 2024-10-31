/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export function validate(
	attributes: Attributes
): Partial< Record< keyof Attributes, string > > {
	const { mode, value } = attributes;

	if ( ! value ) {
		switch ( mode ) {
			case 'css':
				return {
					value: _x(
						'Please write a CSS selector that matches the elements you want to track',
						'user',
						'nelio-ab-testing'
					),
				};

			case 'id':
				return {
					value: _x(
						'Please write the ID of the element you want to track',
						'user',
						'nelio-ab-testing'
					),
				};

			case 'class':
				return {
					value: _x(
						'Please write a class name of the element you want to track',
						'user',
						'nelio-ab-testing'
					),
				};
		} //end switch
	} //end if

	switch ( mode ) {
		case 'css':
			return isCssValueInvalid( value );

		case 'id':
			return isIdValueInvalid( value );

		case 'class':
			return isClassValueInvalid( value );
	} //end switch
} //end validate()

// =======
// HELPERS
// =======

const dummy = document.createElement( 'br' );

const isCssValueInvalid = ( value: string ) => {
	try {
		dummy.querySelector( value );
	} catch ( _ ) {
		return {
			value: _x(
				'Please use a valid CSS selector. For instance, you can use a tag name such as “a” or “div,” a class selector such as “.some-class,” or more complex rules such as “section.content button.subscribe”',
				'user',
				'nelio-ab-testing'
			),
		};
	} //end try

	return {};
};

const isIdValueInvalid = ( value: string ) => {
	if ( /^#[a-zA-Z0-9-_]+$/.test( value ) ) {
		return {
			value: _x(
				'The ID of an element should only contain letters, numbers, hyphens, and underscores',
				'text',
				'nelio-ab-testing'
			),
		};
	} //end if

	if ( ! /^[a-zA-Z0-9-_]+$/.test( value ) ) {
		return {
			value: _x(
				'The ID of an element should only contain letters, numbers, hyphens, and underscores',
				'text',
				'nelio-ab-testing'
			),
		};
	} //end if

	return {};
};

const isClassValueInvalid = ( value: string ) => {
	if ( /^\.[a-zA-Z0-9-_]+$/.test( value ) ) {
		return {
			value: _x(
				'A class name of an element should only contain letters, numbers, hyphens, and underscores',
				'text',
				'nelio-ab-testing'
			),
		};
	} //end if

	if ( ! /^[a-zA-Z0-9-_]+$/.test( value ) ) {
		return {
			value: _x(
				'A class name of an element should only contain letters, numbers, hyphens, and underscores',
				'text',
				'nelio-ab-testing'
			),
		};
	} //end if

	return {};
};
