/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { BaseControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';

export const ScrollmapLegend = (): JSX.Element => (
	<BaseControl
		id="nab-scrollmap-legend"
		className="nab-scrollmap-legend"
		label={ _x( 'Scrollmap Legend', 'text', 'nelio-ab-testing' ) }
	>
		<div className="nab-scrollmap-legend__container">
			<div className="nab-scrollmap-legend__scale">
				<div className="nab-scrollmap-legend__percent nab-scrollmap-legend__percent--0"></div>
				<div className="nab-scrollmap-legend__percent nab-scrollmap-legend__percent--25"></div>
				<div className="nab-scrollmap-legend__percent nab-scrollmap-legend__percent--50"></div>
				<div className="nab-scrollmap-legend__percent nab-scrollmap-legend__percent--75"></div>
				<div className="nab-scrollmap-legend__percent nab-scrollmap-legend__percent--100"></div>
			</div>
			<div className="nab-scrollmap-legend__text">
				<span>
					{ _x( 'Less popular', 'text', 'nelio-ab-testing' ) }
				</span>
				<span>
					{ _x( 'More popular', 'text', 'nelio-ab-testing' ) }
				</span>
			</div>
		</div>
	</BaseControl>
);
