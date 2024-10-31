/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * Internal dependencies
 */
import { Original as PostOriginal } from '../../post/components/original';
import type { OriginalProps as OP } from '../../post/components/original';

export type OriginalProps = Omit< OP< 'page' >, 'validPostfilter' >;

export const Original = ( props: OriginalProps ): JSX.Element => (
	<PostOriginal
		{ ...props }
		validPostFilter={ ( post ) =>
			'page-for-posts' !== post.extra.specialPostType
		}
	/>
);
