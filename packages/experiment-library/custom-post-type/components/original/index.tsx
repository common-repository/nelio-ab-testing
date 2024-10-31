/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { CheckboxControl, SelectControl } from '@safe-wordpress/components';
import { useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';
import {
	select as doSelect,
	useDispatch,
	useSelect,
} from '@safe-wordpress/data';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { castArray, filter, map } from 'lodash';
import { PostSearcher, Tooltip } from '@nab/components';
import { store as NAB_DATA, usePluginSetting } from '@nab/data';
import { store as NAB_EXPERIMENTS } from '@nab/experiments';
import {
	createAlternative,
	isEmpty,
	isMultiArray,
	isSingleton,
} from '@nab/utils';

import type { PostSearcherProps } from '@nab/components';
import type {
	Alternative,
	ExperimentEditProps,
	ExperimentTypeName,
	EntityKind,
	Maybe,
} from '@nab/types';

// NOTE. Dependency loop with @nab package.
import type { store as editorStore } from '@nab/editor';
const NAB_EDITOR = 'nab/editor' as unknown as typeof editorStore;

/**
 * Internal dependencies
 */
import './style.scss';
import type { ControlAttributes } from '../../types';

type Attributes< T extends string > = {
	[ K in keyof ControlAttributes ]: K extends 'postType'
		? T
		: ControlAttributes[ K ];
};

export type OriginalProps< T extends string > = ExperimentEditProps<
	Attributes< T >
> & {
	readonly disableExistingContentSelect?: boolean;
	readonly disableRunAsInlineTestSelect?: boolean;
	readonly validPostFilter?: PostSearcherProps[ 'filter' ];
};

export const Original = < T extends string >( {
	attributes,
	setAttributes,
	disableExistingContentSelect,
	disableRunAsInlineTestSelect,
	validPostFilter,
	experimentType,
}: OriginalProps< T > ): JSX.Element => {
	const isSubscribed = !! useSubscription();
	const isPaused = useIsPaused();
	const toggleExistingContent = useExistingContentToggler( setAttributes );
	const { postTypes, showSinglePostType, isLoadingPostTypes } =
		usePostTypes( experimentType );

	const isCookieTestingEnabled = usePluginSetting( 'isCookieTestingEnabled' );

	const defaultPostType = postTypes[ 0 ]?.name;
	const postType = attributes.postType || defaultPostType;
	const selectablePostTypes = postTypes.map( ( type ) => ( {
		value: type.name,
		label: type.labels.singular_name,
	} ) );

	return (
		<div className="nab-original-cpt-alternative">
			<div className="nab-original-cpt-alternative__selector">
				{ showSinglePostType && isSingleton( postTypes ) && (
					<input
						type="text"
						value={ postTypes[ 0 ].labels.singular_name }
						disabled
					/>
				) }
				{ isMultiArray( postTypes ) && (
					<SelectControl
						value={ postType }
						options={ selectablePostTypes }
						disabled={ !! attributes.postId }
						onChange={ ( value ) =>
							setAttributes( {
								postId: undefined,
								postType: value as T,
							} )
						}
					/>
				) }
				<PostSearcher
					disabled={ isEmpty( postTypes ) }
					type={ postType }
					value={ attributes.postId }
					perPage={ 10 }
					onChange={ ( value ) =>
						setAttributes( {
							postId: value,
							postType: postType as T,
						} )
					}
					filter={ validPostFilter }
					placeholder={ getPlaceholder(
						postTypes,
						isLoadingPostTypes
					) }
				/>
			</div>
			{ ! disableRunAsInlineTestSelect && ! isCookieTestingEnabled && (
				<div
					className={ classnames( {
						'nab-original-cpt-alternative__run-as-inline': true,
						'nab-original-cpt-alternative__run-as-inline--is-disabled':
							!! attributes.testAgainstExistingContent,
					} ) }
				>
					<CheckboxControl
						label={ <RunAsInlineLabel /> }
						disabled={ !! attributes.testAgainstExistingContent }
						checked={ !! attributes.runAsInlineTest }
						onChange={ ( value ) =>
							setAttributes( {
								runAsInlineTest: value,
							} )
						}
					/>
				</div>
			) }
			{ ! disableExistingContentSelect && (
				<div
					className={ classnames( {
						'nab-original-cpt-alternative__existing-content': true,
						'nab-original-cpt-alternative__existing-content--is-disabled':
							isPaused || !! attributes.runAsInlineTest,
					} ) }
				>
					<CheckboxControl
						label={ getExistingContentLabel(
							postType,
							isSubscribed
						) }
						disabled={ isPaused || !! attributes.runAsInlineTest }
						checked={ !! attributes.testAgainstExistingContent }
						onChange={ toggleExistingContent }
					/>
				</div>
			) }
		</div>
	);
};

const RunAsInlineLabel = (): JSX.Element => (
	<span>
		{ _x( 'Test title and content only', 'command', 'nelio-ab-testing' ) }{ ' ' }
		<Tooltip
			text={ _x(
				'If you enable this option, Nelio A/B Testing will load alternative content inline (no JavaScript redirection required). This will result in faster loading times and better user experience. Support for custom page builders is currently limited, so please make sure this option works as expected by previewing your variants after enabling this option.',
				'text',
				'nelio-ab-testing'
			) }
			placement="bottom"
		>
			<span className="nab-original-post-alternative__beta-help">
				Beta
			</span>
		</Tooltip>
	</span>
);

// =====
// HOOKS
// =====

const useSubscription = () =>
	useSelect(
		( select ) =>
			select( NAB_DATA ).getPluginSetting( 'subscription' ) || false
	);

const useIsPaused = () =>
	useSelect( ( select ) =>
		`${ select( NAB_EDITOR ).getExperimentAttribute( 'status' ) }`.includes(
			'paused'
		)
	);

const usePostTypes = ( experimentType: ExperimentTypeName ) =>
	useSelect( ( select ) => {
		const { hasExperimentSupport, getExperimentSupport } =
			select( NAB_EXPERIMENTS );

		const { getKindEntities, hasFinishedResolution } = select( NAB_DATA );
		let postTypes = getKindEntities() || [];
		postTypes = postTypes.filter( ( pt ) => 'entity' === pt.kind );

		if ( hasExperimentSupport( experimentType, 'postTypes' ) ) {
			const acceptedPostTypes = castArray(
				getExperimentSupport( experimentType, 'postTypes' )
			);
			return {
				postTypes: filter( postTypes, ( { name } ) =>
					acceptedPostTypes.includes( name )
				),
				showSinglePostType: 1 !== acceptedPostTypes.length,
				isLoadingPostTypes:
					! hasFinishedResolution( 'getKindEntities' ),
			};
		} //end if

		if ( hasExperimentSupport( experimentType, 'postTypeExceptions' ) ) {
			const excludedPostTypes = castArray(
				getExperimentSupport( experimentType, 'postTypeExceptions' )
			);
			return {
				postTypes: filter(
					postTypes,
					( { name } ) => ! excludedPostTypes.includes( name )
				),
				showSinglePostType: true,
				isLoadingPostTypes:
					! hasFinishedResolution( 'getKindEntities' ),
			};
		} //end if

		return {
			postTypes: [],
			showSinglePostType: true,
			isLoadingPostTypes: ! hasFinishedResolution( 'getKindEntities' ),
		};
	} );

const useExistingContentToggler = (
	setAttributes: (
		props: Partial<
			Pick< ControlAttributes, 'testAgainstExistingContent' >
		>
	) => void
) => {
	const [ prevAlts, setPrevAlts ] = useState( [ createAlternative() ] );
	const { replaceAlternatives } = useDispatch( NAB_EDITOR );
	return ( checked: boolean ) => {
		const alts = filter(
			doSelect( NAB_EDITOR ).getAlternatives(),
			( { id }: Alternative ) => 'control' !== id
		);
		void replaceAlternatives( map( alts, 'id' ), prevAlts );
		setPrevAlts( alts );
		setAttributes( {
			testAgainstExistingContent: checked ? true : undefined,
		} );
	};
};

// =======
// HELPERS
// =======

function getExistingContentLabel(
	type: Maybe< string >,
	isSubscribed: boolean
): string {
	switch ( type ) {
		case 'page':
			return isSubscribed
				? _x(
						'Test against already existing pages',
						'command',
						'nelio-ab-testing'
				  )
				: _x(
						'Test against an already existing page',
						'command',
						'nelio-ab-testing'
				  );
		case 'post':
			return isSubscribed
				? _x(
						'Test against already existing posts',
						'command',
						'nelio-ab-testing'
				  )
				: _x(
						'Test against an already existing post',
						'command',
						'nelio-ab-testing'
				  );
		default:
			return _x(
				'Test against already existing content',
				'command',
				'nelio-ab-testing'
			);
	} //end switch
} //end getExistingContentLabel()

function getPlaceholder(
	postTypes: ReadonlyArray< EntityKind >,
	isLoading: boolean
): Maybe< string > {
	if ( isLoading ) {
		return _x(
			'Loading compatible post types…',
			'text',
			'nelio-ab-testing'
		);
	} //end if

	if ( isEmpty( postTypes ) ) {
		return _x(
			'There are no compatible post types to select.',
			'text',
			'nelio-ab-testing'
		);
	} //end if

	if ( postTypes?.length > 1 ) {
		return _x(
			'First select the post type and then the actual content…',
			'user',
			'nelio-ab-testing'
		);
	} //end if

	return undefined;
} //end getPlaceholder()
