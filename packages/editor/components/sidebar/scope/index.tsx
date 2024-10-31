/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PanelBody } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NAB_EXPERIMENTS } from '@nab/experiments';

/**
 * Internal dependencies
 */
import './style.scss';
import { NewRuleForm } from './new-rule-form';
import { RuleList } from './rule-list';
import { ConsistencyScope } from './consistency-scope';
import { store as NAB_EDITOR } from '../../../store';

export const Scope = (): JSX.Element | null => {
	const rules = useRules();
	const scopeSupport = useScopeSupport();
	const testAgainstExistingContent = useTestAgainstExistingContent();

	if ( ! scopeSupport ) {
		return null;
	} //end if

	if ( testAgainstExistingContent ) {
		return null;
	} //end if

	return (
		<PanelBody
			className="nab-experiment-scope"
			title={ _x( 'Test Scope', 'text', 'nelio-ab-testing' ) }
		>
			{ 'tested-post-with-consistency' === scopeSupport ? (
				<ConsistencyScope rules={ rules } />
			) : (
				<>
					<RuleList rules={ rules } scopeSupport={ scopeSupport } />
					<NewRuleForm
						rules={ rules }
						scopeSupport={ scopeSupport }
					/>
				</>
			) }
		</PanelBody>
	);
};

// =====
// HOOKS
// =====

const useRules = () =>
	useSelect( ( select ) => select( NAB_EDITOR ).getScope() );

const useScopeSupport = () =>
	useSelect( ( select ) => {
		const { getExperimentSupport } = select( NAB_EXPERIMENTS );
		const { getExperimentType } = select( NAB_EDITOR );
		return getExperimentSupport( getExperimentType(), 'scope' );
	} );

const useTestAgainstExistingContent = () =>
	useSelect( ( select ) => {
		const control = select( NAB_EDITOR ).getAlternative( 'control' );
		return !! control?.attributes.testAgainstExistingContent;
	} );
