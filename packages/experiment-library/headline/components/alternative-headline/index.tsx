/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { DefaultAlternative } from '@nab/components';
import type { ExperimentEditProps } from '@nab/types';

/**
 * Internal dependencies
 */
import { ImageAndExcerpt } from '../image-and-excerpt';
import { useTestedPost } from '../../hooks';

import type { AlternativeAttributes } from '../../types';

export type AlternativeProps = ExperimentEditProps< AlternativeAttributes > & {
	readonly excerptPlaceholder?: string;
};

export const Alternative = ( {
	disabled,
	setAttributes,
	...props
}: AlternativeProps ): JSX.Element => {
	const {
		excerpt,
		excerptPlaceholder,
		imageId,
		imageUrl,
		originalImageId,
		originalImageUrl,
		originalTitle,
	} = useImageAndExcerpt( props );

	return (
		<>
			<DefaultAlternative
				{ ...{ ...props, setAttributes } }
				placeholder={
					originalTitle ||
					_x(
						'Write an alternative title…',
						'user',
						'nelio-ab-testing'
					)
				}
				disabled={ disabled }
			/>
			<ImageAndExcerpt
				imageId={ imageId }
				imageUrl={ imageUrl }
				excerpt={ excerpt }
				excerptPlaceholder={ excerptPlaceholder }
				defaultImageId={ originalImageId }
				defaultImageUrl={ originalImageUrl }
				disabled={ disabled }
				onImageChange={ ( id, url ) =>
					setAttributes( { imageId: id, imageUrl: url } )
				}
				onExcerptChange={ ( value ) =>
					setAttributes( { excerpt: value } )
				}
			/>
		</>
	);
};

const useImageAndExcerpt = (
	props: Omit< AlternativeProps, 'disabled' | 'setAttributes' >
) => {
	const imageId = props.attributes?.imageId ?? 0;
	const imageUrl = props.attributes?.imageUrl ?? '';
	const excerpt = props.attributes?.excerpt ?? '';
	const excerptPlaceholder = props.excerptPlaceholder ?? '';

	const post = useTestedPost();
	const originalTitle = post?.title ?? '';
	const originalImageId = post?.imageId ?? 0;
	const originalImageUrl = post?.imageSrc ?? '';
	const originalExcerpt = post?.excerpt ?? '';

	return {
		imageId,
		imageUrl,
		excerpt,
		originalTitle,
		originalImageId,
		originalImageUrl,
		excerptPlaceholder:
			originalExcerpt ||
			excerptPlaceholder ||
			_x( '(no excerpt)', 'text', 'nelio-ab-testing' ),
	};
};
