/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { ExternalLink } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { createInterpolateElement } from '@safe-wordpress/element';
import { sprintf, _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { find } from 'lodash';
import { store as NAB_DATA } from '@nab/data';
import type { CAViewProps, EntityId, EntityKindName } from '@nab/types';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export const View = ( props: CAViewProps< Attributes > ): JSX.Element =>
	props.attributes.mode === 'id' ? (
		<PostIdView { ...props } />
	) : (
		<UrlView { ...props } />
	);

// ============
// HELPER VIEWS
// ============

const PostIdView = ( {
	attributes: { postType, postId },
}: CAViewProps< Attributes > ): JSX.Element => {
	const postTypeLabel = usePostTypeLabel( postType );
	const postTitle = usePostTitle( postType, postId );
	const permalink = usePostPermalink( postType, postId );

	if ( 'page' === postType || 'post' === postType ) {
		const knownLabel =
			'page' === postType
				? /* translators: the title of a page */
				  _x(
						'A visitor views the %s page.',
						'text',
						'nelio-ab-testing'
				  )
				: /* translators: the title of a post */
				  _x(
						'A visitor views the %s post.',
						'text',
						'nelio-ab-testing'
				  );
		const unknownLabel =
			'page' === postType
				? _x(
						'A visitor views a page in your website.',
						'text',
						'nelio-ab-testing'
				  )
				: _x(
						'A visitor views a post in your website.',
						'text',
						'nelio-ab-testing'
				  );

		if ( ! postTitle ) {
			return <>{ unknownLabel }</>;
		} //end if

		return (
			<>
				{ createInterpolateElement(
					sprintf( knownLabel, sprintf( '<a>%s</a>', postTitle ) ),
					{
						a: permalink ? (
							// @ts-expect-error children prop is set by createInterpolateComponent.
							<ExternalLink href={ permalink } />
						) : (
							<strong />
						),
					}
				) }
			</>
		);
	} //end if

	if ( ! postTitle ) {
		return (
			<>
				{ sprintf(
					/* translators: a custom post type */
					_x(
						'A visitor views some content in your website with the type %s.',
						'text',
						'nelio-ab-testing'
					),
					postTypeLabel
				) }
			</>
		);
	} //end if

	return (
		<>
			{ createInterpolateElement(
				sprintf(
					/* translators: 1 -> the title of a custom post type; 2 -> a post type name */
					_x(
						'A visitor views %1$s (%2$s).',
						'text',
						'nelio-ab-testing'
					),
					sprintf( '<a>%s</a>', postTitle ),
					postTypeLabel
				),
				{
					a: permalink ? (
						// @ts-expect-error children prop is set by createInterpolateComponent.
						<ExternalLink href={ permalink } />
					) : (
						<strong />
					),
				}
			) }
		</>
	);
};

const UrlView = ( {
	attributes: { url },
}: CAViewProps< Attributes > ): JSX.Element => {
	if ( ! url ) {
		return (
			<>
				{ _x(
					'A visitor views a page in your website.',
					'text',
					'nelio-ab-testing'
				) }
			</>
		);
	} //end if

	return (
		<>
			{ createInterpolateElement(
				sprintf(
					/* translators: a page URL */
					_x(
						'A visitor views a page with URL %s.',
						'text',
						'nelio-ab-testing'
					),
					sprintf( '<code>%s</code>', url )
				),
				{
					code: <code></code>,
				}
			) }
		</>
	);
};

// =====
// HOOKS
// =====

const usePostTypeLabel = ( postType?: EntityKindName ) => {
	const postTypes = useSelect(
		( select ) => select( NAB_DATA ).getKindEntities() || []
	);
	const obj = find( postTypes, { name: postType || '' } );
	return (
		obj?.labels?.singular_name ||
		_x( 'Unknown', 'text (post type)', 'nelio-ab-testing' )
	);
};

const usePostTitle = ( postType: EntityKindName, postId: EntityId ) =>
	useSelect(
		( select ) =>
			select( NAB_DATA ).getEntityRecord( postType, postId )?.title
	);

const usePostPermalink = ( postType: EntityKindName, postId: EntityId ) =>
	useSelect(
		( select ) =>
			isResultsPage() &&
			select( NAB_DATA ).getEntityRecord( postType, postId )?.link
	);

// =======
// HELPERS
// =======

const isResultsPage = () =>
	!! document.querySelector( '.nab-results-experiment-layout' );
