/**
 * WordPress dependencies
 */
import { dispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';
import { store as NOTICES } from '@safe-wordpress/notices';

/**
 * External dependencies
 */
import { v4 as uuid } from 'uuid';
import type {
	Alternative,
	AlternativeId,
	Goal,
	Segment,
	ScopeRule,
} from '@nab/types';

export function createAlternative(
	id?: AlternativeId
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Alternative< Record< string, any > > {
	return {
		id: id ?? uuid(),
		attributes: {},
		base: 'control',
		links: { edit: '', preview: '', heatmap: '' },
	};
} //end createAlternative()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function duplicateAlternative< T extends Record< string, any > >(
	alternative: Alternative< T >
): Alternative< T > {
	return {
		...alternative,
		id: uuid(),
		base: alternative.id,
		links: {
			edit: '',
			heatmap: '',
			preview: '',
		},
	};
} //end duplicateAlternative()

export function createGoal(): Goal {
	return {
		id: uuid(),
		attributes: { name: '' },
		conversionActions: [],
	};
} //end createGoal()

export function createSegment(): Segment {
	return {
		id: uuid(),
		attributes: { name: '' },
		segmentationRules: [],
	};
} //end createSegment()

export function createScopeRule(
	attributes: ScopeRule[ 'attributes' ]
): ScopeRule {
	return { id: uuid(), attributes } as ScopeRule;
} //end createScopeRule()

export function createStagingNotice(): void {
	const { createWarningNotice } = dispatch( NOTICES ) || {};

	void createWarningNotice(
		_x(
			'This site looks like a staging site and, therefore, Nelio A/B Testing won’t track any events. If this is not correct, please use the following filter to fix it:',
			'user',
			'nelio-ab-testing'
		),
		{
			isDismissible: false,
			actions: [
				{
					label: 'nab_staging_urls',
					url: 'https://neliosoftware.com/testing/hooks/nab_staging_urls/',
				},
			],
		}
	);
} //end createStagingNotice()
