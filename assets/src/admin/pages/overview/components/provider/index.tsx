/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { NoticeList } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { store as NOTICES } from '@safe-wordpress/notices';

export type OverviewProviderProps = {
	readonly children: JSX.Element | JSX.Element[];
};

export const OverviewProvider = ( {
	children,
}: OverviewProviderProps ): JSX.Element => {
	const notices = useNotices();
	return (
		<>
			<NoticeList notices={ notices } />
			{ children }
		</>
	);
};

// =====
// HOOKS
// =====

const useNotices = () =>
	useSelect( ( select ) => select( NOTICES ).getNotices() );
