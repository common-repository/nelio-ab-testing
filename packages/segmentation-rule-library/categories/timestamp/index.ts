/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { SegmentationRuleCategory } from '@nab/types';

/**
 * Internal dependencies
 */
import icon from './icon.svg';

export const name = 'nab/timestamp';

export const settings: Omit< SegmentationRuleCategory, 'name' > = {
	title: _x( 'Day/Time', 'text', 'nelio-ab-testing' ),
	icon,
};
