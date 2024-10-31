/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PanelRow } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { Experiment } from '@nab/types';

export type StatusProps = {
	readonly status: Experiment[ 'status' ];
};

export const Status = ( { status }: StatusProps ): JSX.Element => (
	<PanelRow className="nab-experiment-summary__status">
		<span>{ _x( 'Status', 'text', 'nelio-ab-testing' ) }</span>
		<strong>{ getStatusLabel( status ) }</strong>
	</PanelRow>
);

function getStatusLabel( status: Experiment[ 'status' ] ): string {
	switch ( status ) {
		case 'paused':
			return _x(
				'Paused',
				'text (experiment status)',
				'nelio-ab-testing'
			);

		case 'finished':
			return _x(
				'Finished',
				'text (experiment status)',
				'nelio-ab-testing'
			);

		default:
			return _x(
				'Running',
				'text (experiment status)',
				'nelio-ab-testing'
			);
	} //end switch
} //end getStatusLabel()
