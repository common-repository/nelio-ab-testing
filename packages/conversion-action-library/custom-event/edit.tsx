/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { TextControl } from '@safe-wordpress/components';
import { createInterpolateElement } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim } from 'lodash';
import type { CAEditProps } from '@nab/types';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';
import { ConversionActionScope } from '@nab/components';

export const Edit = ( {
	attributes: { eventName },
	scope,
	errors,
	experimentId,
	goalIndex,
	setAttributes,
	setScope,
}: CAEditProps< Attributes > ): JSX.Element => {
	const jsAction = !! trim( eventName )
		? `nab.<wbr />trigger(<wbr />'${ trim( eventName ) }')`
		: `nab.<wbr />convert(<wbr />${ experimentId },<wbr />${ goalIndex })`;

	return (
		<>
			<p>
				{ _x(
					'You can programmatically generate a conversion using the following JavaScript snippet whenever you want:',
					'user',
					'nelio-ab-testing'
				) }
			</p>

			<pre>
				{ '<script type="text/javascript">\n  ' }
				{ createInterpolateElement( jsAction, { wbr: <wbr /> } ) }
				{ ';\n</script>' }
			</pre>

			<p>
				{ createInterpolateElement(
					sprintf(
						/* translators: a JavaScript snippet */
						_x(
							'If you want a single custom event to trigger a conversion in several goals or different tests, please name the event and use %s instead:',
							'user',
							'nelio-ab-testing'
						),
						'<code>nab.trigger</code>'
					),
					{ code: <code /> }
				) }
			</p>
			<TextControl
				label={ _x( 'Custom Event Name', 'text', 'nelio-ab-testing' ) }
				placeholder={ _x( '(optional)', 'text', 'nelio-ab-testing' ) }
				value={ eventName || '' }
				onChange={ ( name ) => setAttributes( { eventName: name } ) }
			/>

			<ConversionActionScope
				scope={ scope }
				setScope={ setScope }
				error={ errors._scope }
			/>
		</>
	);
};
