/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { TextControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';

import { useAttributes } from '../hooks';

import { DEFAULT_ATTRS } from './config';
import type { FieldSettingProps } from '../types';

export const GdprCookieSetting = ( {
	name: settingName,
}: FieldSettingProps ): JSX.Element => {
	const [ attributes, setAttributes ] = useAttributes(
		settingName,
		DEFAULT_ATTRS
	);
	const { name, value, _placeholder } = attributes;

	return (
		<div className="nab-gdpr-cookie-setting">
			<TextControl
				value={ name }
				onChange={ ( v ) => setAttributes( { name: v } ) }
				placeholder={
					_placeholder ||
					_x( 'Cookie Name', 'text', 'nelio-ab-testing' )
				}
			/>
			{ !! name && (
				<TextControl
					value={ value }
					onChange={ ( v ) => setAttributes( { value: v } ) }
					placeholder={ _x(
						'Optional Cookie Value',
						'text',
						'nelio-ab-testing'
					) }
				/>
			) }
			<input
				type="hidden"
				name={ settingName }
				value={ JSON.stringify( { name, value } ) }
			/>
		</div>
	);
};
