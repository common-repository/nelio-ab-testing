/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { TextControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { ExperimentEditProps } from '@nab/types';

type Attributes = { readonly name: string };

export type DefaultAlternativeProps = {
	readonly disabled?: boolean;
	readonly placeholder?: string;
} & ExperimentEditProps< Attributes >;

export const DefaultAlternative = ( {
	attributes,
	disabled,
	placeholder = _x( 'Describe your variant…', 'user', 'nelio-ab-testing' ),
	setAttributes,
}: DefaultAlternativeProps ): JSX.Element => (
	<TextControl
		disabled={ disabled }
		value={ attributes.name || '' }
		onChange={ ( value: string ) => setAttributes( { name: value } ) }
		placeholder={ placeholder }
	/>
);
