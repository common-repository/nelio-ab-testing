/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { TextControl, SelectControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { ConversionActionScope, ErrorText } from '@nab/components';
import type { CAEditProps } from '@nab/types';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export const Edit = ( {
	attributes: { mode, value },
	scope,
	errors,
	setAttributes,
	setScope,
}: CAEditProps< Attributes > ): JSX.Element => (
	<>
		<SelectControl
			label={ _x( 'URL Matching Mode', 'text', 'nelio-ab-testing' ) }
			options={ [
				{
					value: 'exact' as const,
					label: _x(
						'URL exactly matches the expected value',
						'text',
						'nelio-ab-testing'
					),
				},
				{
					value: 'partial' as const,
					label: _x(
						'URL contains the expected value',
						'text',
						'nelio-ab-testing'
					),
				},
				{
					value: 'start' as const,
					label: _x(
						'URL starts with the expected value',
						'text',
						'nelio-ab-testing'
					),
				},
				{
					value: 'end' as const,
					label: _x(
						'URL ends with the expected value',
						'text',
						'nelio-ab-testing'
					),
				},
				{
					value: 'regex' as const,
					label: _x(
						'JavaScript Regular Expression',
						'text',
						'nelio-ab-testing'
					),
				},
			] }
			value={ mode }
			onChange={ ( newMode ) => setAttributes( { mode: newMode } ) }
		/>

		<TextControl
			className={ classnames( {
				'nab-conversion-action__field--has-errors': errors.value,
			} ) }
			label={ _x( 'Expected Value', 'text', 'nelio-ab-testing' ) }
			value={ value }
			help={ <ErrorText value={ errors.value } /> }
			placeholder={ _x( 'URL', 'text', 'nelio-ab-testing' ) }
			onChange={ ( newValue ) => setAttributes( { value: newValue } ) }
		/>

		<ConversionActionScope
			scope={ scope }
			setScope={ setScope }
			error={ errors._scope }
		/>
	</>
);
