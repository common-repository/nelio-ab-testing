/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { createInterpolateElement } from '@safe-wordpress/element';
import { sprintf, _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { ConversionActionScopeView } from '@nab/components';
import type { CAViewProps } from '@nab/types';

/**
 * Internal dependencies
 */
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
	attributes: { event, videoId },
}: CAViewProps< Attributes > ): JSX.Element => {
	if ( ! videoId ) {
		return (
			<>
				{ 'play' === event
					? _x(
							'A visitor plays a YouTube video.',
							'text',
							'nelio-ab-testing'
					  )
					: _x(
							'A visitor reaches the end of a YouTube video.',
							'text',
							'nelio-ab-testing'
					  ) }
			</>
		);
	} //end if

	switch ( event ) {
		case 'play':
			return createInterpolateElement(
				sprintf(
					/* translators: video id, such as “dQw4w9WgXcQ” */
					_x(
						'A visitor plays the YouTube video %s.',
						'text',
						'nelio-ab-testing'
					),
					`<code>${ videoId }</code>`
				),
				{ code: <code /> }
			);

		case 'end':
			return createInterpolateElement(
				sprintf(
					/* translators: video id, such as “dQw4w9WgXcQ” */
					_x(
						'A visitor reaches the end of the YouTube video %s.',
						'text',
						'nelio-ab-testing'
					),
					`<code>${ videoId }</code>`
				),
				{ code: <code /> }
			);
	} //end switch
};
