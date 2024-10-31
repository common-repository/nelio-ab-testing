/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { SelectControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { toPairs } from 'lodash';
import type { SREditProps } from '@nab/types';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export const Edit = ( {
	attributes: { condition },
	setAttributes,
}: SREditProps< Attributes > ): JSX.Element => {
	return (
		<>
			<SelectControl
				label={ _x( 'Condition', 'text', 'nelio-ab-testing' ) }
				options={ CONDITIONS }
				value={ condition }
				onChange={ ( newCondition ) =>
					setAttributes( { condition: newCondition } )
				}
			/>
		</>
	);
};

// =======
// HELPERS
// =======

const CONDITION_LABEL_RECORD: Record< Attributes[ 'condition' ], string > = {
	'is-logged-in': _x( 'Visitor is logged in', 'text', 'nelio-ab-testing' ),
	'is-not-logged-in': _x(
		'Visitor is not logged in',
		'text',
		'nelio-ab-testing'
	),
};
const CONDITIONS = toPairs( CONDITION_LABEL_RECORD ).map(
	( [ value, label ] ) => ( {
		label,
		value,
	} )
);
