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
import { store as NAB_DATA } from '@nab/data';
import type {
	EntityId,
	EntityInstance,
	EntityKindName,
	Maybe,
	PaginatedResults,
} from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { PostOption } from './post-option';
import { AsyncSelectControl } from '../async-select-control';

export type PostSearcherProps = {
	readonly id?: string;
	readonly className?: string;
	readonly type?: EntityKindName;
	readonly value: Maybe< EntityId >;
	readonly onChange: ( val: Maybe< EntityId > ) => void;
	readonly disabled?: boolean;
	readonly placeholder?: string;
	readonly menuPlacement?: 'auto' | 'top' | 'bottom';
	readonly menuShouldBlockScroll?: boolean;
} & Omit< OptionLoaderProps, 'type' >;

type OptionLoaderProps = {
	readonly type: EntityKindName;
	readonly perPage?: number;
	readonly filter?: ( p: EntityInstance ) => boolean;
};

export const PostSearcher = ( {
	id,
	className,
	disabled,
	onChange,
	placeholder: defaultPlaceholder,
	value,
	type = 'post',
	menuPlacement,
	menuShouldBlockScroll,
	...loaderProps
}: PostSearcherProps ): JSX.Element => {
	const post = usePost( type, value );
	const isLoading = useIsLoadingPost( type, value );
	const placeholder = usePlaceholder(
		{ type, id: value },
		defaultPlaceholder
	);

	const label = post?.title;
	const selectedOption =
		! isLoading && value ? { type, value, label: label ?? '' } : undefined;

	const loadOptions = useOptionLoader( { ...loaderProps, type } );

	return (
		<AsyncSelectControl
			id={ id }
			className={ classnames( [
				className,
				{
					'nab-post-searcher': true,
					'nab-post-searcher--is-loading': isLoading,
				},
			] ) }
			components={ { Option: PostOption } }
			disabled={ disabled || isLoading }
			cacheUniqs={ [ type ] }
			loadOptions={ loadOptions }
			value={ selectedOption }
			onChange={ ( option ) => onChange( option?.value ) }
			additional={ { page: 1 } }
			placeholder={ placeholder }
			menuPlacement={ menuPlacement }
			menuShouldBlockScroll={ menuShouldBlockScroll }
		/>
	);
};

// =====
// HOOKS
// =====

const usePost = ( type: EntityKindName, value?: EntityId ) =>
	useSelect( ( select ) =>
		select( NAB_DATA ).getEntityRecord( type, value || 0 )
	);

const useIsLoadingPost = ( type: EntityKindName, value?: EntityId ) => {
	const post = usePost( type, value );
	return !! value && ! post;
};

const usePlaceholder = (
	{ type, id }: { type: EntityKindName; id?: EntityId },
	defaultPlaceholder?: string
): string => {
	const isLoading = useIsLoadingPost( type, id );
	if ( isLoading ) {
		return _x( 'Loading…', 'text', 'nelio-ab-testing' );
	} //end if

	if ( defaultPlaceholder ) {
		return defaultPlaceholder;
	} //end if

	switch ( type ) {
		case 'page':
			return _x( 'Select a page…', 'user', 'nelio-ab-testing' );
		case 'post':
			return _x( 'Select a post…', 'user', 'nelio-ab-testing' );
		case 'product':
			return _x( 'Select a product…', 'user', 'nelio-ab-testing' );
		default:
			return _x( 'Select…', 'user', 'nelio-ab-testing' );
	} //end switch
};

const useOptionLoader = ( {
	type,
	perPage = 50,
	filter = () => true,
}: OptionLoaderProps ) => {
	const { receiveEntityRecords } = useDispatch( NAB_DATA );

	const cacheEntities = ( entities: ReadonlyArray< EntityInstance > ): void =>
		void ( entities.length && receiveEntityRecords( type, entities ) );

	return ( query: string, _: unknown, args?: { page: number } ) =>
		apiFetch< PaginatedResults< ReadonlyArray< EntityInstance > > >( {
			path: addQueryArgs( '/nab/v1/post/search', {
				query,
				type,
				page: args?.page ?? 1,
				per_page: perPage,
			} ),
		} ).then( ( data ) => {
			cacheEntities( data.results );
			const results = data.results.filter( filter );
			return {
				options: results.map( ( option ) => ( {
					value: option.id,
					label: option.title,
					type,
				} ) ),
				hasMore: data.pagination.more,
				additional: {
					page: ( args?.page ?? 1 ) + 1,
				},
			};
		} );
};
