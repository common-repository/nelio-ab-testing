/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from '@safe-wordpress/element';
import { BaseControl, FormTokenField } from '@safe-wordpress/components';
import { useInstanceId } from '@safe-wordpress/compose';
import { sprintf, _x } from '@safe-wordpress/i18n';
import type { Post } from '@safe-wordpress/core-data';
import type { TokenItem } from '@wordpress/components/build-types/form-token-field/types';
import type { RefObject } from 'react';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { noop, isString, debounce } from 'lodash';
import type { EntityId, TermId } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import {
	useEntityKind,
	useEntityRecords,
	useEntityRecordSearch,
} from './hooks';
import type { SearchQuery, Term } from './types';

type Kind = 'postType' | 'taxonomy';
type ItemId< K extends Kind > = K extends 'postType' ? EntityId : TermId;
type Item< K extends Kind > = {
	readonly id: ItemId< K >;
	readonly name: string;
};

export type ItemSelectControlProps< K extends Kind > = {
	readonly className?: string;
	readonly kind: K;
	readonly name: string;
	readonly label?: string;
	readonly placeholder?: string;
	readonly value: ReadonlyArray< ItemId< K > >;
	readonly onChange: ( value: ReadonlyArray< ItemId< K > > ) => void;
	readonly disabled?: boolean;
	readonly isSingle?: boolean;
};

export const ItemSelectControl = < K extends Kind >( {
	className,
	kind,
	name,
	label,
	placeholder,
	value,
	disabled,
	isSingle,
	onChange,
}: ItemSelectControlProps< K > ): JSX.Element => {
	const instanceId = useInstanceId( ItemSelectControl );
	const [ autoExpand, setAutoExpand ] = useState( false ); // NOTE. Workaround.
	const actualKind = useEntityKind( kind, name );
	const hasSingleValue = isSingle && !! value.length;

	const {
		setQuery,
		items: foundItems,
		loadMoreItems,
	} = useSearchResult( kind, name, { exclude: value } );
	const ref = useRef< HTMLDivElement >( null );
	useEffectOnScrollEnd( ref, loadMoreItems );
	useEffectOnFocusAndBlur( ref, setAutoExpand );

	const hasItemId = (
		p: string | TokenItem | { itemId?: ItemId< K > } | undefined
	): p is { itemId: ItemId< K > } =>
		'object' === typeof p && 'itemId' in p && !! p.itemId;

	const onSelectionChange = (
		selection: ReadonlyArray< TokenItem | string >
	): void => {
		const str = selection.find( isString ) ?? '';
		const item = findByName( str, foundItems );
		setQuery( '' );
		onChange(
			[ ...selection, { itemId: item?.id } ]
				.filter( hasItemId )
				.map( ( s ) => s.itemId )
		);
	};

	const currentRecords = useEntityRecords( kind, name, value );
	const selectedItems = [
		...currentRecords.items.map( simplify( kind ) ),
		...( currentRecords.finished
			? currentRecords.missingItems.map( makeMissingItem( kind ) )
			: currentRecords.pendingItems.map( makeLoadingItem( kind ) ) ),
	];

	const Wrapper = !! label ? BaseControl : EmptyBaseControl;

	return (
		<div
			ref={ ref }
			className={ classnames(
				'nab-item-select-control',
				{
					'nab-item-select-control--has-single-value': isSingle,
				},
				className
			) }
		>
			<Wrapper id={ `${ instanceId }` } label={ label }>
				<FormTokenField
					value={ selectedItems.map( itemToFormValue ) }
					disabled={ disabled || ! actualKind }
					suggestions={ foundItems.map( ( p ) => p.name ) }
					onInputChange={ setQuery }
					onChange={ onSelectionChange }
					maxLength={ isSingle ? 1 : undefined }
					{ ...{
						label: !! label ? label : '',
						__experimentalShowHowTo: ! isSingle,
						__experimentalExpandOnFocus:
							autoExpand && ! hasSingleValue,
						placeholder: actualKind
							? placeholder ??
							  _x( 'Search', 'command', 'nelio-ab-testing' )
							: _x( 'Loading…', 'text', 'nelio-ab-testing' ),
					} }
				/>
			</Wrapper>
		</div>
	);
};

const EmptyBaseControl = ( { children }: { children: JSX.Element } ) =>
	children;

// =====
// HOOKS
// =====

const useSearchResult = < K extends Kind >(
	kind: K,
	name: string,
	searchQuery: SearchQuery
): {
	setQuery: ( v: string ) => void;
	items: ReadonlyArray< Item< K > >;
	loadMoreItems?: () => void;
} => {
	const [ serverQuery, doSetServerQuery ] = useState( '' );
	const [ liveQuery, setLiveQuery ] = useState( '' );

	const setServerQuery = useCallback(
		debounce( doSetServerQuery, 1000 ),
		[]
	);

	const [ items, setItems ] = useState< ReadonlyArray< Item< K > > >( [] );
	const [ page, setPage ] = useState( 1 );
	const searchResult = useEntityRecordSearch( kind, name, {
		...searchQuery,
		search: serverQuery,
		page,
		nelio_popups_search_by_title: true,
	} );

	const stringifiedQuery = searchQuery.exclude?.join( ',' ) ?? '';
	useEffect( () => {
		if ( ! searchResult.finished ) {
			return;
		} //end if

		const cleanItems = searchResult.items.map( simplify( kind ) );
		setItems( 1 === page ? cleanItems : [ ...items, ...cleanItems ] );
	}, [ stringifiedQuery, searchResult.finished, serverQuery, page ] );

	return {
		items: filterByQuery(
			kind,
			{ ...searchQuery, search: liveQuery },
			items
		),
		loadMoreItems:
			searchResult.finished && searchResult.more
				? () => setPage( page + 1 )
				: undefined,
		setQuery: ( query: string ) => {
			setLiveQuery( query );
			setServerQuery( query );
		},
	};
};

const useEffectOnScrollEnd = (
	ref: RefObject< HTMLDivElement >,
	callback = noop
) =>
	useEffect( () => {
		const el = ref.current;
		const onScroll = debounce(
			( ev: Event ) =>
				ev.target &&
				isBottomScroll( ev.target as HTMLElement ) &&
				callback(),
			200
		);
		const opts = { capture: true };
		el?.addEventListener( 'scroll', onScroll, opts );
		return () => el?.removeEventListener( 'scroll', onScroll, opts );
	}, [ callback, ref ] );

const useEffectOnFocusAndBlur = (
	ref: RefObject< HTMLDivElement >,
	callback: ( focus: boolean ) => void = noop
) =>
	useEffect( () => {
		const el = ref.current;
		const onFocus = () => callback( true );
		const onBlur = () => callback( false );
		const opts = { capture: true };
		el?.addEventListener( 'focus', onFocus, opts );
		el?.addEventListener( 'blur', onBlur, opts );
		return () => {
			el?.removeEventListener( 'focus', onFocus, opts );
			el?.removeEventListener( 'blur', onBlur, opts );
		};
	}, [ callback, ref ] );

// =======
// HELPERS
// =======

const makeMissingItem =
	< K extends Kind >( _: K ) =>
	( itemId: ItemId< K > ): Item< K > => ( {
		id: itemId,
		name: sprintf(
			/* translators: item id */
			_x( 'Unknown (ID: %d)', 'text', 'nelio-ab-testing' ),
			itemId
		),
	} );

const makeLoadingItem =
	< K extends Kind >( _: K ) =>
	( itemId: ItemId< K > ): Item< K > => ( {
		id: itemId,
		name: sprintf(
			/* translators: item id */
			_x( 'Loading… (ID: %d)', 'text', 'nelio-ab-testing' ),
			itemId
		),
	} );

const filterByQuery = < K extends Kind >(
	_: K,
	searchQuery: SearchQuery,
	items: ReadonlyArray< Item< K > >
): ReadonlyArray< Item< K > > => {
	if ( searchQuery.search ) {
		const { search } = searchQuery;
		items = items.filter( ( item ) =>
			item.name
				.replace( / \(ID: [0-9]+\)$/, '' )
				.toLowerCase()
				.includes( search.toLowerCase() )
		);
	} //end if

	if ( searchQuery.exclude ) {
		const { exclude } = searchQuery;
		items = items.filter( ( { id } ) => ! exclude.includes( id ) );
	} //end if

	return items;
};

const findByName = < K extends Kind >(
	name: string,
	items: ReadonlyArray< Item< K > >
): Item< K > | undefined =>
	items.find( ( item ) => item.name.toLowerCase() === name.toLowerCase() );

const itemToFormValue = ( item: Item< Kind > ): TokenItem =>
	( {
		itemId: item.id,
		value: item.name,
		title: item.name,
	} ) as TokenItem;

const getName = ( item: Post | Term ): string => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
	const hasName = ( i: any ): i is { name: string } => !! i.name;
	return hasName( item ) ? item.name : item.title.raw;
};

const simplify =
	< K extends Kind >( _: K ) =>
	( item: K extends 'postType' ? Post : Term ): Item< K > => ( {
		// @ts-expect-error Valid ID
		id: item.id,
		name: sprintf(
			'%1$s (ID: %2$d)',
			getName( item ).replace( /,/g, '' ),
			item.id
		),
	} );

const isBottomScroll = ( el: HTMLElement ): boolean =>
	el.scrollHeight - el.scrollTop === el.clientHeight;
