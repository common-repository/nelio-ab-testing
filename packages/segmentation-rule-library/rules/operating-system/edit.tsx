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
import type { SREditProps } from '@nab/types';

/**
 * Internal dependencies
 */
import './edit.scss';
import { operatingSystemList } from './operating-systems';
import type { Attributes, Value } from './types';

export const Edit = ( {
	attributes: { condition, values },
	errors,
	setAttributes,
}: SREditProps< Attributes > ): JSX.Element => {
	const instanceId = useInstanceId( Edit );
	const selectControlId = `nab-operating-system-segmentation-rule__value-${ instanceId }`;
	const osOptions = operatingSystemList.map(
		( os ) => ( { value: os, label: os } ) as Value
	);

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
					'nab-segmentation-rule__field--has-errors': errors.values,
				} ) }
				label={ _x(
					'Operating System Selector',
					'text',
					'nelio-ab-testing'
				) }
				help={ <ErrorText value={ errors.values } /> }
			>
				<div className="nab-operating-system-segmentation-rule">
					<StylizedSelectControl
						id={ selectControlId }
						isMulti
						className="nab-operating-system-segmentation-rule__value"
						value={ values }
						onChange={ ( newValues ) =>
							setAttributes( { values: newValues || [] } )
						}
						options={ osOptions }
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
	'is-equal-to': _x(
		'Operating system is equal to',
		'text',
		'nelio-ab-testing'
	),
	'is-not-equal-to': _x(
		'Operating system is not equal to',
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
