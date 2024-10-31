/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import apiFetch from '@safe-wordpress/api-fetch';
import { addQueryArgs } from '@safe-wordpress/url';
import { _x } from '@safe-wordpress/i18n';
import { useDispatch, useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { AsyncPaginate } from 'react-select-async-paginate';
import { store as NAB_DATA } from '@nab/data';
import type { Maybe, Menu, MenuId, PaginatedResults } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';

export type MenuSearcherProps = {
	readonly className?: string;
	readonly value: Maybe< MenuId >;
	readonly onChange: ( val: Maybe< MenuId > ) => void;
	readonly disabled?: boolean;
	readonly placeholder?: string;
};

type AdditionalArgs = {
	readonly page: number;
};

export const MenuSearcher = ( {
	className,
	disabled,
	onChange,
	placeholder: defaultPlaceholder,
	value,
}: MenuSearcherProps ): JSX.Element => {
	const menu = useMenu( value );
	const isLoading = useIsLoadingMenu( value );
	const placeholder = usePlaceholder( value, defaultPlaceholder );
	const loadOptions = useOptionLoader();

	const label = menu?.name;
	const selectedOption =
		! isLoading && value ? { value, label: label ?? '' } : undefined;

	return (
		<AsyncPaginate
			className={ classnames( [
				className,
				{
					'nab-menu-searcher': true,
					'nab-menu-searcher--is-loading': isLoading,
				},
			] ) }
			defaultOptions
			isDisabled={ disabled || isLoading }
			cacheUniqs={ [ 'nab-wp-menu' ] }
			loadOptions={ loadOptions }
			value={ selectedOption }
			onChange={ ( option ) =>
				onChange( ( Math.abs( option?.value ?? 0 ) as MenuId ) || 0 )
			}
			additional={ { page: 1 } }
			placeholder={ placeholder }
		/>
	);
};

// =====
// HOOKS
// =====

const useMenu = ( value?: MenuId ) =>
	useSelect( ( select ) => select( NAB_DATA ).getMenu( value || 0 ) );

const useIsLoadingMenu = ( value?: MenuId ) => {
	const menu = useMenu( value );
	return !! value && ! menu;
};

const usePlaceholder = (
	value?: MenuId,
	defaultPlaceholder?: string
): string => {
	const isLoading = useIsLoadingMenu( value );
	if ( isLoading ) {
		return _x( 'Loading…', 'text', 'nelio-ab-testing' );
	} //end if

	return (
		defaultPlaceholder || _x( 'Select a menu…', 'user', 'nelio-ab-testing' )
	);
};

const useOptionLoader = () => {
	const { receiveMenus } = useDispatch( NAB_DATA );
	const cacheEntities = ( entities: ReadonlyArray< Menu > ) =>
		entities.length && receiveMenus( entities );

	return ( query: string, _: unknown, args?: AdditionalArgs ) =>
		apiFetch< PaginatedResults< ReadonlyArray< Menu > > >( {
			path: addQueryArgs( '/nab/v1/menu/search', { query } ),
		} ).then( ( data ) => {
			void cacheEntities( data.results );
			return {
				options: data.results.map( ( option ) => ( {
					value: option.id,
					label: option.name,
				} ) ),
				hasMore: data.pagination.more,
				additional: {
					page: ( args?.page ?? 1 ) + 1,
				},
			};
		} );
};
