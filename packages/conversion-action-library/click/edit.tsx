/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	BaseControl,
	Button,
	TextControl,
	SelectControl,
} from '@safe-wordpress/components';
import { useInstanceId } from '@safe-wordpress/compose';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
	CssSelectorFinder,
	ConversionActionScope,
	ErrorText,
} from '@nab/components';
import { store as NAB_DATA, usePageAttribute } from '@nab/data';
import type {
	Alternative,
	CAEditProps,
	EntityId,
	EntityKindName,
} from '@nab/types';

// NOTE. Dependency loop with @nab package.
import type { store as editorStore } from '@nab/editor';
const NAB_EDITOR = 'nab/editor' as unknown as typeof editorStore;

/**
 * Internal dependencies
 */
import './edit.scss';
import type { Attributes } from './types';

export const Edit = ( {
	attributes: { mode, value },
	scope,
	errors,
	experimentId,
	setAttributes,
	setScope,
}: CAEditProps< Attributes > ): JSX.Element => {
	const instanceId = useInstanceId( Edit );
	const alternatives = useAlternatives();
	const [ isCssFinderOpen, openCssFinder ] = useCssFinder( instanceId );
	const cssFinderUrl = useCssFinderUrl();
	const { saveExperiment } = useDispatch( NAB_EDITOR );

	const textControlId = `nab-click-action__value-${ instanceId }`;

	return (
		<>
			<SelectControl
				label={ _x( 'Matching Mode', 'text', 'nelio-ab-testing' ) }
				options={ OPTIONS }
				value={ mode }
				onChange={ ( newMode ) => setAttributes( { mode: newMode } ) }
			/>

			<BaseControl
				id={ textControlId }
				className={ classnames( {
					'nab-conversion-action__field--has-errors': errors.value,
				} ) }
				label={ LABELS[ mode ] }
				help={ <ErrorText value={ errors.value } /> }
			>
				<div className="nab-click-conversion-action">
					<TextControl
						id={ textControlId }
						className="nab-click-conversion-action__value"
						value={ value }
						onChange={ ( newValue ) =>
							setAttributes( { value: newValue } )
						}
					/>

					<Button
						variant="secondary"
						className="nab-click-conversion-action__button"
						onClick={ () =>
							void saveExperiment().then( () =>
								openCssFinder( true )
							)
						}
					>
						{ _x( 'Explore', 'command', 'nelio-ab-testing' ) }
					</Button>

					{ isCssFinderOpen && (
						<CssSelectorFinder
							initialUrl={ cssFinderUrl }
							experimentId={ experimentId }
							alternatives={ alternatives }
							initialValue={ value }
							initialMode={ mode }
							onAccept={ ( newMode, newValue ) =>
								setAttributes( {
									mode: newMode,
									value: newValue,
								} )
							}
							onClose={ () => openCssFinder( false ) }
						/>
					) }
				</div>
			</BaseControl>

			<ConversionActionScope
				scope={ scope }
				setScope={ setScope }
				error={ errors._scope }
			/>
		</>
	);
};

// =====
// HOOKS
// =====

const useAlternatives = () =>
	useSelect( ( select ) => select( NAB_EDITOR )?.getAlternatives() || [] );

const useCssFinder = ( instanceId: string | number ) => {
	instanceId = `${ instanceId }`;
	const [ finderId, setFinderId ] = usePageAttribute(
		'css-selector/openedCssSelectorFinderId',
		''
	);

	const isOpen = finderId === instanceId;
	const open = ( v: boolean ) => setFinderId( v ? instanceId : '' );

	return [ isOpen, open ] as const;
};

const useCssFinderUrl = () =>
	useSelect( ( select ): string => {
		const { getPluginSetting } = select( NAB_DATA );
		const homeUrl = getPluginSetting( 'homeUrl' );

		if ( ! select( NAB_EDITOR ) ) {
			return homeUrl;
		} //end if

		const { getAlternative } = select( NAB_EDITOR );
		const control = getAlternative( 'control' );
		if ( ! hasPostAttrs( control ) ) {
			return homeUrl;
		} //end if

		const { postType, postId } = control.attributes;
		if ( ! postType || ! postId ) {
			return homeUrl;
		} //end if

		const { getEntityRecord } = select( NAB_DATA );
		const post = getEntityRecord( postType, postId );
		return post?.link || homeUrl;
	} );

// =======
// HELPERS
// =======

const LABELS: Record< Attributes[ 'mode' ], string > = {
	id: _x( 'Element ID', 'text', 'nelio-ab-testing' ),
	class: _x( 'CSS Class', 'text', 'nelio-ab-testing' ),
	css: _x( 'CSS Selector', 'text', 'nelio-ab-testing' ),
};

const OPTIONS = Object.keys( LABELS )
	.map( ( v ) => v as Attributes[ 'mode' ] )
	.map( ( value ) => ( {
		value,
		label: LABELS[ value ],
	} ) );

const hasPostAttrs = (
	a?: Alternative
): a is Alternative< { postType: EntityKindName; postId: EntityId } > =>
	!! a?.attributes?.postType && !! a?.attributes?.postId;
