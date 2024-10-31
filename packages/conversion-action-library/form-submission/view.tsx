/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { createInterpolateElement } from '@safe-wordpress/element';
import { sprintf, _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { ConversionActionScopeView } from '@nab/components';
import { store as NAB_DATA } from '@nab/data';
import type { CAViewProps, EntityKindName } from '@nab/types';

/**
 * Internal dependencies
 */
import { isNamedForm } from './helpers';
import type { Attributes } from './types';

export const View = ( props: CAViewProps< Attributes > ): JSX.Element => (
	<>
		<div>
			<ActualView { ...props } />
		</div>
		<ConversionActionScopeView scope={ props.scope } />
	</>
);

const ActualView = ( {
	attributes,
}: CAViewProps< Attributes > ): JSX.Element => {
	const formTitle = useFormTitle( attributes );
	const { formType } = attributes;

	if ( ! formTitle ) {
		return <>{ getLabelForUnknownForm( formType ) }</>;
	} //end if

	return (
		<>
			{ createInterpolateElement(
				sprintf(
					getLabelForKnownForm( formType ),
					`<strong>${ formTitle }</strong>`
				),
				{ strong: <strong /> }
			) }
		</>
	);
};

// =====
// HOOKS
// =====

const useFormTitle = ( attributes: Attributes ): string =>
	useSelect( ( select ) => {
		select( NAB_DATA );
		const name = isNamedForm( attributes )
			? attributes.formName
			: select( NAB_DATA ).getEntityRecord(
					attributes.formType,
					attributes.formId
			  )?.title;
		return name || '';
	} );

// =======
// HELPERS
// =======

function getLabelForUnknownForm( formType: EntityKindName ) {
	switch ( formType ) {
		case 'nelio_form':
			return _x(
				'A visitor successfully submits a Nelio Form.',
				'text',
				'nelio-ab-testing'
			);

		case 'wpcf7_contact_form':
			return _x(
				'A visitor successfully submits a Contact Form 7.',
				'text',
				'nelio-ab-testing'
			);

		case 'nab_elementor_form':
			return _x(
				'A visitor successfully submits an Elementor Form.',
				'text',
				'nelio-ab-testing'
			);

		case 'nab_hubspot_form':
			return _x(
				'A visitor successfully submits a HubSpot Form.',
				'text',
				'nelio-ab-testing'
			);

		case 'nab_gravity_form':
			return _x(
				'A visitor successfully submits a Gravity Form.',
				'text',
				'nelio-ab-testing'
			);

		case 'nab_ninja_form':
			return _x(
				'A visitor successfully submits a Ninja Form.',
				'text',
				'nelio-ab-testing'
			);

		case 'nab_formidable_form':
			return _x(
				'A visitor successfully submits a Formidable Form.',
				'text',
				'nelio-ab-testing'
			);

		case 'wpforms':
			return _x(
				'A visitor successfully submits a WPForm.',
				'text',
				'nelio-ab-testing'
			);

		case 'nab_forminator_form':
			return _x(
				'A visitor successfully submits a Forminator Form.',
				'text',
				'nelio-ab-testing'
			);

		case 'nab_fluent_form':
			return _x(
				'A visitor successfully submits a Fluent Form.',
				'text',
				'nelio-ab-testing'
			);

		default:
			return _x(
				'A visitor successfully submits a form.',
				'text',
				'nelio-ab-testing'
			);
	} //end formType
} //end getLabelForUnknownForm()

function getLabelForKnownForm( formType: EntityKindName ) {
	switch ( formType ) {
		case 'nelio_form':
			/* translators: form name */
			return _x(
				'A visitor successfully submits the %s Nelio Form.',
				'text',
				'nelio-ab-testing'
			);

		case 'wpcf7_contact_form':
			/* translators: form name */
			return _x(
				'A visitor successfully submits the %s Contact Form 7.',
				'text',
				'nelio-ab-testing'
			);

		case 'nab_elementor_form':
			/* translators: form name */
			return _x(
				'A visitor successfully submits the %s Elementor Form.',
				'text',
				'nelio-ab-testing'
			);

		case 'nab_hubspot_form':
			/* translators: form name */
			return _x(
				'A visitor successfully submits the %s HubSpot Form.',
				'text',
				'nelio-ab-testing'
			);

		case 'nab_gravity_form':
			/* translators: form name */
			return _x(
				'A visitor successfully submits the %s Gravity Form.',
				'text',
				'nelio-ab-testing'
			);

		case 'nab_ninja_form':
			/* translators: form name */
			return _x(
				'A visitor successfully submits the %s Ninja Form.',
				'text',
				'nelio-ab-testing'
			);

		case 'nab_formidable_form':
			/* translators: form name */
			return _x(
				'A visitor successfully submits the %s Formidable Form.',
				'text',
				'nelio-ab-testing'
			);

		case 'wpforms':
			/* translators: form name */
			return _x(
				'A visitor successfully submits the %s WPForm.',
				'text',
				'nelio-ab-testing'
			);

		case 'nab_forminator_form':
			/* translators: form name */
			return _x(
				'A visitor successfully submits the %s Forminator Form.',
				'text',
				'nelio-ab-testing'
			);

		case 'nab_fluent_form':
			/* translators: form name */
			return _x(
				'A visitor successfully submits the %s Fluent Form.',
				'text',
				'nelio-ab-testing'
			);

		default:
			/* translators: form name */
			return _x(
				'A visitor successfully submits the %s form.',
				'text',
				'nelio-ab-testing'
			);
	} //end formType
} //end getLabelForKnownForm()
