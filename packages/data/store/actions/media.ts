/**
 * External dependencies
 */
import type { MediaId, Url } from '@nab/types';

export type MediaAction = ReceiveMediaUrl;

export function receiveMediaUrl( id: MediaId, url: Url ): ReceiveMediaUrl {
	return {
		type: 'RECEIVE_MEDIA_URL',
		id,
		url,
	};
} //end receiveMediaUrl()

// ============
// HELPER TYPES
// ============

type ReceiveMediaUrl = {
	readonly type: 'RECEIVE_MEDIA_URL';
	readonly id: MediaId;
	readonly url: Url;
};
