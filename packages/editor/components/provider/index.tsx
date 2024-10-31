/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useDispatch } from '@safe-wordpress/data';
import { useEffect, useState } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { createGoal } from '@nab/utils';
import type { Experiment } from '@nab/types';

/**
 * Internal dependencies
 */
import { store as NAB_EDITOR } from '../../store';

export type EditorProviderProps = {
	readonly experiment?: Experiment;
	readonly children: JSX.Element;
};

export const EditorProvider = ( {
	experiment,
	children,
}: EditorProviderProps ): JSX.Element | null => {
	const [ isReady, markAsReady ] = useState( false );
	const { setupEditor, setActiveGoal, setActiveSegment } =
		useDispatch( NAB_EDITOR );

	useEffect( () => {
		if ( ! experiment ) {
			return;
		} //end if

		const defaultGoal = experiment.goals[ 0 ] || createGoal();
		const activeSegment = experiment.segments[ 0 ];

		void setupEditor( experiment );
		void setActiveGoal( defaultGoal.id );
		if ( activeSegment ) {
			void setActiveSegment( activeSegment.id );
		} //end if
		markAsReady( true );
	}, [ !! experiment ] );

	return isReady ? <div>{ children }</div> : null;
};
