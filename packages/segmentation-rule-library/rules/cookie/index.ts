/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { SegmentationRuleType } from '@nab/types';

/**
 * Internal dependencies
 */
import icon from './icon.svg';
import { Edit as edit } from './edit';
import { View as view } from './view';
import { validate } from './validate';
import type { Attributes } from './types';

export const name = 'nab/cookie';

export const settings: SegmentationRuleType< Attributes > = {
	name,
	title: _x( 'Cookie', 'text', 'nelio-ab-testing' ),
	category: 'nab/others',
	icon,
	validate,
	singleton: false,

	attributes: {
		name: '',
		condition: 'is-equal-to',
		value: '',
	},

	edit,
	view,
};
