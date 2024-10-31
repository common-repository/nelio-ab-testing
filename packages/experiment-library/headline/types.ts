/**
 * External dependencies
 */
import type { PostId, MediaId } from '@nab/types';

export type ControlAttributes = {
	readonly postType: 'post';
	readonly postId: PostId;
};

export type AlternativeAttributes = {
	readonly name: string;
	readonly excerpt: string;
	readonly imageId: MediaId;
	readonly imageUrl: string;
};
