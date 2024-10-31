/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export function isNamedForm( attributes: Attributes ): boolean {
	return (
		'nab_elementor_form' === attributes.formType ||
		'nab_hubspot_form' === attributes.formType
	);
} //end isNamedForm()

export function getNameFieldLabel( attributes: Attributes ): string {
	switch ( attributes.formType ) {
		case 'nab_hubspot_form':
			return _x( 'Form ID', 'text', 'nelio-ab-testing' );

		case 'nab_elementor_form':
		default:
			return _x( 'Form Name', 'text', 'nelio-ab-testing' );
	} //end switch
} //end getLabel()
