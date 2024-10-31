/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, TextControl } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NAB_DATA } from '@nab/data';
import { getLocalUrlError } from '@nab/utils';
import type { ExperimentEditProps } from '@nab/types';

// NOTE. Prevent dependency loops.
import type { store as editorStore } from '@nab/editor';
const NAB_EDITOR = 'nab/editor' as unknown as typeof editorStore;

/**
 * Internal dependencies
 */
import './style.scss';
import type { ControlAttributes } from '../../types';

export const Original = ( {
	attributes,
	setAttributes,
}: ExperimentEditProps< ControlAttributes > ): JSX.Element => {
	const { url = '' } = attributes;
	const homeUrl = useHomeUrl();
	const urlError = getLocalUrlError( url, homeUrl );

	const { saveExperimentAndPreviewAlternative } = useDispatch( NAB_EDITOR );
	const isBeingSaved = useSelect( ( select ) =>
		select( NAB_EDITOR ).isExperimentBeingSaved()
	);

	return (
		<div>
			<div className="nab-url-original-version">
				<div className="nab-url-original-version__url">
					<TextControl
						className="nab-url-original-version__url-value"
						value={ url }
						onChange={ ( value ) =>
							setAttributes( { url: value } )
						}
						placeholder={ _x( 'URL…', 'text', 'nelio-ab-testing' ) }
					/>

					<div className="nab-url-original-version__url-preview">
						<Button
							variant="link"
							disabled={ !! urlError || isBeingSaved }
							onClick={ () =>
								void saveExperimentAndPreviewAlternative(
									'control'
								)
							}
						>
							{ _x( 'Preview', 'command', 'nelio-ab-testing' ) }
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useHomeUrl = () =>
	useSelect( ( select ) => select( NAB_DATA ).getPluginSetting( 'homeUrl' ) );
