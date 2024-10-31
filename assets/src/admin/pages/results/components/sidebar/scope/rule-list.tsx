/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { CustomUrlScopeRule, ScopeRule, ScopeType } from '@nab/types';

/**
 * Internal dependencies
 */
import { getScopeExplanation } from './explanation';
import { useExperimentAttribute } from '../../hooks';

export type RuleListProps = {
	readonly scopeSupport: ScopeType;
};

export const RuleList = ( { scopeSupport }: RuleListProps ): JSX.Element => {
	const rules = useExperimentAttribute( 'scope' ) || [];
	const status = useExperimentAttribute( 'status' ) ?? 'running';

	if ( ! rules.length ) {
		return <p>{ getScopeExplanation( scopeSupport, rules, status ) }</p>;
	} //end if

	return (
		<>
			<p>{ getScopeExplanation( scopeSupport, rules, status ) }</p>

			<ul className="nab-experiment-scope__rule-list">
				{ rules
					.filter( isCustomUrlScopeRule )
					.map( ( { id, attributes: { value, type } } ) => (
						<li
							key={ id }
							className="nab-experiment-scope__rule-list-item"
						>
							<span className="nab-experiment-scope__active-rule-type">
								{ 'exact' === type &&
									_x(
										'URL is:',
										'text',
										'nelio-ab-testing'
									) }
								{ 'partial' === type &&
									_x(
										'URL contains:',
										'text',
										'nelio-ab-testing'
									) }
							</span>
							<input
								type="text"
								className="nab-experiment-scope__active-rule-value"
								value={ value }
								readOnly
							/>
						</li>
					) ) }
			</ul>
		</>
	);
};

// =======
// HELPERS
// =======

const isCustomUrlScopeRule = ( r: ScopeRule ): r is CustomUrlScopeRule =>
	'tested-post' !== r.attributes.type;
