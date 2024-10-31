/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	Button,
	PanelRow,
	SelectControl,
	TextControl,
} from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim } from 'lodash';
import { ErrorText } from '@nab/components';
import { createScopeRule, isUrlFragmentInvalid, isEmpty } from '@nab/utils';
import type { ExperimentType, ScopeRule } from '@nab/types';

/**
 * Internal dependencies
 */
import { store as NAB_EDITOR } from '../../../store';

export type NewRuleFormProps = {
	readonly rules: ReadonlyArray< ScopeRule >;
	readonly scopeSupport: Required< ExperimentType[ 'supports' ] >[ 'scope' ];
};

export const NewRuleForm = ( {
	rules,
	scopeSupport,
}: NewRuleFormProps ): JSX.Element => {
	const [ type, setType ] = useState< 'partial' | 'exact' >( 'partial' );
	const [ value, setValue ] = useState( '' );
	const { addScopeRules } = useDispatch( NAB_EDITOR );

	const addRule = () => {
		setValue( '' );
		if ( 'custom-with-tested-post' === scopeSupport && ! rules.length ) {
			void addScopeRules( [
				createScopeRule( { type: 'tested-post' } ),
				createScopeRule( { type, value } ),
			] );
		} else {
			void addScopeRules( [ createScopeRule( { type, value } ) ] );
		} //end if
	};

	const error = value ? isUrlFragmentInvalid( value ) || '' : '';

	return (
		<div className="nab-experiment-scope__new-rule-form">
			<SelectControl
				className="nab-experiment-scope__new-rule-mode"
				label={ _x(
					'Select URL matching mode',
					'user',
					'nelio-ab-testing'
				) }
				value={ type }
				options={ OPTIONS }
				onChange={ ( t ) => setType( t ) }
			/>

			<TextControl
				className="nab-experiment-scope__new-rule-value"
				label={ _x( 'Write a URL', 'user', 'nelio-ab-testing' ) }
				value={ value }
				onChange={ setValue }
			/>

			<ErrorText value={ error } />

			<PanelRow className="nab-experiment-scope__add-rule-action-container">
				<Button
					variant="secondary"
					onClick={ addRule }
					disabled={ isEmpty( trim( value ) ) }
					className="nab-experiment-scope__add-rule-action"
				>
					{ _x( 'Add', 'command', 'nelio-ab-testing' ) }
				</Button>
			</PanelRow>
		</div>
	);
};

// ====
// DATA
// ====

const OPTIONS = [
	{
		value: 'partial' as const,
		label: _x(
			'URL contains the expected value',
			'text',
			'nelio-ab-testing'
		),
	},
	{
		value: 'exact' as const,
		label: _x(
			'URL exactly matches the expected value',
			'text',
			'nelio-ab-testing'
		),
	},
];
