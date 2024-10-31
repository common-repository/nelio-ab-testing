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
	attributes: { code },
}: ValuePreviewProps ): JSX.Element => (
	<TextareaControl
		className="nab-javascript-value-preview"
		value={ code }
		onChange={ () => void null }
		readOnly
	/>
);
