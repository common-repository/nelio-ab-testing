/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export function validate(
	attributes: Attributes
): Partial< Record< keyof Attributes, string > > {
	const { platform, videoId } = attributes;

	if ( 'youtube' === platform && ! isYouTubeVideoId( videoId ) ) {
		return {
			videoId: _x(
				'Please write a valid YouTube video ID. For instance, the video ID dQw4w9WgXcQ refers to https://youtu.be/dQw4w9WgXcQ',
				'user',
				'nelio-ab-testing'
			),
		};
	} //end if

	if ( ! videoId ) {
		return {
			videoId: _x(
				'Please write a video ID',
				'user',
				'nelio-ab-testing'
			),
		};
	} //end if

	return {};
} //end validate()

// =======
// HELPERS
// =======

const isYouTubeVideoId = ( id: string ) => /[-\w]{11}/.test( id );
