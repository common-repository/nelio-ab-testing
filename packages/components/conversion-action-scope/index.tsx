/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	Dashicon,
	SelectControl,
	TextControl,
	TextareaControl,
} from '@safe-wordpress/components';
import { _x, sprintf } from '@safe-wordpress/i18n';
import { createInterpolateElement, useState } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { trim } from 'lodash';
import { usePluginSetting } from '@nab/data';
import type { ConversionActionScope as CAS, Maybe, PostId } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';

export type ConversionActionScopeProps = {
	readonly error: Maybe< string >;
	readonly scope: CAS;
	readonly setScope: ( scope: CAS ) => void;
};

export const ConversionActionScope = (
	props: ConversionActionScopeProps
): JSX.Element | null => {
	const goalTracking = usePluginSetting( 'goalTracking' );
	const [ details, setDetails ] = useDetails( props );
	const { scope, setScope } = props;

	if ( 'custom' !== goalTracking ) {
		return null;
	} //end if

	return (
		<div className="nab-conversion-action-scope">
			<SelectControl
				options={ OPTIONS }
				label={ _x( 'Tracking Scope', 'text', 'nelio-ab-testing' ) }
				value={ scope.type }
				onChange={ ( type ) => {
					setDetails( '' );
					switch ( type ) {
						case 'post-ids':
							return setScope( { type, ids: [] } );

						case 'urls':
							return setScope( { type, regexes: [] } );

						default:
							return setScope( { type } );
					} //end switch
				} }
			/>

			{ scope.type === 'post-ids' && (
				<TextControl
					placeholder={ _x(
						'Comma-separated post IDs',
						'text',
						'nelio-ab-testing'
					) }
					value={ details }
					onChange={ setDetails }
				/>
			) }

			{ scope.type === 'urls' && (
				<TextareaControl
					placeholder={ _x(
						'One URL per line',
						'text',
						'nelio-ab-testing'
					) }
					value={ details }
					onChange={ setDetails }
					help={ createInterpolateElement(
						sprintf(
							/* translators: an asterisk “*” */
							_x(
								'One URL per line. You can use the wildcard %s multiple times in each URL to match any number of characters at its beginning, end, or within it.',
								'user',
								'nelio-ab-testing'
							),
							'<code>*</code>'
						),
						{
							br: <br />,
							code: <code />,
						}
					) }
				/>
			) }

			{ props.error && (
				<span className="nab-error-text">
					<Dashicon icon="warning" />
					{ props.error }
				</span>
			) }
		</div>
	);
};

// =====
// HOOKS
// =====

const useDetails = ( {
	scope,
	setScope,
}: ConversionActionScopeProps ): [ string, ( v: string ) => void ] => {
	let initialValue = '';
	initialValue =
		scope.type === 'post-ids' ? scope.ids.join( ', ' ) : initialValue;
	initialValue =
		scope.type === 'urls' ? scope.regexes.join( '\n' ) : initialValue;

	const [ details, setDetails ] = useState( initialValue );

	const setValue = ( value: string ) => {
		setDetails( value );
		switch ( scope.type ) {
			case 'post-ids':
				return setScope( {
					type: scope.type,
					ids: value
						.split( /[^0-9]/g )
						.map( ( x ) => Number.parseInt( x ) )
						.filter( ( x ) => ! Number.isNaN( x ) )
						.filter( ( x ): x is PostId => x > 0 ),
				} );

			case 'urls':
				return setScope( {
					type: scope.type,
					regexes: value
						.split( /\n/g )
						.map( trim )
						.filter( ( x ) => !! x ),
				} );
		} //end switch
	};

	return [ details, setValue ];
};

// ====
// DATA
// ====

const OPTIONS: ReadonlyArray< {
	readonly value: CAS[ 'type' ];
	readonly label: string;
} > = [
	{
		value: 'all-pages',
		label: _x( 'All Pages', 'text', 'nelio-ab-testing' ),
	},
	{
		value: 'test-scope',
		label: _x( 'Tested Pages', 'text', 'nelio-ab-testing' ),
	},
	{
		value: 'post-ids',
		label: _x( 'Post IDs', 'text', 'nelio-ab-testing' ),
	},
	{
		value: 'urls',
		label: _x( 'URLs', 'text', 'nelio-ab-testing' ),
	},
];
