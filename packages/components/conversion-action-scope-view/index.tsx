/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { createInterpolateElement } from '@safe-wordpress/element';
import { sprintf, _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { usePluginSetting } from '@nab/data';
import type { ConversionActionScope } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';

export type ConversionActionScopeViewProps = {
	readonly scope: ConversionActionScope;
};

export const ConversionActionScopeView = ( {
	scope,
}: ConversionActionScopeViewProps ): JSX.Element | null => {
	const goalTracking = usePluginSetting( 'goalTracking' );

	if ( 'custom' !== goalTracking ) {
		return null;
	} //end if

	switch ( scope.type ) {
		case 'all-pages':
			return (
				<div className="nab-conversion-action__scope-view">
					{ sprintf(
						'%1$s: %2$s.',
						_x( 'Tracking Scope', 'text', 'nelio-ab-testing' ),
						_x( 'All Pages', 'text', 'nelio-ab-testing' )
					) }
				</div>
			);

		case 'test-scope':
			return null;

		case 'post-ids':
			return (
				<div className="nab-conversion-action__scope-view">
					{ createInterpolateElement(
						sprintf(
							'%1$s: %2$s %3$s.',
							_x( 'Tracking Scope', 'text', 'nelio-ab-testing' ),
							_x( 'Post IDs', 'text', 'nelio-ab-testing' ),
							scope.ids
								.map( ( id ) => `<code>${ id }</code>` )
								.join( ', ' )
						),
						{ code: <code></code> }
					) }
				</div>
			);

		case 'urls':
			return (
				<div className="nab-conversion-action__scope-view">
					{ createInterpolateElement(
						sprintf(
							'%1$s: %2$s %3$s.',
							_x( 'Tracking Scope', 'text', 'nelio-ab-testing' ),
							_x( 'URLs', 'text', 'nelio-ab-testing' ),
							scope.regexes
								.map( ( re ) => `<code>${ re }</code>` )
								.join( ', ' )
						),
						{ code: <code></code> }
					) }
				</div>
			);

		case 'php-function':
			return null;
	} //end switch
};
