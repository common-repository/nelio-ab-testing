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
import { LoadingAnimation } from '@nab/components';

/**
 * Internal dependencies
 */
import { store as NAB_ACCOUNT } from '../../store';

export type AccountProviderProps = {
	readonly children: JSX.Element | JSX.Element[];
};

export const AccountProvider = ( {
	children,
}: AccountProviderProps ): JSX.Element => {
	const isLoading = useIsLoading();
	const hasError = useHasError();
	const notices = useNotices();
	const { removeNotice } = useDispatch( NOTICES );

	if ( isLoading ) {
		return (
			<LoadingAnimation
				text={ _x( 'Loading…', 'text', 'nelio-ab-testing' ) }
			/>
		);
	} //end if

	return (
		<>
			<NoticeList
				notices={ notices }
				className="components-editor-notices__pinned"
				onRemove={ removeNotice }
			/>
			{ ! hasError && children }
		</>
	);
};

// =====
// HOOKS
// =====

const useIsLoading = () =>
	useSelect( ( select ) => {
		select( NAB_ACCOUNT ).getAccount();
		return ! select( NAB_ACCOUNT ).hasFinishedResolution( 'getAccount' );
	} );

const useHasError = () =>
	useSelect( ( select ) =>
		select( NAB_ACCOUNT ).hasResolutionFailed( 'getAccount' )
	);

const useNotices = () =>
	useSelect( ( select ) => select( NOTICES ).getNotices() );
