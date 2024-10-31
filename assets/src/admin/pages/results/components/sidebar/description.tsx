/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PanelBody } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { useExperimentAttribute } from '../hooks';

export const Description = (): JSX.Element => {
	const description = useExperimentAttribute( 'description' );
	return (
		<PanelBody
			className="nab-experiment-description"
			title={ _x( 'Description', 'text', 'nelio-ab-testing' ) }
		>
			{ description
				? description
				: _x( 'None', 'text (description)', 'nelio-ab-testing' ) }
		</PanelBody>
	);
};
