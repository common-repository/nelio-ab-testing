/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	BaseControl,
	TextControl,
	SelectControl,
	TextareaControl,
} from '@safe-wordpress/components';
import { useInstanceId } from '@safe-wordpress/compose';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { toPairs } from 'lodash';
import { ErrorText } from '@nab/components';
import type { SREditProps } from '@nab/types';

/**
 * Internal dependencies
 */
import './edit.scss';
import type { Attributes } from './types';

export const Edit = ( {
	attributes: { condition, value },
	errors,
	setAttributes,
}: SREditProps< Attributes > ): JSX.Element => {
	const instanceId = useInstanceId( Edit );
	const valueControlId = `nab-referring-url-segmentation-rule__value-${ instanceId }`;

	const multivalue = 'is-any-of' === condition || 'is-none-of' === condition;
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

			{ ! multivalue ? (
				<BaseControl
					id={ valueControlId }
					className={ classnames( {
						'nab-segmentation-rule__field--has-errors':
							errors.value,
					} ) }
					label={ _x( 'Value', 'text', 'nelio-ab-testing' ) }
					help={ <ErrorText value={ errors.value } /> }
				>
					<div className="nab-referring-url-segmentation-rule">
						<TextControl
							id={ valueControlId }
							className="nab-referring-url-segmentation-rule__value"
							value={ value }
							placeholder={ _x(
								'Referring URL value',
								'text',
								'nelio-ab-testing'
							) }
							onChange={ ( newValue ) =>
								setAttributes( { value: newValue } )
							}
						/>
					</div>
				</BaseControl>
			) : (
				<BaseControl
					id={ valueControlId }
					className={ classnames( {
						'nab-segmentation-rule__field--has-errors':
							errors.value,
					} ) }
					label={ _x( 'Value', 'text', 'nelio-ab-testing' ) }
					help={ <ErrorText value={ errors.value } /> }
				>
					<div className="nab-referring-url-segmentation-rule">
						<TextareaControl
							id={ valueControlId }
							className="nab-referring-url-segmentation-rule__value"
							value={ value }
							placeholder={ _x(
								'Referring URL values (one per line)',
								'text',
								'nelio-ab-testing'
							) }
							onChange={ ( newValue ) =>
								setAttributes( { value: newValue } )
							}
						/>
					</div>
				</BaseControl>
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
	contains: _x( 'Contains', 'text', 'nelio-ab-testing' ),
	'does-not-contain': _x( 'Does not contain', 'text', 'nelio-ab-testing' ),
	'is-any-of': _x( 'Is any of', 'text', 'nelio-ab-testing' ),
	'is-none-of': _x( 'Is none of', 'text', 'nelio-ab-testing' ),
};
const CONDITIONS = toPairs( CONDITION_LABEL_RECORD ).map(
	( [ value, label ] ) => ( {
		label,
		value,
	} )
);
