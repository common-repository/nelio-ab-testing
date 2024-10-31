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
import type { Attributes } from './types';

export const name = 'nab/user-login';

export const settings: SegmentationRuleType< Attributes > = {
	name,
	title: _x( 'User Login', 'text', 'nelio-ab-testing' ),
	category: 'nab/visitor',
	icon,
	singleton: true,

	attributes: {
		condition: 'is-logged-in',
	},

	edit,
	view,
};
