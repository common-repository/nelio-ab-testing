/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { ScopeType, ScopeRule, Experiment } from '@nab/types';

export function getScopeExplanation(
	scopeSupport: ScopeType,
	rules: ReadonlyArray< ScopeRule >,
	status: Experiment[ 'status' ]
): string {
	switch ( scopeSupport ) {
		case 'tested-post-with-consistency':
			return getConsistencyExplanation( rules, status );

		case 'custom-with-tested-post':
			return getCustomWithTestedPostExplanation( rules, status );

		case 'custom':
			return getCustomExplanation( rules, status );
	} //end switch
} //end getScopeExplanation()

function getConsistencyExplanation(
	rules: ReadonlyArray< ScopeRule >,
	status: Experiment[ 'status' ]
) {
	if ( 'running' === status ) {
		if ( ! rules.length ) {
			return _x(
				'Variants are visible on the tested element’s page. All other pages also show the appropriate variant of this test whenever the tested element appears on them.',
				'text',
				'nelio-ab-testing'
			);
		} //end if

		return _x(
			'Variants are visible only on the tested element’s page.',
			'text',
			'nelio-ab-testing'
		);
	} //end if

	if ( ! rules.length ) {
		return _x(
			'Variants were visible on the tested element’s page. All other pages also showed the appropriate variant of this test whenever the tested element appeared on them.',
			'text',
			'nelio-ab-testing'
		);
	} //end if

	return _x(
		'Variants were visible only on the tested element’s page.',
		'text',
		'nelio-ab-testing'
	);
} //end getConsistencyExplanation()

function getCustomWithTestedPostExplanation(
	rules: ReadonlyArray< ScopeRule >,
	status: Experiment[ 'status' ]
) {
	if ( 'running' === status ) {
		if ( ! rules.length ) {
			return _x(
				'Variants are visible on all the pages of your website, including that of the tested element.',
				'text',
				'nelio-ab-testing'
			);
		} //end if

		return _x(
			'Variants are visible only on pages matching the following criteria, as well as on the tested element’s page.',
			'text',
			'nelio-ab-testing'
		);
	} //end if

	if ( ! rules.length ) {
		return _x(
			'Variants were visible on all the pages of your website, including that of the tested element.',
			'text',
			'nelio-ab-testing'
		);
	} //end if

	return _x(
		'Variants were visible only on pages matching the following criteria, as well as on the tested element’s page.',
		'text',
		'nelio-ab-testing'
	);
} //end getCustomWithTestedPostExplanation()

function getCustomExplanation(
	rules: ReadonlyArray< ScopeRule >,
	status: Experiment[ 'status' ]
) {
	if ( 'running' === status ) {
		if ( ! rules.length ) {
			return _x(
				'Variants are visible on all the pages of your website.',
				'text',
				'nelio-ab-testing'
			);
		} //end if

		return _x(
			'Variants are visible only on pages matching the following criteria:',
			'text',
			'nelio-ab-testing'
		);
	} //end if

	if ( ! rules.length ) {
		return _x(
			'Variants were visible on all the pages of your website.',
			'text',
			'nelio-ab-testing'
		);
	} //end if

	return _x(
		'Variants were visible only on pages matching the following criteria:',
		'text',
		'nelio-ab-testing'
	);
} //end getCustomExplanation()
