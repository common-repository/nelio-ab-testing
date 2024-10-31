/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { ExperimentEditProps } from '@nab/types';

/**
 * Internal dependencies
 */
import { ImageAndExcerpt } from '../image-and-excerpt';
import { useTestedPost } from '../../hooks';
import { Original as PostOriginal } from '../../../post/components/original';

import type { ControlAttributes } from '../../types';

export type OriginalProps = ExperimentEditProps< ControlAttributes > & {
	readonly excerptPlaceholder?: string;
};

export const Original = ( props: OriginalProps ): JSX.Element => {
	const imageAndExcerpt = useImageAndExcerpt( props.excerptPlaceholder );
	return (
		<>
			<PostOriginal
				disableExistingContentSelect
				disableRunAsInlineTestSelect
				{ ...props }
			/>
			<ImageAndExcerpt { ...imageAndExcerpt } />
		</>
	);
};

// =====
// HOOKS
// =====

const useImageAndExcerpt = ( placeholder?: string ) => {
	const post = useTestedPost();

	return {
		imageId: post?.imageId ?? 0,
		imageUrl: post?.imageSrc ?? '',
		excerpt: post?.excerpt ?? '',
		excerptPlaceholder:
			placeholder || _x( '(no excerpt)', 'text', 'nelio-ab-testing' ),
	};
};
