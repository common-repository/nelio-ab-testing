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
import { languageList } from '@nab/utils';
import type { SREditProps } from '@nab/types';

/**
 * Internal dependencies
 */
import './edit.scss';
import type { Attributes } from './types';

export const Edit = ( {
	attributes: { condition, language },
	errors,
	setAttributes,
}: SREditProps< Attributes > ): JSX.Element => {
	const instanceId = useInstanceId( Edit );
	const selectControlId = `nab-language-segmentation-rule__value-${ instanceId }`;
	const languageListOptions = Object.entries( languageList ).map(
		( [ value, label ] ) => ( {
			value,
			label,
		} )
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
					'nab-segmentation-rule__field--has-errors': errors.language,
				} ) }
				label={ _x( 'Language Selector', 'text', 'nelio-ab-testing' ) }
				help={ <ErrorText value={ errors.language } /> }
			>
				<div className="nab-language-segmentation-rule">
					<StylizedSelectControl
						id={ selectControlId }
						isMulti
						className="nab-language-segmentation-rule__value"
						value={ language }
						onChange={ ( newLanguages ) =>
							setAttributes( { language: newLanguages || [] } )
						}
						options={ languageListOptions }
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
	'is-equal-to': _x( 'Language is equal to', 'text', 'nelio-ab-testing' ),
	'is-not-equal-to': _x(
		'Language is not equal to',
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
