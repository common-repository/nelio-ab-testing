/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { map } from 'lodash';
import type {
	CustomUrlScopeRule,
	ExperimentType,
	ScopeRule,
	ScopeRuleId,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { store as NAB_EDITOR } from '../../../store';

export type RuleListProps = {
	readonly rules: ReadonlyArray< ScopeRule >;
	readonly scopeSupport: Required< ExperimentType[ 'supports' ] >[ 'scope' ];
};

export const RuleList = ( {
	rules,
	scopeSupport,
}: RuleListProps ): JSX.Element => {
	const { removeScopeRules } = useDispatch( NAB_EDITOR );

	if ( ! rules.length ) {
		return (
			<p>
				{ 'custom-with-tested-post' === scopeSupport
					? _x(
							'Variants will be visible on all the pages of your website, including that of the tested element.',
							'user',
							'nelio-ab-testing'
					  )
					: _x(
							'Variants will be visible on all the pages of your website.',
							'user',
							'nelio-ab-testing'
					  ) }{ ' ' }
				{ _x(
					'If you wish to limit its scope to certain pages only, use the following form to define the URLs in which the test should run.',
					'user',
					'nelio-ab-testing'
				) }
			</p>
		);
	} //end if

	const removeScopeRule = ( id: ScopeRuleId ) => {
		if (
			'custom-with-tested-post' === scopeSupport &&
			2 === rules.length
		) {
			void removeScopeRules( map( rules, 'id' ) );
		} else {
			void removeScopeRules( id );
		} //end if
	};

	return (
		<>
			<p>
				{ 'custom-with-tested-post' === scopeSupport
					? _x(
							'Variants will be visible only on pages matching the following criteria, as well as on the tested element’s page.',
							'text',
							'nelio-ab-testing'
					  )
					: _x(
							'Variants will be visible only on pages matching the following criteria:',
							'text',
							'nelio-ab-testing'
					  ) }
			</p>

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
							<Button
								variant="link"
								isDestructive
								className="nab-experiment-scope__remove-rule-action"
								onClick={ () => removeScopeRule( id ) }
							>
								{ _x(
									'Delete',
									'command',
									'nelio-ab-testing'
								) }
							</Button>
						</li>
					) ) }
			</ul>
		</>
	);
};

// =======
// HELPERS
// =======

export const isCustomUrlScopeRule = ( r: ScopeRule ): r is CustomUrlScopeRule =>
	'exact' === r.attributes.type || 'partial' === r.attributes.type;
