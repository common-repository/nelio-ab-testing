/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	CheckboxControl,
	Dashicon,
	ExternalLink,
	TextControl,
} from '@safe-wordpress/components';
import { createInterpolateElement } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';
import { useDispatch, useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { ErrorText } from '@nab/components';
import { getLocalUrlError } from '@nab/utils';
import { store as NAB_DATA } from '@nab/data';
import { store as NAB_EDITOR } from '@nab/editor';
import type { EntityId, EntityKindName, Url } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { PostSearcher } from './post-searcher';

export const TrackedPage = (): JSX.Element => {
	const [ attributes, setAttributes ] = useAttributes();
	const { mode, postId, postType, url, urlError } = attributes;

	return (
		<div className="nab-edit-experiment__alternative-section">
			<h2>
				{ createInterpolateElement(
					sprintf(
						/* translators: dashicon */
						_x( '%s WordPress Page', 'text', 'nelio-ab-testing' ),
						'<icon></icon>'
					),
					{
						icon: (
							<Dashicon
								className="nab-alternative-section__title-icon"
								icon="welcome-view-site"
							/>
						),
					}
				) }
			</h2>

			<div className="nab-tracked-element">
				{ 'url' !== mode ? (
					<>
						<div className="nab-tracked-element__p">
							{ _x(
								'Select the page you want to generate a heatmap for:',
								'user',
								'nelio-ab-testing'
							) }
						</div>

						<PostSearcher
							className="nab-tracked-element__post"
							postId={ postId ?? 0 }
							postType={ postType }
							setAttributes={ setAttributes }
						/>
					</>
				) : (
					<>
						<div className="nab-tracked-element__p">
							{ _x(
								'Type in the URL of the page you want to generate a heatmap for:',
								'user',
								'nelio-ab-testing'
							) }
						</div>

						<div className="nab-tracked-element__url">
							<TextControl
								className="nab-tracked-element__url-value"
								value={ url }
								onChange={ ( value ) =>
									setAttributes( { url: value } )
								}
								placeholder={ _x(
									'URL…',
									'text',
									'nelio-ab-testing'
								) }
							/>

							<div className="nab-tracked-element__url-preview">
								{ urlError ? (
									<span>
										{ _x(
											'View',
											'command',
											'nelio-ab-testing'
										) }
									</span>
								) : (
									<ExternalLink
										className="components-button is-secondary"
										href={ url }
									>
										{ _x(
											'View',
											'command',
											'nelio-ab-testing'
										) }
									</ExternalLink>
								) }
							</div>
						</div>

						{ !! urlError && (
							<div className="nab-tracked-element__p">
								<ErrorText value={ urlError } />
							</div>
						) }
					</>
				) }

				<div className="nab-tracked-element__p">
					<CheckboxControl
						className="nab-tracked-element__mode"
						label={ _x(
							'Track heatmap of a page specified using its URL.',
							'command',
							'nelio-ab-testing'
						) }
						checked={ 'url' === mode }
						onChange={ ( checked ) =>
							setAttributes( { mode: checked ? 'url' : 'post' } )
						}
					/>
				</div>
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useAttributes = () => {
	const attributes = useSelect( ( select ) => {
		const { getPluginSetting } = select( NAB_DATA );
		const { getHeatmapAttribute } = select( NAB_EDITOR );

		const url = getHeatmapAttribute( 'trackedUrl' ) || '';
		const homeUrl = getPluginSetting( 'homeUrl' );

		return {
			mode: getHeatmapAttribute( 'trackingMode' ) || 'post',
			postId: getHeatmapAttribute( 'trackedPostId' ) || undefined,
			postType: getHeatmapAttribute( 'trackedPostType' ) || 'page',
			url,
			urlError: getLocalUrlError( url, homeUrl ),
		};
	} );

	type Attributes = {
		readonly mode: 'post' | 'url';
		readonly postId: EntityId;
		readonly postType: EntityKindName;
		readonly url: string;
	};

	const { setHeatmapData } = useDispatch( NAB_EDITOR );
	const setAttributes = ( attrs: Partial< Attributes > ): void =>
		void setHeatmapData( {
			trackingMode: attrs.mode ?? attributes.mode,
			trackedPostId: attrs.postId ?? attributes.postId,
			trackedPostType: attrs.postType ?? attributes.postType,
			trackedUrl: ( attrs.url ?? attributes.url ) as Url,
		} );

	return [ attributes, setAttributes ] as const;
};
