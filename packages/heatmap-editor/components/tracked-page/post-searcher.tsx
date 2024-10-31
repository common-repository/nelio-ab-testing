/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { SelectControl } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { PostSearcher as Searcher } from '@nab/components';
import { store as NAB_DATA } from '@nab/data';
import { isEmpty } from '@nab/utils';
import type { EntityId, EntityKindName } from '@nab/types';

export type PostSearcherProps = {
	readonly className: string;
	readonly postId: EntityId;
	readonly postType: EntityKindName;
	readonly setAttributes: ( attrs: Partial< SAP > ) => void;
};

type SAP = {
	readonly postId: EntityId;
	readonly postType: EntityKindName;
};

export const PostSearcher = ( {
	className,
	postId,
	postType: currentPostType,
	setAttributes,
}: PostSearcherProps ): JSX.Element => {
	const postTypes = usePostTypes();

	const selectablePostTypes = postTypes.map( ( type ) => ( {
		value: type.name,
		label: type.labels.singular_name,
	} ) );
	const postType = currentPostType || 'page';

	return (
		<div className={ className }>
			<SelectControl
				className={ `${ className }-type-selector` }
				value={ postType }
				options={ selectablePostTypes }
				onChange={ ( value ) =>
					setAttributes( { postId: 0, postType: value } )
				}
			/>

			<Searcher
				className={ `${ className }-selector` }
				type={ postType }
				value={ postId }
				perPage={ 10 }
				onChange={ ( value ) =>
					setAttributes( { postId: value, postType } )
				}
			/>
		</div>
	);
};

// =====
// HOOKS
// =====

const usePostTypes = () =>
	useSelect( ( select ) => {
		const { getKindEntities } = select( NAB_DATA );
		const defaultPostTypes = [
			{
				kind: 'entity' as const,
				name: 'page',
				labels: {
					singular_name: _x( 'Page', 'text', 'nelio-ab-testing' ),
				},
			},
			{
				kind: 'entity' as const,
				name: 'post',
				labels: {
					singular_name: _x( 'Post', 'text', 'nelio-ab-testing' ),
				},
			},
		];

		let postTypes = getKindEntities();
		postTypes = isEmpty( postTypes ) ? defaultPostTypes : postTypes;
		postTypes = postTypes.filter( ( pt ) => 'entity' === pt.kind );
		postTypes = postTypes.filter( ( pt ) => 'attachment' !== pt.name );

		return postTypes;
	} );
