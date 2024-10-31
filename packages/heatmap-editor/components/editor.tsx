/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { StrictMode } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { store as NAB_DATA } from '@nab/data';
import { EditorProvider } from '@nab/editor';
import type { ExperimentId } from '@nab/types';

/**
 * Internal dependencies
 */
import { Layout } from './layout';

export type EditorProps = {
	readonly experimentId: ExperimentId;
};

export const Editor = ( { experimentId }: EditorProps ): JSX.Element | null => {
	const experiment = useSelect( ( select ) =>
		select( NAB_DATA ).getExperiment( experimentId )
	);

	if ( ! experiment ) {
		return null;
	} //end if

	return (
		<StrictMode>
			<EditorProvider experiment={ experiment }>
				<Layout />
			</EditorProvider>
		</StrictMode>
	);
};
