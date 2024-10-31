/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';
// import type { AlternativeId } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { Header } from './header';
import { FooterActions } from './footer-actions';

import { Summary } from './summary';
import { Description } from '../../../results/components/sidebar/description';
import { KindSelector } from '../kind-selector';
import { Export } from './export';
import { Advanced } from './advanced';
import { ErrorMessage } from './error-message';
import { ParticipationConditions } from './participation-conditions';

export type SidebarProps = {
	readonly className?: string;
};

export const Sidebar = ( { className }: SidebarProps ): JSX.Element => {
	return (
		<div
			className={ classnames( [
				'nab-heatmap-results-sidebar',
				className,
			] ) }
		>
			<Header />

			<div className="nab-heatmap-results-sidebar__wrapper">
				<KindSelector />
				<Summary />
				<Description />
				<ParticipationConditions />
				<Export />
				<Advanced />
			</div>

			<ErrorMessage />
			<FooterActions />
		</div>
	);
};
