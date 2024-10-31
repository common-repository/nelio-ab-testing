/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	BaseControl,
	ExternalLink,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@safe-wordpress/components';
import { useInstanceId } from '@safe-wordpress/compose';
import { useSelect } from '@safe-wordpress/data';
import { createInterpolateElement, useEffect } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { sortBy, trim } from 'lodash';
import { ErrorText, PostSearcher } from '@nab/components';
import { store as NAB_DATA } from '@nab/data';
import type { CAEditProps, EntityId, EntityKindName } from '@nab/types';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export const Edit = ( props: CAEditProps< Attributes > ): JSX.Element => (
	<>
		{ props.attributes.mode === 'id' ? (
			<EditPostId { ...props } />
		) : (
			<EditUrl { ...props } />
		) }
		<ToggleControl
			label={ _x( 'Select page by URL', 'command', 'nelio-ab-testing' ) }
			checked={ props.attributes.mode === 'url' }
			onChange={ ( enabled ) => {
				props.setAttributes( { mode: enabled ? 'url' : 'id' } );
				props.setScope(
					enabled
						? { type: 'urls', regexes: [ props.attributes.url ] }
						: { type: 'post-ids', ids: [ props.attributes.postId ] }
				);
			} }
		/>
	</>
);

// ============
// HELPER VIEWS
// ============

const EditPostId = ( {
	attributes: { postId, postType },
	setAttributes,
	setScope,
	errors,
}: CAEditProps< Attributes > ): JSX.Element | null => {
	const instanceId = useInstanceId( Edit );
	const { value: postTypes, isLoading } = usePostTypes();
	const currentPostType = postType || postTypes[ 0 ]?.value;

	useEffect( () => {
		if (
			isLoading ||
			postTypes.map( ( t ) => t.value ).includes( postType )
		) {
			return;
		} //end if
		setAttributesAndScope( { postType: 'page', postId: 0 } );
	}, [ postType, isLoading ] );

	if ( isLoading ) {
		return null;
	} //end if

	const setAttributesAndScope = ( attrs: Partial< Attributes > ) => {
		setAttributes( attrs );
		setScope( {
			type: 'post-ids',
			ids: attrs.postType && attrs.postId ? [ attrs.postId ] : [],
		} );
	};

	return (
		<>
			{ postTypes.length > 1 && (
				<SelectControl
					label={ _x( 'Content Type', 'text', 'nelio-ab-testing' ) }
					options={ postTypes }
					value={ currentPostType }
					onChange={ ( newPostType ) =>
						setAttributesAndScope( {
							postType: newPostType,
							postId: undefined,
						} )
					}
				/>
			) }

			<BaseControl
				id={ `nab-conversion-action__page-view-${ instanceId }` }
				className={ classnames( {
					'nab-conversion-action__field--has-errors':
						!! errors.postId,
				} ) }
				label={ <Label postType={ postType } postId={ postId } /> }
				help={ <ErrorText value={ errors.postId } /> }
			>
				<PostSearcher
					id={ `nab-conversion-action__page-view-${ instanceId }` }
					type={ currentPostType }
					perPage={ 10 }
					value={ postId }
					onChange={ ( newPostId ) =>
						setAttributesAndScope( {
							postId: newPostId,
							postType: currentPostType,
						} )
					}
				/>
			</BaseControl>
		</>
	);
};

const EditUrl = ( {
	attributes: { url },
	setAttributes,
	setScope,
	errors,
}: CAEditProps< Attributes > ): JSX.Element => (
	<>
		<TextControl
			label={ _x( 'URL', 'text', 'nelio-ab-testing' ) }
			value={ url }
			onChange={ ( value ) => {
				setAttributes( { url: trim( value ) } );
				setScope( {
					type: 'urls',
					regexes: trim( value ) ? [ trim( value ) ] : [],
				} );
			} }
			help={ <ErrorText value={ errors.url } /> }
		/>
	</>
);

const Label = ( {
	postType,
	postId,
}: {
	postType: EntityKindName;
	postId: EntityId;
} ) => {
	const permalink = usePostPermalink( postType, postId );

	if ( ! permalink ) {
		return (
			<span>{ _x( 'Actual Content', 'text', 'nelio-ab-testing' ) }</span>
		);
	} //end if

	return (
		<span>
			{ createInterpolateElement(
				_x(
					'Actual Content (<a>View</a>)',
					'text',
					'nelio-ab-testing'
				),
				{
					a: permalink ? (
						// @ts-expect-error children prop is set by createInterpolateComponent.
						<ExternalLink href={ permalink } />
					) : (
						<span />
					),
				}
			) }
		</span>
	);
};

// =====
// HOOKS
// =====

const EXCLUDED_POST_TYPES = [ 'attachment', 'product_variation' ];

const usePostTypes = () =>
	useSelect( ( select ) => {
		const { getKindEntities, hasFinishedResolution, hasResolutionFailed } =
			select( NAB_DATA );

		const isLoading =
			! hasFinishedResolution( 'getKindEntities' ) &&
			! hasResolutionFailed( 'getKindEntities' );

		const postTypes = ( getKindEntities() || [] )
			.filter(
				( pt ) =>
					'entity' === pt.kind &&
					! EXCLUDED_POST_TYPES.includes( pt.name )
			)
			.map( ( pt ) => ( {
				value: pt.name,
				label: pt.labels.singular_name,
			} ) );

		return {
			value: sortBy( postTypes, 'label' ),
			isLoading,
		};
	} );

// TODO. Use proper types?
const usePostPermalink = ( postType: EntityKindName, postId: EntityId ) =>
	useSelect(
		( select ) =>
			select( NAB_DATA ).getEntityRecord( postType, postId )?.link
	);
