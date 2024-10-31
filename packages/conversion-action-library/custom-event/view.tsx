/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { createInterpolateElement } from '@safe-wordpress/element';
import { sprintf, _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim } from 'lodash';
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
	attributes: { eventName },
	experimentId,
	goalIndex,
}: CAViewProps< Attributes > ): JSX.Element => {
	if ( ! experimentId || undefined === goalIndex ) {
		return (
			<>
				{ _x(
					'A conversion is programmatically sent to Nelio’s cloud via JavaScript.',
					'text',
					'nelio-ab-testing'
				) }
			</>
		);
	} //end if

	const value = !! trim( eventName )
		? `nab.<wbr />trigger(<wbr />'${ trim( eventName ) }')`
		: `nab.<wbr />convert(<wbr />${ experimentId },<wbr />${ goalIndex })`;

	let sentence;
	if ( !! trim( eventName ) ) {
		/* translators: a javascript snippet */
		sentence = _x(
			'A custom JavaScript event is triggered using %s.',
			'text',
			'nelio-ab-testing'
		);
	} else {
		/* translators: a javascript snippet */
		sentence = _x(
			'A conversion is programmatically generated in JavaScript using %s.',
			'text',
			'nelio-ab-testing'
		);
	} //end if

	return (
		<>
			{ createInterpolateElement(
				sprintf( sentence, `<code>${ value }</code>` ),
				{ code: <code />, wbr: <wbr /> }
			) }
		</>
	);
};
