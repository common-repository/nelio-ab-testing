/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { NoticeList as Notices } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { store as NOTICES } from '@safe-wordpress/notices';

export const NoticeList = (): JSX.Element => {
	const notices = useNotices();
	const { removeNotice } = useDispatch( NOTICES );
	return <Notices notices={ notices } onRemove={ removeNotice } />;
};

// =====
// HOOKS
// =====

const useNotices = () =>
	useSelect( ( select ) => select( NOTICES ).getNotices() );
