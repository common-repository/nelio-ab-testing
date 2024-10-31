/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { PresetAlternative } from '@nab/components';
import type { ExperimentEditProps, TemplateId } from '@nab/types';

// NOTE. Dependency loop with @nab package.
import type { store as editorStore } from '@nab/editor';
const NAB_EDITOR = 'nab/editor' as unknown as typeof editorStore;

/**
 * Internal dependencies
 */
import type { ControlAttributes, AlternativeAttributes } from '../types';
import {
	areBuiltInTemplateAttributes,
	arePageBuilderTemplateAttributes,
} from './original';

export const Alternative = ( {
	attributes: { templateId, name },
	disabled,
	experimentType,
	setAttributes,
}: ExperimentEditProps< AlternativeAttributes > ): JSX.Element => {
	const context = useContext();
	return (
		<PresetAlternative
			experimentType={ experimentType }
			collection={ context }
			value={ templateId }
			onChange={ ( t ) =>
				t
					? setAttributes( {
							templateId: t.value as TemplateId,
							name: t.label,
					  } )
					: undefined
			}
			disabled={ disabled }
			labels={ {
				selection: name,
				selectAction: _x(
					'Please select a template…',
					'user',
					'nelio-ab-testing'
				),
				loading: _x( 'Loading templates…', 'text', 'nelio-ab-testing' ),
				empty: _x(
					'No templates available',
					'text',
					'nelio-ab-testing'
				),
				unknownOption: _x(
					'Template not found',
					'text',
					'nelio-ab-testing'
				),
			} }
		/>
	);
};

// =====
// HOOKS
// =====

const useContext = () =>
	useSelect( ( select ) => {
		const { getAlternative } = select( NAB_EDITOR );
		const control = getAlternative< ControlAttributes >( 'control' );

		if ( ! control?.attributes ) {
			return;
		} //end if

		if ( areBuiltInTemplateAttributes( control.attributes ) ) {
			return `wp:${ control.attributes.postType }`;
		} else if ( arePageBuilderTemplateAttributes( control.attributes ) ) {
			return `${ control.attributes.builder }:${ control.attributes.context }`;
		} //end if

		return undefined;
	} );
