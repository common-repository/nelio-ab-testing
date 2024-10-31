/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { createConversionAction } from '@nab/conversion-actions';
import type { ExperimentType } from '@nab/types';

/**
 * Internal dependencies
 */
import icon from './icon.svg';
import { Original } from './components/original-headline';
import { Alternative } from './components/alternative-headline';

import type { ControlAttributes, AlternativeAttributes } from './types';

export const settings: ExperimentType<
	ControlAttributes,
	AlternativeAttributes
> = {
	name: 'nab/headline' as const,
	category: 'page',
	title: _x( 'Headline', 'text (experiment name)', 'nelio-ab-testing' ),
	description: _x(
		'Test alternative versions of a title, featured image, and excerpt',
		'user',
		'nelio-ab-testing'
	),
	icon,
	supports: {
		alternativeApplication: true,
		automaticGoalSetup: ( control ) => [
			{
				...createConversionAction( 'nab/page-view', {
					postType: 'post',
					postId: control.postId,
				} ),
				scope: {
					type: 'post-ids',
					ids: control.postId ? [ control.postId ] : [],
				},
			},
		],
		postTypes: 'post',
		scope: 'custom-with-tested-post',
	},
	checks: {
		getControlError: ( control ) => {
			if ( ! control.postId ) {
				return _x(
					'Please select the post whose headline you want to test',
					'user',
					'nelio-ab-testing'
				);
			} //end if

			return false;
		},
		getAlternativeError: () => false,
	},
	help: {
		original: _x(
			'Headline split tests help you to improve the engagement with your audience by creating one or more variants of the title, excerpt, and featured image of a blog post. The control version (commonly known as the “A” version) is the already-existing blog post you want to test with its current headline.',
			'user',
			'nelio-ab-testing'
		),
		alternative: _x(
			'Here you can create and edit one or more variants of your tested post’s headline. By default, each variant you create will use the post’s current headline.',
			'user',
			'nelio-ab-testing'
		),
	},
	defaults: {
		original: {
			postType: 'post',
			postId: 0,
		},
		alternative: {
			name: '',
			excerpt: '',
			imageId: 0,
			imageUrl: '',
		},
	},
	views: {
		original: Original,
		alternative: Alternative,
	},
};
