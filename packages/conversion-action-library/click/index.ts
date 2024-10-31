/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { ConversionAction, ConversionActionType } from '@nab/types';

/**
 * Internal dependencies
 */
import icon from './icon.svg';
import { Edit as edit } from './edit';
import { View as view } from './view';
import { validate } from './validate';

import type { Attributes } from './types';

export const name = 'nab/click';

export const settings: ConversionActionType< Attributes > = {
	name,
	title: _x( 'Click', 'text', 'nelio-ab-testing' ),
	description: _x(
		'Counts a click as a conversion.',
		'text',
		'nelio-ab-testing'
	),
	icon,
	validate,

	attributes: {
		mode: 'css',
		value: '',
	},

	scope: { type: 'test-scope' },

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
		attributes: Partial< Attributes >
	): ConversionAction< Attributes >;
}
