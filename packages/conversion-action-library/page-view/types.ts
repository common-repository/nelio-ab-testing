/**
 * External dependencies
 */
import type { EntityId, EntityKindName } from '@nab/types';

export type Attributes = {
	readonly mode: 'id' | 'url';
	readonly postId: EntityId;
	readonly postType: EntityKindName;
	readonly url: string;
};
