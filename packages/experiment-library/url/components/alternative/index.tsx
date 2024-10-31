/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { TextControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { ExperimentEditProps } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import type { AlternativeAttributes } from '../../types';

export const Alternative = ( {
	attributes,
	setAttributes,
}: ExperimentEditProps< AlternativeAttributes > ): JSX.Element => {
	const { url = '' } = attributes;

	return (
		<div>
			<div className="nab-url-alternative-version">
				<div className="nab-url-alternative-version__url">
					<TextControl
						className="nab-url-alternative-version__url-value"
						value={ url }
						onChange={ ( value ) =>
							setAttributes( { url: value } )
						}
						placeholder={ _x( 'URL…', 'text', 'nelio-ab-testing' ) }
					/>
				</div>
			</div>
		</div>
	);
};
