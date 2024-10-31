/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { TextControl, SelectControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { ConversionActionScope, ErrorText } from '@nab/components';
import type { CAEditProps } from '@nab/types';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export const Edit = ( {
	attributes: { event, videoId },
	scope,
	errors,
	setAttributes,
	setScope,
}: CAEditProps< Attributes > ): JSX.Element => (
	<>
		<SelectControl
			label={ _x( 'Event', 'text', 'nelio-ab-testing' ) }
			options={ [
				{
					value: 'play' as const,
					label: _x( 'Play Video', 'text', 'nelio-ab-testing' ),
				},
				{
					value: 'end' as const,
					label: _x(
						'Reach End of Video',
						'text',
						'nelio-ab-testing'
					),
				},
			] }
			value={ event }
			onChange={ ( newEvent ) => setAttributes( { event: newEvent } ) }
		/>

		<TextControl
			className={ classnames( {
				'nab-conversion-action__field--has-errors': errors.videoId,
			} ) }
			label={ _x( 'Video ID', 'text', 'nelio-ab-testing' ) }
			value={ videoId }
			help={ <ErrorText value={ errors.videoId } /> }
			placeholder={ _x( 'Video ID', 'text', 'nelio-ab-testing' ) }
			onChange={ ( newVideoId ) =>
				setAttributes( { videoId: newVideoId } )
			}
		/>

		<ConversionActionScope
			scope={ scope }
			setScope={ setScope }
			error={ errors._scope }
		/>
	</>
);
