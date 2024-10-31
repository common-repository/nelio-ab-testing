/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	TextControl,
	SelectControl,
	BaseControl,
} from '@safe-wordpress/components';
import { useInstanceId } from '@safe-wordpress/compose';
import { useSelect } from '@safe-wordpress/data';
import { useEffect } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { sortBy } from 'lodash';
import {
	ConversionActionScope,
	ErrorText,
	PostSearcher,
} from '@nab/components';
import { store as NAB_DATA } from '@nab/data';
import type { CAEditProps } from '@nab/types';

/**
 * Internal dependencies
 */
import { getNameFieldLabel, isNamedForm } from './helpers';
import type { Attributes } from './types';

export const Edit = ( {
	attributes,
	scope,
	errors,
	setAttributes,
	setScope,
}: CAEditProps< Attributes > ): JSX.Element => {
	const { formId, formType, formName = '' } = attributes;
	const instanceId = useInstanceId( Edit );
	const formTypes = useFormTypes();

	useEffect( () => {
		if ( ! formType && formTypes[ 0 ]?.value ) {
			setAttributes( {
				formType: formTypes[ 0 ].value,
				formId: undefined,
				formName: undefined,
			} );
		} //end if
	}, [ formType, formTypes.length ] );

	return (
		<>
			{ formTypes.length > 1 && (
				<SelectControl
					label={ _x( 'Form Type', 'text', 'nelio-ab-testing' ) }
					options={ formTypes }
					value={ formType }
					onChange={ ( newFormType ) =>
						setAttributes( {
							formType: newFormType,
							formId: undefined,
							formName: undefined,
						} )
					}
				/>
			) }

			{ isNamedForm( attributes ) ? (
				<TextControl
					id={ `nab-conversion-action__form-submission-${ instanceId }` }
					label={ getNameFieldLabel( attributes ) }
					help={ <ErrorText value={ errors.formName } /> }
					value={ formName }
					onChange={ ( newFormName ) =>
						setAttributes( {
							formType,
							formId: 0,
							formName: newFormName,
						} )
					}
				/>
			) : (
				<BaseControl
					id={ `nab-conversion-action__form-submission-${ instanceId }` }
					className={ classnames( {
						'nab-conversion-action__field--has-errors':
							errors.formId,
					} ) }
					label={ _x( 'Actual Form', 'text', 'nelio-ab-testing' ) }
					help={ <ErrorText value={ errors.formId } /> }
				>
					<PostSearcher
						id={ `nab-conversion-action__form-submission-${ instanceId }` }
						type={ formType }
						perPage={ 10 }
						value={ formId }
						onChange={ ( newFormId ) =>
							setAttributes( {
								formType,
								formId: newFormId,
								formName: undefined,
							} )
						}
					/>
				</BaseControl>
			) }

			<ConversionActionScope
				scope={ scope }
				setScope={ setScope }
				error={ errors._scope }
			/>
		</>
	);
};

// =====
// HOOKS
// =====

const useFormTypes = () =>
	useSelect( ( select ) => {
		const { getKindEntities } = select( NAB_DATA );

		const formTypes = ( getKindEntities() || [] )
			.filter( ( pt ) => 'form' === pt.kind )
			.map( ( pt ) => ( {
				value: pt.name,
				label: pt.labels.singular_name,
			} ) );
		return sortBy( formTypes, 'label' );
	} );
