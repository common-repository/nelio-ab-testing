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

/**
 * Internal dependencies
 */
import './style.scss';
import { useExperimentAttribute } from '../../../hooks';

export const Status = (): JSX.Element => {
	const [ status ] = useExperimentAttribute( 'status' );
	return (
		<PanelRow className="nab-experiment-management__status">
			<span>{ _x( 'Status', 'text', 'nelio-ab-testing' ) }</span>
			<strong className="nab-experiment-management__status-value">
				{ getStatusLabel( status ) }
			</strong>
		</PanelRow>
	);
};

// =======
// HELPERS
// =======

function getStatusLabel( status: Experiment[ 'status' ] ): string {
	switch ( status ) {
		case 'draft':
			return _x(
				'Draft',
				'text (experiment status)',
				'nelio-ab-testing'
			);

		case 'ready':
			return _x(
				'Ready',
				'text (experiment status)',
				'nelio-ab-testing'
			);

		case 'scheduled':
			return _x(
				'Scheduled',
				'text (experiment status)',
				'nelio-ab-testing'
			);

		case 'paused':
			return _x(
				'Paused',
				'text (experiment status)',
				'nelio-ab-testing'
			);

		case 'paused_draft':
			return _x(
				'Paused Draft',
				'text (experiment status)',
				'nelio-ab-testing'
			);

		case 'running':
		case 'finished':
		case 'trash':
			return '-';
	} //end switch
} //end getStatusLabel()
