/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { SelectControl } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { PresetAlternative } from '@nab/components';
import { store as NAB_DATA } from '@nab/data';
import { isEmpty, omitUndefineds } from '@nab/utils';
import type {
	Alternative as AlternativeType,
	ExperimentEditProps,
	Maybe,
	TemplateId,
} from '@nab/types';

// NOTE. Dependency loop with @nab package.
import type { store as editorStore } from '@nab/editor';
const NAB_EDITOR = 'nab/editor' as unknown as typeof editorStore;

/**
 * Internal dependencies
 */
import './style.scss';
import type {
	ControlAttributes,
	AlternativeAttributes,
	BuiltInTemplateAttributes,
	PageBuilderTemplateAttributes,
} from '../../types';

export const Original = (
	props: ExperimentEditProps< ControlAttributes >
): JSX.Element => {
	const { experimentType } = props;
	const { attributes } = props;
	const { templateId, name } = attributes;

	const templates = useTemplates();
	const templateContexts = useTemplateContexts();
	const setAttributes = useTemplateSetter(
		templateId ?? '',
		props.setAttributes
	);

	const selectableContexts = Object.keys( templateContexts )
		.map( ( tcg ) =>
			Object.values( templateContexts[ tcg ]?.contexts ?? {} ).map(
				( tc ) => ( {
					label: tc.label,
					name: `${ tcg }:${ tc.name }`,
				} )
			)
		)
		.flatMap( ( x ) => x )
		.filter( ( x ) => templates[ x.name ]?.length );

	let context: Maybe< string >;
	if ( areBuiltInTemplateAttributes( attributes ) ) {
		context = `wp:${ attributes.postType }`;
	} else if ( arePageBuilderTemplateAttributes( attributes ) ) {
		context = `${ attributes.builder }:${ attributes.context }`;
	} else {
		context = selectableContexts[ 0 ]?.name;
	} //end if

	const selectedTemplate = templateId;
	const selectableTemplates = context ? templates[ context ] : [];

	const getAttributesPerContext = (
		value: string
	): Partial< ControlAttributes > =>
		value.startsWith( 'wp:' )
			? {
					builder: '',
					context: '',
					templateId: undefined,
					postType: value.split( ':' )[ 1 ],
					name: '',
			  }
			: {
					postType: '',
					templateId: undefined,
					builder: value.split( ':' )[ 0 ],
					context: value.split( ':' )[ 1 ],
					name: '',
			  };

	return (
		<div className="nab-template-original-alternative">
			{ /* @ts-expect-error “children” is an alternative to “options,” according to documentation." */ }
			<SelectControl
				value={ context }
				disabled={ !! templateId || isEmpty( selectableContexts ) }
				onChange={ ( value ) =>
					setAttributes( getAttributesPerContext( value ) )
				}
			>
				{ Object.keys( templateContexts )
					.filter( ( tcg ) =>
						Object.keys(
							templateContexts[ tcg ]?.contexts ?? {}
						).some(
							( tc ) => templates[ `${ tcg }:${ tc }` ]?.length
						)
					)
					.map( ( tcg, idx ) => (
						<optgroup
							key={ idx }
							label={ templateContexts[ tcg ]?.label }
						>
							{ Object.keys(
								templateContexts[ tcg ]?.contexts ?? {}
							)
								.filter(
									( tc ) =>
										templates[ `${ tcg }:${ tc }` ]?.length
								)
								.map( ( tc, k ) => (
									<option
										key={ k }
										value={ `${ tcg }:${ templateContexts[ tcg ]?.contexts[ tc ]?.name }` }
									>
										{
											templateContexts[ tcg ]?.contexts[
												tc
											]?.label
										}
									</option>
								) ) }
						</optgroup>
					) ) }
			</SelectControl>
			<PresetAlternative
				experimentType={ experimentType }
				collection={ context }
				value={ selectedTemplate }
				onChange={ ( template ) => {
					if ( ! template || ! context ) {
						return;
					} //end if

					setAttributes( {
						...getAttributesPerContext( context ),
						templateId: template.value as TemplateId,
						name:
							template?.label ??
							_x(
								'Unnamed template',
								'text',
								'nelio-ab-testing'
							),
					} );
				} }
				disabled={ isEmpty( selectableTemplates ) }
				labels={ {
					selection: name,
					selectAction: _x(
						'Select a template…',
						'user',
						'nelio-ab-testing'
					),
					loading: _x(
						'Loading templates…',
						'text',
						'nelio-ab-testing'
					),
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
		</div>
	);
};

// =====
// HOOKS
// =====

const useTemplateContexts = () =>
	useSelect( ( select ) => select( NAB_DATA ).getTemplateContexts() );

const useTemplates = () =>
	useSelect( ( select ) => select( NAB_DATA ).getTemplates() );

const useTemplateSetter = (
	templateId: string,
	setAttributes: ( attrs: Partial< ControlAttributes > ) => void
) => {
	const { setAlternative } = useDispatch( NAB_EDITOR );
	const alternative = useSelect(
		( select ) => select( NAB_EDITOR )?.getAlternatives()[ 1 ]
	) as Maybe< AlternativeType< AlternativeAttributes > >;

	if ( !! templateId ) {
		return setAttributes;
	} //end if

	return ( attrs: Partial< ControlAttributes > ): void => {
		setAttributes( attrs );
		if ( alternative ) {
			void setAlternative( alternative.id, {
				...alternative,
				attributes: omitUndefineds( {
					...alternative.attributes,
					...attrs,
				} ),
			} );
		} //end if
	};
};

// =======
// HELPERS
// =======

export const areBuiltInTemplateAttributes = (
	x: ControlAttributes
): x is BuiltInTemplateAttributes => 'postType' in x && ! isEmpty( x.postType );

export const arePageBuilderTemplateAttributes = (
	x: ControlAttributes
): x is PageBuilderTemplateAttributes =>
	'context' in x && ! isEmpty( x.context );
