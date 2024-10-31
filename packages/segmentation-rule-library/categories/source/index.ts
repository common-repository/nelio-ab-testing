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

export const name = 'nab/source';

export const settings: Omit< SegmentationRuleCategory, 'name' > = {
	title: _x( 'Source', 'text', 'nelio-ab-testing' ),
	icon,
};
