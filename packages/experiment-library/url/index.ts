/**
 * WordPress dependencies
 */
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { getLocalUrlError } from '@nab/utils';
import { store as NC_DATA } from '@nab/data';
import type { ExperimentType } from '@nab/types';

/**
 * Internal dependencies
 */
import icon from './icon.svg';
import { Original } from './components/original';
import { Alternative } from './components/alternative';

import type { ControlAttributes, AlternativeAttributes } from './types';

export const settings: ExperimentType<
	ControlAttributes,
	AlternativeAttributes
> = {
	name: 'nab/url' as const,
	category: 'page',
	title: _x( 'URL', 'text (experiment name)', 'nelio-ab-testing' ),
	description: _x( 'Test alternative URLs', 'user', 'nelio-ab-testing' ),
	icon,
	supports: {},
	checks: {
		getControlError: ( control, select ) => {
			const homeUrl = select( NC_DATA ).getPluginSetting( 'homeUrl' );
			const error = getLocalUrlError( control.url, homeUrl );
			return getError( 'A', error );
		},
		getAlternativeError: ( alternative, letter, _, select ) => {
			const homeUrl = select( NC_DATA ).getPluginSetting( 'homeUrl' );
			const error = getLocalUrlError( alternative.url, homeUrl );
			return getError( letter, error );
		},
		isAlternativePreviewDisabled: ( alternative, _, select ) => {
			const homeUrl = select( NC_DATA ).getPluginSetting( 'homeUrl' );
			return !! getLocalUrlError( alternative.url, homeUrl );
		},
	},
	help: {
		original: _x(
			'URL split tests help you to improve the conversion rate of your WordPress site by defining one or more variants. The control version (commonly known as the “A” version) is the selected URL from your site (such as, for instance, the home page or a contact us page) you want to run the test on.',
			'user',
			'nelio-ab-testing'
		),
		alternative: _x(
			'You can create one or more variants of your tested URL. When the visitor visits the original URL, she may be redirected to one of the variants in the list.',
			'user',
			'nelio-ab-testing'
		),
	},
	defaults: {
		original: {
			url: '',
		},
		alternative: {
			url: '',
		},
	},
	views: {
		original: Original,
		alternative: Alternative,
	},
};

// =======
// HELPERS
// =======

function getError( letter: string, error: string | false ) {
	return (
		!! error &&
		sprintf(
			/* translators: 1 -> letter of the variant, 2 -> error description */
			_x(
				'There’s an error in variant %1$s. %2$s',
				'text',
				'nelio-ab-testing'
			),
			letter,
			error
		)
	);
} //end getError()
