/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PanelBody, TextareaControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { useExperimentAttribute } from '../../hooks';

export const Description = (): JSX.Element => {
	const [ description, setDescription ] =
		useExperimentAttribute( 'description' );
	return (
		<PanelBody
			className="nab-experiment-description"
			title={ _x( 'Description', 'text', 'nelio-ab-testing' ) }
		>
			<TextareaControl
				label={ _x(
					'Describe your test (optional)',
					'user',
					'nelio-ab-testing'
				) }
				className="nab-experiment-description__textarea"
				value={ description }
				onChange={ setDescription }
			/>
		</PanelBody>
	);
};
