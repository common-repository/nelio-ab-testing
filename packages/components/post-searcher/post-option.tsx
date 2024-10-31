/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import type { OptionProps } from 'react-select';
import { store as NAB_DATA } from '@nab/data';
import { formatI18nDate } from '@nab/date';
import type { EntityId, EntityKindName } from '@nab/types';

export type PostData = {
	readonly type: EntityKindName;
	readonly value: EntityId;
	readonly label: string;
};

export const PostOption = ( {
	data: { type, value },
	isFocused,
	isSelected,
	innerRef,
	innerProps,
}: OptionProps< PostData, false > ): JSX.Element => {
	const post = usePost( type, value );
	const { id, authorName, date, thumbnailSrc, title, typeLabel } = post || {};

	return (
		<div
			ref={ innerRef }
			className={ classnames( {
				'nab-post-option-in-post-searcher': true,
				'nab-post-option-in-post-searcher--is-focused': isFocused,
				'nab-post-option-in-post-searcher--is-selected': isSelected,
			} ) }
			{ ...innerProps }
		>
			<div className="nab-post-option-in-post-searcher__image">
				<div
					className="nab-post-option-in-post-searcher__actual-image"
					style={ {
						backgroundImage: `url(${ thumbnailSrc || '' })`,
					} }
				></div>
			</div>

			<div className="nab-post-option-in-post-searcher__title">
				{ title }
			</div>

			<div className="nab-post-option-in-post-searcher__details">
				{ !! authorName
					? sprintf(
							/* translators: 1 -> post type name, 2 -> post ID, 3 -> author name */
							_x(
								'%1$s %2$s by %3$s',
								'text',
								'nelio-ab-testing'
							),
							typeLabel,
							`#${ id }`,
							authorName
					  )
					: `${ typeLabel } #${ id }` }
				{ !! date ? ` • ${ formatI18nDate( date || '' ) }` : '' }
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const usePost = ( type: EntityKindName, id: EntityId ) =>
	useSelect( ( select ) => select( NAB_DATA ).getEntityRecord( type, id ) );
