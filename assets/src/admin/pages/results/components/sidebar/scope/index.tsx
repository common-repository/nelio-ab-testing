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
import { RuleList } from './rule-list';
import { useExperimentAttribute } from '../../hooks';

export const Scope = (): JSX.Element | null => {
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
			<RuleList scopeSupport={ scopeSupport } />
		</PanelBody>
	);
};

// =====
// HOOKS
// =====

const useScopeSupport = () => {
	const type = useExperimentAttribute( 'type' ) ?? '';
	return useSelect( ( select ) =>
		select( NAB_EXPERIMENTS ).getExperimentSupport( type, 'scope' )
	);
};

const useTestAgainstExistingContent = () => {
	const alts = useExperimentAttribute( 'alternatives' ) ?? [];
	const control = alts[ 0 ];
	return !! control?.attributes?.testAgainstExistingContent;
};
