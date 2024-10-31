/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, PanelBody, PanelRow } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NAB_DATA } from '@nab/data';

/**
 * Internal dependencies
 */
import './style.scss';
import { Status } from './status';
import { ExperimentStartSchedule } from './experiment-start-schedule';
import { ExperimentEndSchedule } from './experiment-end-schedule';
import { store as NAB_EDITOR } from '../../../store';

export const ExperimentManagement = (): JSX.Element => {
	const canDelete = useCanDelete();
	const { moveToTrash } = useDispatch( NAB_EDITOR );
	return (
		<PanelBody
			className="nab-experiment-management"
			title={ _x(
				'Status & Management',
				'text (experiment)',
				'nelio-ab-testing'
			) }
		>
			<Status />
			<ExperimentStartSchedule />
			<ExperimentEndSchedule />

			{ canDelete && (
				<PanelRow className="nab-experiment-management__trash">
					<Button
						variant="tertiary"
						isDestructive
						onClick={ () => void moveToTrash() }
					>
						{ _x(
							'Move to Trash',
							'command (experiment)',
							'nelio-ab-testing'
						) }
					</Button>
				</PanelRow>
			) }
		</PanelBody>
	);
};

// =====
// HOOKS
// =====

const useCanDelete = () =>
	useSelect( ( select ) =>
		select( NAB_DATA ).hasCapability( 'delete_nab_experiments' )
	);
