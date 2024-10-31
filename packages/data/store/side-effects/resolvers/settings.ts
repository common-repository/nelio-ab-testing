/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch } from '@safe-wordpress/data';
import { addQueryArgs } from '@safe-wordpress/url';

/**
 * External dependencies
 */
import type {
	EntityKindName,
	MenuId,
	Menu,
	PaginatedResults,
	Theme,
	Template,
	TemplateContextGroup,
	TemplateContextGroupName,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { store as NAB_DATA } from '../../../store';

export async function getActivePlugins(): Promise< void > {
	try {
		const plugins = await apiFetch< ReadonlyArray< string > >( {
			path: '/nab/v1/plugins',
		} );
		await dispatch( NAB_DATA ).receivePlugins( plugins );
	} catch ( error ) {
		const message = error instanceof Error ? error.message : 'unknown';
		// eslint-disable-next-line
		console.warn(
			`Unable to retrieve active plugins. Error: ${ message }`
		);
	} //end try
} //end getActivePlugins()

export async function hasMenus(): Promise< void > {
	try {
		const response = await apiFetch< PaginatedResults< Menu > >( {
			path: '/nab/v1/menu/search?query',
		} );
		await dispatch( NAB_DATA ).receiveMenus( response.results );
	} catch ( error ) {
		const message = error instanceof Error ? error.message : 'unknown';
		// eslint-disable-next-line
		console.warn(
			`Unable to check if site has menus. Error: ${ message }`
		);
	} //end try
} //end hasMenus()

export async function getMenu( id: MenuId ): Promise< void > {
	try {
		const record = await apiFetch< Menu >( {
			path: `/nab/v1/menu/${ id }`,
		} );
		await dispatch( NAB_DATA ).receiveMenus( record );
	} catch ( error ) {
		const message = error instanceof Error ? error.message : 'unknown';
		// eslint-disable-next-line
		console.warn( `Unable to retrieve menu ${ id }. Error: ${ message }` );
	} //end try
} //end getMenu()

export async function getTemplateContexts(): Promise< void > {
	try {
		const response = await apiFetch<
			PaginatedResults<
				Record< TemplateContextGroupName, TemplateContextGroup >
			>
		>( {
			path: addQueryArgs( `/nab/v1/template-contexts` ),
		} );
		await dispatch( NAB_DATA ).receiveTemplateContexts( response.results );
	} catch ( error ) {
		const message = error instanceof Error ? error.message : 'unknown';
		// eslint-disable-next-line
		console.warn(
			`Unable to retrieve template contexts. Error: ${ message }`
		);
	} //end try
} //end getTemplateContexts()

export async function getTemplates(): Promise< void > {
	try {
		const response = await apiFetch<
			PaginatedResults<
				Record< EntityKindName, ReadonlyArray< Template > >
			>
		>( {
			path: addQueryArgs( `/nab/v1/templates` ),
		} );
		await dispatch( NAB_DATA ).receiveTemplates( response.results );
	} catch ( error ) {
		const message = error instanceof Error ? error.message : 'unknown';
		// eslint-disable-next-line
		console.warn( `Unable to retrieve templates. Error: ${ message }` );
	} //end try
} //end getTemplates()

export async function getThemes(): Promise< void > {
	try {
		const response = await apiFetch<
			PaginatedResults< ReadonlyArray< Theme > >
		>( {
			path: `/nab/v1/themes`,
		} );
		await dispatch( NAB_DATA ).receiveThemes( response.results );
	} catch ( error ) {
		const message = error instanceof Error ? error.message : 'unknown';
		// eslint-disable-next-line
		console.warn( `Unable to retrieve themes. Error: ${ message }` );
	} //end try
} //end getThemes()
