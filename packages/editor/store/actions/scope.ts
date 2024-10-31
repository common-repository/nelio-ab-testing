/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type { ScopeRule, ScopeRuleId } from '@nab/types';

export type ScopeAction = AddScopeRules | RemoveScopeRules;

export function addScopeRules(
	rules: ScopeRule | ReadonlyArray< ScopeRule >
): AddScopeRules {
	return {
		type: 'ADD_SCOPE_RULES',
		rules: castArray( rules ),
	};
} //end addScopeRules()

export function removeScopeRules(
	ids: ScopeRuleId | ReadonlyArray< ScopeRuleId >
): RemoveScopeRules {
	return {
		type: 'REMOVE_SCOPE_RULES',
		ids: castArray( ids ),
	};
} //end removeScopeRules()

// =====
// TYPES
// =====

type AddScopeRules = {
	readonly type: 'ADD_SCOPE_RULES';
	readonly rules: ReadonlyArray< ScopeRule >;
};

type RemoveScopeRules = {
	readonly type: 'REMOVE_SCOPE_RULES';
	readonly ids: ReadonlyArray< ScopeRuleId >;
};
