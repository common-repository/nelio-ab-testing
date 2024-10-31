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
import { ErrorText, NumberControl } from '@nab/components';
import type { SREditProps } from '@nab/types';

/**
 * Internal dependencies
 */
import './edit.scss';
import type { Attributes } from './types';

export const Edit = ( {
	attributes: { condition, value, interval },
	errors,
	setAttributes,
}: SREditProps< Attributes > ): JSX.Element => {
	const instanceId = useInstanceId( Edit );
	const valueControlId = `nab-window-width-segmentation-rule__value-${ instanceId }`;

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

			{ 'between' !== condition && (
				<BaseControl
					id={ valueControlId }
					className={ classnames( {
						'nab-segmentation-rule__field--has-errors':
							errors.value,
					} ) }
					label={ _x(
						'Width in pixels',
						'text',
						'nelio-ab-testing'
					) }
					help={ <ErrorText value={ errors.value } /> }
				>
					<div className="nab-window-width-segmentation-rule">
						<NumberControl
							id={ valueControlId }
							className="nab-window-width-segmentation-rule__value"
							min={ 0 }
							value={ value }
							onChange={ ( newValue ) =>
								setAttributes( { value: newValue } )
							}
						/>
					</div>
				</BaseControl>
			) }

			{ 'between' === condition && (
				<>
					<BaseControl
						id={ `${ valueControlId }-min` }
						className={ classnames( {
							'nab-segmentation-rule__field--has-errors':
								errors.value,
						} ) }
						label={ _x(
							'Minimum width in pixels',
							'text',
							'nelio-ab-testing'
						) }
						help={ <ErrorText value={ errors.value } /> }
					>
						<div className="nab-window-width-segmentation-rule">
							<NumberControl
								id={ `${ valueControlId }-min` }
								className="nab-window-width-segmentation-rule__value"
								min={ 0 }
								value={ interval.min }
								onChange={ ( newValue ) =>
									setAttributes( {
										interval: {
											min: newValue,
											max: interval.max,
										},
									} )
								}
							/>
						</div>
					</BaseControl>

					<BaseControl
						id={ `${ valueControlId }-max` }
						className={ classnames( {
							'nab-segmentation-rule__field--has-errors':
								errors.value,
						} ) }
						label={ _x(
							'Maximum width in pixels',
							'text',
							'nelio-ab-testing'
						) }
						help={ <ErrorText value={ errors.interval } /> }
					>
						<div className="nab-window-width-segmentation-rule">
							<NumberControl
								id={ `${ valueControlId }-max` }
								className="nab-window-width-segmentation-rule__value"
								min={ 0 }
								value={ interval.max }
								onChange={ ( newValue ) =>
									setAttributes( {
										interval: {
											min: interval.min,
											max: newValue,
										},
									} )
								}
							/>
						</div>
					</BaseControl>
				</>
			) }
		</>
	);
};

// =======
// HELPERS
// =======

const CONDITION_LABEL_RECORD: Record< Attributes[ 'condition' ], string > = {
	'is-greater-than': _x( 'Is greater than', 'text', 'nelio-ab-testing' ),
	'is-less-than': _x( 'Is less than', 'text', 'nelio-ab-testing' ),
	between: _x( 'Between', 'text', 'nelio-ab-testing' ),
};
const CONDITIONS = toPairs( CONDITION_LABEL_RECORD ).map(
	( [ value, label ] ) => ( {
		label,
		value,
	} )
);
