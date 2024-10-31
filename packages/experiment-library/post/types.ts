/**
 * External dependencies
 */
import type { PostId } from '@nab/types';

export type ControlAttributes = {
	readonly postType: 'post';
	readonly postId: PostId;
	readonly runAsInlineTest?: boolean;
	readonly testAgainstExistingContent?: boolean;
};

export type AlternativeAttributes = {
	readonly name: string;
	readonly postId: PostId;
	readonly isExistingContent?: true;
};
