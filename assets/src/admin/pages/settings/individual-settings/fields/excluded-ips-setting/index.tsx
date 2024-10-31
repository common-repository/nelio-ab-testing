/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import apiFetch from '@safe-wordpress/api-fetch';
import { TextareaControl } from '@safe-wordpress/components';
import { useEffect, useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';

import { useAttributes } from '../hooks';

import { DEFAULT_ATTRS } from './config';
import type { FieldSettingProps } from '../types';

export const ExcludedIPsSetting = ( {
	name: settingName,
}: FieldSettingProps ): JSX.Element => {
	const { shouldForceUpdate, status, ips, setIPs } =
		useExcludedIPs( settingName );

	return (
		<div className="nab-excluded-ips-setting">
			<TextareaControl
				disabled={ 'ready' !== status }
				value={ ips.join( '\n' ) }
				onChange={ ( v ) => setIPs( v.split( '\n' ) ) }
				placeholder={ getPlaceholder( status ) }
			/>
			{ 'ready' === status && (
				<input
					type="hidden"
					name={ settingName }
					value={ ips.join( '\n' ) }
				/>
			) }
			{ shouldForceUpdate && (
				<input
					type="hidden"
					name={ `${ settingName.replace( ']', '' ) }_force_update]` }
					value="true"
				/>
			) }
		</div>
	);
};

// =================
// HOOKS AND HELPERS
// =================

type Status = 'loading' | 'ready' | 'error';

const useExcludedIPs = (
	settingName: string
): {
	readonly ips: ReadonlyArray< string >;
	readonly setIPs: ( ips: ReadonlyArray< string > ) => void;
	readonly shouldForceUpdate?: true;
	readonly status: Status;
} => {
	const [ status, setStatus ] = useState< Status >( 'loading' );
	const [ attributes, setAttributes ] = useAttributes(
		settingName,
		DEFAULT_ATTRS
	);

	useEffect( () => {
		apiFetch< ReadonlyArray< string > >( {
			path: '/nab/v1/site/excluded-ips',
		} )
			.then( ( ips ) => {
				setAttributes( { ips } );
				setStatus( 'ready' );
			} )
			.catch( () => setStatus( 'error' ) );
	}, [] );

	return {
		ips: attributes.ips,
		setIPs: ( ips ) => setAttributes( { ips, shouldForceUpdate: true } ),
		shouldForceUpdate: attributes.shouldForceUpdate,
		status,
	};
};

const getPlaceholder = ( status: Status ) => {
	switch ( status ) {
		case 'loading':
			return _x( 'Loading, please wait…', 'text', 'nelio-ab-testing' );

		case 'ready':
			return _x( 'One IP per line', 'text', 'nelio-ab-testing' );

		case 'error':
			return _x( 'Something went wrong!', 'text', 'nelio-ab-testing' );
	} //end switch
};
