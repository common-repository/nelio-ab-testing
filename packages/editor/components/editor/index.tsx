/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { StrictMode, useEffect } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { store as NAB_DATA } from '@nab/data';
import type { ExperimentId } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { EditorProvider } from '../provider';
import { Layout } from '../layout';

import { renderHelp } from '../../help';

export type EditorProps = {
	readonly experimentId: ExperimentId;
};

export const Editor = ( { experimentId }: EditorProps ): JSX.Element => {
	const experiment = useSelect( ( select ) =>
		select( NAB_DATA ).getExperiment( experimentId )
	);

	useEffect( () => {
		if ( experiment ) {
			renderHelp();
		} //end if
	}, [ !! experiment ] );

	return (
		<StrictMode>
			<EditorProvider experiment={ experiment }>
				<Layout />
			</EditorProvider>
		</StrictMode>
	);
};
