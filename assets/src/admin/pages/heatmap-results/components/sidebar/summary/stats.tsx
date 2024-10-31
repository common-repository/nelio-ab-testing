/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PanelRow } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { compactInteger } from '@nab/i18n';

export type StatsProps = {
	readonly clicks?: number;
	readonly views?: number;
};

export const Stats = ( { clicks, views }: StatsProps ): JSX.Element => (
	<>
		<PanelRow className="nab-experiment-summary__pageviews">
			<span>{ _x( 'Page Views', 'text', 'nelio-ab-testing' ) }</span>
			<span>
				{ 'undefined' !== typeof views ? compactInteger( views ) : '-' }
			</span>
		</PanelRow>
		<PanelRow className="nab-experiment-summary__clicks">
			<span>
				{ _x( 'Total Click Count', 'text', 'nelio-ab-testing' ) }
			</span>
			<span>
				{ 'undefined' !== typeof clicks
					? compactInteger( clicks )
					: '-' }
			</span>
		</PanelRow>
	</>
);
