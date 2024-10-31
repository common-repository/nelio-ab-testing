/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NAB_DATA } from '@nab/data';
import type { ConversionAction, ConversionActionType } from '@nab/types';

/**
 * Internal dependencies
 */
import icon from './icon.svg';
import { Edit as edit } from './edit';
import { View as view } from './view';
import { validate } from './validate';

import type { Attributes } from './types';

export const name = 'nab/surecart-order';

export const settings: ConversionActionType< Attributes > = {
	name,
	title: _x( 'SureCart Purchase', 'text', 'nelio-ab-testing' ),
	description: _x(
		'Counts a SureCart purchase as a conversion.',
		'text',
		'nelio-ab-testing'
	),
	icon,
	validate,
	isActive: ( select ) =>
		select( NAB_DATA )
			.getActivePlugins()
			.includes( 'surecart/surecart.php' ),

	attributes: {
		type: 'surecart-selection',
		value: { type: 'all-surecart-products' },
	},

	scope: { type: 'php-function' },

	edit,
	view,
};

// ==========
// TYPESCRIPT
// ==========

declare module '@nab/conversion-actions' {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	// eslint-disable-next-line no-shadow, @typescript-eslint/no-shadow
	function createConversionAction(
		actionType: typeof name,
		attributes?: Partial< Attributes >
	): ConversionAction< Attributes >;
}
