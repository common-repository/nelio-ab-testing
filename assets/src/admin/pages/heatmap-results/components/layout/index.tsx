/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import classnames from 'classnames';
import type {
	AlternativeId,
	AlternativeIndex,
	Dict,
	Heatmap,
} from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { useActiveExperiment, useSidebarVisibility } from '../hooks';
import { store as NAB_HEATMAP } from '../../store';
import { Sidebar } from '../sidebar';
import { View } from '../view';

export type LayoutProps = {
	readonly alternativeId: AlternativeId;
};

export const Layout = (): JSX.Element => {
	const [ isVisible ] = useSidebarVisibility();
	const contentUrls = useContentUrls();

	return (
		<div className="nab-heatmap-results">
			<Sidebar
				className={ classnames( {
					'nab-heatmap-results__sidebar': true,
					'nab-heatmap-results__sidebar--is-collapsed': ! isVisible,
				} ) }
			/>

			{ contentUrls.map( ( { alternative, url } ) => (
				<View
					key={ `nab-heatmap-results__content--alternative-${ alternative }` }
					className={ classnames( {
						'nab-heatmap-results__content': true,
						'nab-heatmap-results__content--is-fullscreen':
							! isVisible,
					} ) }
					alternative={ alternative }
					contentUrl={ url }
				/>
			) ) }
		</div>
	);
};

// =====
// HOOKS
// =====

type Result = { readonly alternative: AlternativeIndex; url: string };
const useContentUrls = (): ReadonlyArray< Result > => {
	const experiment = useActiveExperiment();
	const iframes = useSelect( ( select ) =>
		select( NAB_HEATMAP ).getIFrames()
	);

	if ( ! experiment ) {
		return [];
	} //end if

	if ( isHeatmap( experiment ) ) {
		return [ { alternative: 0, url: experiment.links.heatmap } ];
	} //end if

	return experiment.alternatives
		.map( ( alt, index ) => ( {
			alternative: index,
			url: alt.links.heatmap,
		} ) )
		.filter( ( _, i ) => iframes.includes( i ) );
};

const isHeatmap = ( e: Dict ): e is Heatmap => 'nab/heatmap' === e.type;
