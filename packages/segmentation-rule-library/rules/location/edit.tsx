/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { BaseControl, SelectControl } from '@safe-wordpress/components';
import { useInstanceId } from '@safe-wordpress/compose';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { toPairs } from 'lodash';
import { ErrorText, StylizedSelectControl } from '@nab/components';
import { worldCountries, usStates } from '@nab/utils';
import type { SREditProps } from '@nab/types';

/**
 * Internal dependencies
 */
import './edit.scss';
import type { Attributes } from './types';

const LOCATION_CONDITIONS = Object.entries( {
	...worldCountries,
	...usStates,
} ).map( ( [ value, label ] ) => ( {
	value,
	label,
} ) );

export const Edit = ( {
	attributes: { condition, location },
	errors,
	setAttributes,
}: SREditProps< Attributes > ): JSX.Element => {
	const instanceId = useInstanceId( Edit );
	const selectControlId = `nab-location-segmentation-rule__value-${ instanceId }`;

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

			<BaseControl
				id={ selectControlId }
				className={ classnames( {
					'nab-segmentation-rule__field--has-errors': errors.location,
				} ) }
				label={ _x( 'Location Selector', 'text', 'nelio-ab-testing' ) }
				help={ <ErrorText value={ errors.location } /> }
			>
				<div className="nab-location-segmentation-rule">
					<StylizedSelectControl
						id={ selectControlId }
						isMulti
						className="nab-location-segmentation-rule__value"
						value={ location }
						onChange={ ( newLocations ) =>
							setAttributes( {
								location: newLocations || [],
							} )
						}
						options={ LOCATION_CONDITIONS }
					/>
				</div>
			</BaseControl>
		</>
	);
};

// =======
// HELPERS
// =======

const CONDITION_LABEL_RECORD: Record< Attributes[ 'condition' ], string > = {
	'is-equal-to': _x( 'Location is equal to', 'text', 'nelio-ab-testing' ),
	'is-not-equal-to': _x(
		'Location is not equal to',
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
