/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import type { MediaId, Url } from '@nab/types';

/**
 * Internal dependencies
 */
import { store as NAB_DATA } from '../../../store';

export async function getMediaUrl( id: MediaId ): Promise< void > {
	if ( ! id ) {
		return;
	} //end if

	try {
		type Media = { readonly source_url: Url };
		const media = await apiFetch< Media >( {
			path: `/wp/v2/media/${ id }`,
		} );
		await dispatch( NAB_DATA ).receiveMediaUrl( id, media.source_url );
	} catch ( error ) {
		const message = error instanceof Error ? error.message : 'unknown';
		// eslint-disable-next-line
		console.warn( `Error while retrieving media. Error: ${ message }` );
	} //end try
} //end getMediaUrl()
