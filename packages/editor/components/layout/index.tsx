/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { NoticeList } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';
import { store as NOTICES } from '@safe-wordpress/notices';

/**
 * External dependencies
 */
import { isEmpty } from '@nab/utils';

/**
 * Internal dependencies
 */
import './style.scss';
import { StatusManager } from '../status-manager';
import { Header } from '../header';
import { ExperimentName } from '../experiment-name';
import { GoalSection } from '../goal-section';
import { SegmentationSection } from '../segmentation-section';
import { Sidebar } from '../sidebar';

import { AlternativeSection } from '../alternative-section';

export const Layout = (): JSX.Element => {
	const notices = useNotices();
	const { removeNotice } = useDispatch( NOTICES );

	return (
		<div className="nab-edit-experiment-layout">
			<StatusManager />
			<Header />
			<div className="nab-edit-experiment-layout__body">
				<div
					className="nab-edit-experiment-layout__content"
					role="region"
					/* translators: accessibility text for the content landmark region. */
					aria-label={ _x(
						'Editor content',
						'text',
						'nelio-ab-testing'
					) }
					tabIndex={ -1 }
				>
					{ ! isEmpty( notices ) && (
						<NoticeList
							className="nab-edit-experiment-layout__notices"
							notices={ notices }
							onRemove={ removeNotice }
						/>
					) }

					<ExperimentName />
					<AlternativeSection />
					<GoalSection />
					<SegmentationSection />
				</div>

				<Sidebar />
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useNotices = () =>
	useSelect( ( select ) => select( NOTICES ).getNotices() );
