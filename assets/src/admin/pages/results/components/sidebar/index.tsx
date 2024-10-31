/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NAB_DATA } from '@nab/data';

/**
 * Internal dependencies
 */
import './style.scss';
import { Result } from './result';
import { Summary } from './summary';
import { Description } from './description';
import { Scope } from './scope';
import { Export } from './export';

export const Sidebar = (): JSX.Element => {
	const dims = useSidebarDimensions();
	return (
		<div className="nab-results-experiment-sidebar" style={ dims }>
			<div className="nab-results-experiment-sidebar__element-wrapper">
				<Result />
				<Summary />
				<Description />
				<Scope />
				<Export />
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useSidebarDimensions = () =>
	useSelect( ( select ) => {
		const { getPageAttribute } = select( NAB_DATA );
		const { applyFix, ...dims } = getPageAttribute( 'sidebarDimensions' );
		return applyFix ? dims : undefined;
	} );
