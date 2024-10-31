/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	BaseControl,
	TextareaControl,
	SelectControl,
} from '@safe-wordpress/components';
import { useInstanceId } from '@safe-wordpress/compose';
import { useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { toPairs, trim, uniq } from 'lodash';
import { ErrorText } from '@nab/components';
import type { SREditProps } from '@nab/types';

/**
 * Internal dependencies
 */
import './edit.scss';
import type { Attributes } from './types';

export const Edit = ( {
	attributes: { condition, values },
	errors,
	setAttributes,
}: SREditProps< Attributes > ): JSX.Element => {
	const instanceId = useInstanceId( Edit );
	const [ currentValue, setCurrentValue ] = useState( values.join( '\n' ) );

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

			<div className="nab-ip-address-segmentation-rule">
				<BaseControl
					id={ `nab-ip-address-segmentation-rule__value-${ instanceId }` }
					className={ classnames( {
						'nab-ip-address-segmentation-rule__value': true,
						'nab-segmentation-rule__field--has-errors':
							errors.values,
					} ) }
					label={ _x( 'IP Addresses', 'text', 'nelio-ab-testing' ) }
				>
					<TextareaControl
						id={ `nab-ip-address-segmentation-rule__value-${ instanceId }` }
						value={ currentValue }
						placeholder={ _x(
							'IP Addresses (one per line)',
							'text',
							'nelio-ab-testing'
						) }
						onChange={ ( newValue ) => {
							setCurrentValue( newValue );
							setAttributes( {
								values: uniq(
									newValue
										.split( '\n' )
										.map( trim )
										.filter( ( x ) => !! x.length )
								),
							} );
						} }
					/>
				</BaseControl>
			</div>

			{ !! errors.values && (
				<p>
					<ErrorText value={ errors.values } />
				</p>
			) }
		</>
	);
};

// =======
// HELPERS
// =======

const CONDITION_LABEL_RECORD: Record< Attributes[ 'condition' ], string > = {
	'is-equal-to': _x( 'Is equal to', 'text', 'nelio-ab-testing' ),
	'is-not-equal-to': _x( 'Is not equal to', 'text', 'nelio-ab-testing' ),
};
const CONDITIONS = toPairs( CONDITION_LABEL_RECORD ).map(
	( [ value, label ] ) => ( {
		label,
		value,
	} )
);
