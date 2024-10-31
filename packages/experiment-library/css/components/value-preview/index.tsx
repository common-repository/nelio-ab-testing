/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { TextareaControl } from '@safe-wordpress/components';

/**
 * External dependencies
 */
import './style.scss';
import type { AlternativeAttributes } from '../../types';

export type ValuePreviewProps = {
	readonly attributes: AlternativeAttributes;
};

export const ValuePreview = ( {
	attributes: { css },
}: ValuePreviewProps ): JSX.Element => (
	<TextareaControl
		className="nab-css-value-preview"
		value={ css }
		onChange={ () => void null }
		readOnly
	/>
);
