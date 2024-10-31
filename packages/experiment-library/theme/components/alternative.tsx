/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { PresetAlternative } from '@nab/components';
import type { ExperimentEditProps, ThemeId } from '@nab/types';

/**
 * Internal dependencies
 */
import type { AlternativeAttributes } from '../types';

export const Alternative = ( {
	attributes: { themeId, name },
	disabled,
	experimentType,
	setAttributes,
}: ExperimentEditProps< AlternativeAttributes > ): JSX.Element => (
	<PresetAlternative
		experimentType={ experimentType }
		value={ themeId }
		onChange={ ( theme ) =>
			theme
				? setAttributes( {
						themeId: theme.value as ThemeId,
						name: theme.label,
				  } )
				: undefined
		}
		disabled={ disabled }
		labels={ {
			selection: name,
			selectAction: _x(
				'Please select a theme…',
				'user',
				'nelio-ab-testing'
			),
			loading: _x( 'Loading themes…', 'text', 'nelio-ab-testing' ),
			empty: _x( 'No themes available', 'text', 'nelio-ab-testing' ),
			unknownOption: _x( 'Theme not found', 'text', 'nelio-ab-testing' ),
		} }
	/>
);
