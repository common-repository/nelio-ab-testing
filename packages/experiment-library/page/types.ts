/**
 * Internal attributes
 */
import type { ControlAttributes as PostControlAttributes } from '../post/types';

export type ControlAttributes = Omit< PostControlAttributes, 'postType' > & {
	readonly postType: 'page';
};

export type { AlternativeAttributes } from '../post/types';
