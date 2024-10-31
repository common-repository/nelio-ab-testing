/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PanelBody, Button } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';
import {
	useActiveAlternative,
	useActiveMode,
	useActiveResolution,
	useIsLocked,
	useIsProcessingResults,
} from '../../hooks';
import { store as NAB_HEATMAP } from '../../../store';

export const Advanced = (): JSX.Element | null => {
	const isLocked = useIsLocked();
	const isVisible = useIsVisible();
	const repositionData = useRepositionData();
	const isProcessing = useIsProcessingResults();

	if ( ! isVisible ) {
		return null;
	} //end if

	return (
		<PanelBody
			initialOpen={ false }
			className="nab-advanced"
			title={ _x( 'Advanced', 'text', 'nelio-ab-testing' ) }
		>
			<p>
				{ _x(
					'Under some circumstances, when your page loads content dynamically, the results may be shifted from their correct position. Refresh the view to re-render the results properly:',
					'user',
					'nelio-ab-testing'
				) }
			</p>

			<Button
				className="nab-advanced__reposition-button"
				disabled={ isLocked }
				isBusy={ isProcessing }
				variant="secondary"
				onClick={ repositionData }
			>
				{ isProcessing
					? _x( 'Refreshing View…', 'command', 'nelio-ab-testing' )
					: _x( 'Refresh View', 'command', 'nelio-ab-testing' ) }
			</Button>
		</PanelBody>
	);
};

// =====
// HOOKS
// =====

const useIsVisible = () => 'scrollmap' !== useActiveMode()[ 0 ];

const useRepositionData = () => {
	const [ alternative ] = useActiveAlternative();
	const [ resolution ] = useActiveResolution();
	const { requestResultProcessing } = useDispatch( NAB_HEATMAP );
	return () => requestResultProcessing( alternative, resolution );
};
