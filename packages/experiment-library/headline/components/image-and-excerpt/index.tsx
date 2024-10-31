/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { MediaUpload } from '@safe-wordpress/media-utils';
import { Button, TextareaControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { noop } from 'lodash';
import { FancyIcon, Tooltip } from '@nab/components';
import type { MediaId } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';

export type ImageAndExcerptProps = {
	readonly imageId: MediaId;
	readonly imageUrl: string;
	readonly defaultImageId?: MediaId;
	readonly defaultImageUrl?: string;
	readonly disabled?: boolean;
	readonly excerpt: string;
	readonly excerptPlaceholder: string;
	readonly onImageChange?: ( id: MediaId, url: string ) => void;
	readonly onExcerptChange?: ( excerpt: string ) => void;
};

export const ImageAndExcerpt = ( {
	imageId,
	imageUrl,
	defaultImageId,
	defaultImageUrl,
	disabled,
	excerpt,
	excerptPlaceholder,
	onImageChange,
	onExcerptChange,
}: ImageAndExcerptProps ): JSX.Element => (
	<div className="nab-alternative-list__alternative-image-and-excerpt">
		{ ( ! onImageChange || disabled ) && (
			<Image src={ imageUrl || defaultImageUrl } />
		) }

		{ ! disabled && !! onImageChange && !! imageId && (
			<Tooltip
				text={
					defaultImageId
						? _x(
								'Click to use the original featured image',
								'user',
								'nelio-ab-testing'
						  )
						: _x(
								'Click to remove featured image',
								'user',
								'nelio-ab-testing'
						  )
				}
			>
				<Button
					className="nab-alternative-list__alternative-image-button nab-alternative-list__alternative-image-button--is-remove"
					onClick={ () => onImageChange( 0, '' ) }
					disabled={ disabled }
				>
					<Image src={ imageUrl || defaultImageUrl } />
				</Button>
			</Tooltip>
		) }

		{ ! disabled && !! onImageChange && ! imageId && (
			<MediaUpload
				title={ _x(
					'Alternative Featured Image',
					'text',
					'nelio-ab-testing'
				) }
				allowedTypes={ [ 'image' ] }
				value={ imageId || defaultImageId }
				onSelect={ ( { id, sizes, url } ) =>
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
					onImageChange( id as MediaId, sizes?.thumbnail?.url || url )
				}
				render={ ( {
					// eslint-disable-next-line @typescript-eslint/unbound-method
					open,
				} ) => (
					<Tooltip
						text={
							defaultImageId
								? _x(
										'Click to set a different featured image',
										'user',
										'nelio-ab-testing'
								  )
								: _x(
										'Click to set a featured image',
										'user',
										'nelio-ab-testing'
								  )
						}
					>
						<Button
							className="nab-alternative-list__alternative-image-button nab-alternative-list__alternative-image-button--is-set"
							onClick={ open }
						>
							<Image src={ imageUrl || defaultImageUrl } />
						</Button>
					</Tooltip>
				) }
			/>
		) }

		<TextareaControl
			className="nab-alternative-list__alternative-excerpt"
			readOnly={ ! onExcerptChange }
			value={ excerpt }
			placeholder={ excerptPlaceholder }
			onChange={ onExcerptChange || noop }
			disabled={ disabled }
		/>
	</div>
);

const Image = ( { src }: { src?: string } ) =>
	!! src ? (
		<img
			className="nab-alternative-list__alternative-image"
			alt={ _x( 'Featured Image', 'text', 'nelio-ab-testing' ) }
			src={ src }
		/>
	) : (
		<FancyIcon className="nab-alternative-list__alternative-image" />
	);
