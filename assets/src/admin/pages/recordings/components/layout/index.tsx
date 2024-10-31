/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { NoticeList } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';
import { store as NOTICES } from '@safe-wordpress/notices';

/**
 * Internal dependencies
 */

import { ActionButton } from '../action-button';
import './style.scss';
import type { Settings } from '../../types';
import Image from '../../../../../images/screen-recording.svg';

type LayoutProps = {
	readonly settings: Settings;
};
export const Layout = ( { settings }: LayoutProps ): JSX.Element => {
	const notices = useNotices();
	const { removeNotice } = useDispatch( NOTICES );

	return (
		<>
			<NoticeList
				notices={ notices }
				className="components-editor-notices__pinned"
				onRemove={ removeNotice }
			/>
			<div className="nab-recordings-container">
				<div className="nab-recordings-container__column">
					<h1>
						{ _x(
							'Nelio Session Recordings',
							'text',
							'nelio-ab-testing'
						) }
					</h1>
					<h4>
						{ _x(
							'See what your visitors see',
							'text',
							'nelio-ab-testing'
						) }
					</h4>
					<p>
						{ _x(
							'Put yourself in your customers’ shoes. Watch recordings of actual visitors using your website to learn the truth about their behavior and why they don’t take the action you want them to.',
							'user',
							'nelio-ab-testing'
						) }
					</p>
					<ActionButton settings={ settings } />
				</div>
				<div className="nab-recordings-container__column">
					<Image className="nab-session-recording-image" />
				</div>
			</div>
		</>
	);
};

// =====
// HOOKS
// =====

const useNotices = () =>
	useSelect( ( select ) => select( NOTICES ).getNotices() );
