/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { isNamedForm } from './helpers';
import type { Attributes } from './types';

export function validate(
	attributes: Attributes
): Partial< Record< keyof Attributes, string > > {
	if ( ! isNamedForm( attributes ) && ! attributes.formId ) {
		return {
			formId: _x(
				'Please select a form to track its submissions',
				'user',
				'nelio-ab-testing'
			),
		};
	} //end if

	if ( isNamedForm( attributes ) && ! attributes.formName ) {
		return {
			formName: _x(
				'Please specify the form whose submissions you want to track',
				'user',
				'nelio-ab-testing'
			),
		};
	} //end if

	return {};
} //end validate()
