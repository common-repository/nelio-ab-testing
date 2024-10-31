/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	NoticeList,
	Popover,
	SlotFillProvider,
} from '@safe-wordpress/components';
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
import { Header } from '../header';
import { Sidebar } from '../sidebar';
import { EvolutionSection } from '../evolution-section';
import { AlternativeSection } from '../alternative-section';
import { AlternativePreviewDialog } from '../alternative-preview-dialog';
import { GoalSection } from '../goal-section';
import { SegmentationSection } from '../segmentation-section';

export const Layout = (): JSX.Element => {
	const notices = useNotices();
	const { removeNotice } = useDispatch( NOTICES );

	return (
		<div className="nab-results-experiment-layout">
			<SlotFillProvider>
				<Header />
				<div className="nab-results-experiment-layout__body">
					<Sidebar />

					<div
						className="nab-results-experiment-layout__content"
						role="region"
						/* translators: accessibility text for the content landmark region. */
						aria-label={ _x(
							'Results content',
							'text',
							'nelio-ab-testing'
						) }
						tabIndex={ -1 }
					>
						{ ! isEmpty( notices ) && (
							<NoticeList
								className="nab-results-experiment-layout__notices"
								notices={ notices }
								onRemove={ removeNotice }
							/>
						) }

						<EvolutionSection />
						<AlternativeSection />
						<GoalSection />
						<SegmentationSection />
					</div>
				</div>

				<AlternativePreviewDialog />
				<Popover.Slot />
			</SlotFillProvider>
		</div>
	);
};

// =====
// HOOKS
// =====

const useNotices = () =>
	useSelect( ( select ) => select( NOTICES ).getNotices() );
