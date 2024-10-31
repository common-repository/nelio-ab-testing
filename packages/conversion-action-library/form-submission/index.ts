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

export const name = 'nab/form-submission';

export const settings: ConversionActionType< Attributes > = {
	name,
	title: _x( 'Form submission', 'text', 'nelio-ab-testing' ),
	description: _x(
		'Counts a form submission as a conversion.',
		'text',
		'nelio-ab-testing'
	),
	icon,
	validate,
	isActive: ( select ) =>
		select( NAB_DATA )
			.getKindEntities()
			.some( ( e ) => 'form' === e.kind ),

	attributes: {
		formType: '',
		formId: 0,
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
