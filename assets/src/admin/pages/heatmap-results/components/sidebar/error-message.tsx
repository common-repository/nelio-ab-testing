/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';
import { Button } from '@safe-wordpress/components';
import type { HeatmapDataStatus } from '@nab/types';

/**
 * External dependencies
 */
import { useRawResultsStatus } from '../hooks';

export const ErrorMessage = (): JSX.Element | null => {
	const [ status, setStatus ] = useRawResultsStatus();
	const errorMessage = getErrorMessage( status );
	const dismiss = () => setStatus( { mode: 'ready' } );

	if ( ! errorMessage ) {
		return null;
	} //end if

	return (
		<div className="nab-heatmap-results-sidebar__error-message">
			<div>{ errorMessage }</div>
			<div>
				<Button icon="no" onClick={ dismiss } label="Dismiss"></Button>
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

function getErrorMessage( status: HeatmapDataStatus ): string {
	if ( 'ready' !== status.mode ) {
		return '';
	} //end if

	switch ( status.partialError ) {
		case 'unknown':
			return _x(
				'Something went wrong and results couldn’t be fully loaded',
				'text',
				'nelio-ab-testing'
			);

		case 'stuck-results':
			return _x(
				'Results are still being computed in Nelio’s cloud',
				'text',
				'nelio-ab-testing'
			);

		case undefined:
			return '';
	} //end switch
} //end getErrorMessage()
