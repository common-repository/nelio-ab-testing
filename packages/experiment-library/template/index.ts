/**
 * WordPress dependencies
 */
import { sprintf, _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { values } from 'lodash';
import { store as NAB_DATA } from '@nab/data';
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
	name: 'nab/template' as const,
	category: 'global',
	title: _x( 'Template', 'text (experiment name)', 'nelio-ab-testing' ),
	description: _x(
		'Test different templates on your site',
		'user',
		'nelio-ab-testing'
	),
	icon,
	supports: {
		presetAlternatives: ( select, collection ) => {
			const { getTemplates } = select( NAB_DATA );
			const templatesByContext = getTemplates();

			if ( ! templatesByContext ) {
				return false;
			} //end if

			if ( 'nab-check-availability' === collection ) {
				return values( templatesByContext ).some(
					( templates ) => 2 <= templates.length
				);
			} //end if

			const contextTemplates = templatesByContext[ collection ] || [];
			return contextTemplates.map( ( template ) => ( {
				value: template.id,
				label: template.name,
			} ) );
		},
	},
	checks: {
		getControlError: ( control ) => {
			if ( ! control.templateId ) {
				return _x(
					'Please select the template you want to test',
					'user',
					'nelio-ab-testing'
				);
			} //end if
			return false;
		},
		getAlternativeError: ( alternative, letter ) => {
			if ( ! alternative.templateId ) {
				return sprintf(
					/* translators: letter of the variant */
					_x(
						'Please select a template in variant %s',
						'user',
						'nelio-ab-testing'
					),
					letter
				);
			} //end if

			return false;
		},
		isAlternativePreviewDisabled: ( alternative ) =>
			! alternative.templateId,
	},
	help: {
		original: _x(
			'Split tests of page templates help you to improve the conversion rate of your site by switching the appearance of the post types that use a certain template. The control version (commonly known as the “A” version) are those elements that use the specified template.',
			'user',
			'nelio-ab-testing'
		),
		alternative: _x(
			'You can test the selected template against one or more alternative templates from those available in your WordPress site.',
			'user',
			'nelio-ab-testing'
		),
	},
	defaults: {
		original: {
			postType: '',
			name: '',
		},
		alternative: {
			name: '',
		},
	},
	views: {
		original: Original,
		alternative: Alternative,
	},
};
