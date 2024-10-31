/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { CheckboxControl } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { createScopeRule } from '@nab/utils';
import { map } from 'lodash';
import type { ScopeRule } from '@nab/types';

/**
 * Internal dependencies
 */
import { store as NAB_EDITOR } from '../../../store';

export type ConsistencyScopeProps = {
	readonly rules: ReadonlyArray< ScopeRule >;
};

export const ConsistencyScope = ( {
	rules,
}: ConsistencyScopeProps ): JSX.Element => {
	const enableConsistency = useConsistencyEnabler( rules );
	return (
		<>
			{ ! rules.length ? (
				<p>
					{ _x(
						'Variants will be visible on the tested element’s page. All other pages will also show the appropriate variant of this test whenever the tested element appears on them.',
						'text',
						'nelio-ab-testing'
					) }
				</p>
			) : (
				<p>
					{ _x(
						'Variants will be visible only on the tested element’s page.',
						'text',
						'nelio-ab-testing'
					) }
				</p>
			) }
			<CheckboxControl
				label={ _x(
					'Global Consistency',
					'command',
					'nelio-ab-testing'
				) }
				checked={ ! rules.length }
				onChange={ () => enableConsistency( ! rules.length ) }
			/>
		</>
	);
};

// =====
// HOOKS
// =====

const useConsistencyEnabler = ( rules: ReadonlyArray< ScopeRule > ) => {
	const { addScopeRules, removeScopeRules } = useDispatch( NAB_EDITOR );
	return ( consistency: boolean ) => {
		void removeScopeRules( map( rules, 'id' ) );
		if ( consistency ) {
			void addScopeRules( createScopeRule( { type: 'tested-post' } ) );
		} //end if
	};
};
