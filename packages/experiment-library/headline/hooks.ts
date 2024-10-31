/*
 * WordPress dependencies
 */
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NAB_DATA } from '@nab/data';
import type {
	EntityId,
	EntityInstance,
	EntityKindName,
	Maybe,
} from '@nab/types';

// NOTE. Dependency loop with @nab package.
import type { store as editorStore } from '@nab/editor';
const NAB_EDITOR = 'nab/editor' as unknown as typeof editorStore;

type MaybePost =
	| { readonly postId: undefined }
	| { readonly postId: EntityId; readonly postType: EntityKindName };

export const useTestedPost = (): Maybe< EntityInstance > =>
	useSelect( ( select ) => {
		const { getAlternative } = select( NAB_EDITOR );
		const original = getAlternative< MaybePost >( 'control' );
		if ( ! original?.attributes.postId ) {
			return;
		} //end if

		const { getEntityRecord } = select( NAB_DATA );
		const post = getEntityRecord(
			original.attributes.postType,
			original.attributes.postId
		);
		return post;
	} );
