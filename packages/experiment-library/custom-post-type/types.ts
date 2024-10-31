/**
 * External dependencies
 */
import type { EntityKindName, EntityId } from '@nab/types';

/**
 * Internal attributes
 */
import type {
	AlternativeAttributes as PostAlternativeAttributes,
	ControlAttributes as PostControlAttributes,
} from '../post/types';

export type ControlAttributes = Omit<
	PostControlAttributes,
	'postType' | 'postId'
> & {
	readonly postId: EntityId;
	readonly postType: EntityKindName;
};

export type AlternativeAttributes = Omit<
	PostAlternativeAttributes,
	'postId'
> & {
	readonly postId: EntityId;
};
