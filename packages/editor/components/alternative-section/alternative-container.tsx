/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { useEffect, useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { HelpIcon } from '@nab/components';
import { store as NAB_EXPERIMENTS } from '@nab/experiments';
import {
	createAlternative,
	duplicateAlternative,
	getLetter,
	omitUndefineds,
} from '@nab/utils';
import type {
	Alternative,
	AlternativeId,
	Dict,
	ExperimentEditProps,
	Maybe,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { useCanAddAlternatives, useExperimentAttribute } from '../hooks';
import { store as NAB_EDITOR } from '../../store';

export type AlternativeContainerProps = {
	readonly alternativeId: AlternativeId;
	readonly disabled?: boolean;
	readonly index: number;
};

export const AlternativeContainer = ( {
	alternativeId,
	disabled,
	index,
}: AlternativeContainerProps ): JSX.Element | null => {
	const control = useAlternative( 'control' );
	const alternative = useAlternative( alternativeId );
	const AlternativeView = useView( index );
	const canBeRemoved = useCanBeRemoved();
	const experimentType = useExperimentType();
	const help = useHelp( index );
	const isBeingSaved = useIsBeingSaved();
	const isExternalEdit = useIsExternalEdit();
	const isControl = ! index;
	const canAddAlternatives = useCanAddAlternatives();
	const duplicate = useDuplicator( alternative );
	const isPreviewDisabled = useIsPreviewDisabled( alternative, control );

	const {
		saveExperimentAndEditAlternative,
		saveExperimentAndPreviewAlternative,
		removeAlternatives,
		replaceAlternatives,
		setAlternative,
	} = useDispatch( NAB_EDITOR );

	if ( ! alternative ) {
		return null;
	} //end if

	return (
		<div
			className={ classnames( [
				'nab-alternative-list__alternative',
				{ 'nab-alternative-list__alternative--original': isControl },
			] ) }
		>
			<p
				className={ classnames( [
					'nab-alternative-list__alternative-letter',
					{
						'nab-alternative-list__alternative-letter--disabled':
							0 < index && disabled,
					},
				] ) }
			>
				{ getLetter( index ) }
			</p>

			<div className="nab-alternative-list__alternative-edit">
				<AlternativeView
					attributes={ alternative.attributes }
					disabled={ disabled }
					experimentType={ experimentType }
					setAttributes={ ( attributes ) =>
						setAlternative( alternative.id, {
							...alternative,
							attributes: omitUndefineds( {
								...alternative.attributes,
								...attributes,
							} ),
						} )
					}
				/>

				{ 0 !== index && (
					<ul className="nab-alternative-list__alternative-actions">
						{ isExternalEdit && (
							<li>
								<Button
									variant="link"
									disabled={ disabled || isBeingSaved }
									onClick={ () =>
										void saveExperimentAndEditAlternative(
											alternativeId
										)
									}
								>
									{ _x(
										'Edit',
										'command',
										'nelio-ab-testing'
									) }
								</Button>
							</li>
						) }
						<li>
							<Button
								variant="link"
								disabled={
									disabled ||
									isBeingSaved ||
									isPreviewDisabled
								}
								onClick={ () =>
									void saveExperimentAndPreviewAlternative(
										alternativeId
									)
								}
							>
								{ _x(
									'Preview',
									'command',
									'nelio-ab-testing'
								) }
							</Button>
						</li>
						{ isExternalEdit &&
							! alternative.base &&
							canAddAlternatives && (
								<li>
									<Button
										variant="link"
										disabled={ disabled || isBeingSaved }
										onClick={ duplicate }
									>
										{ _x(
											'Duplicate',
											'command',
											'nelio-ab-testing'
										) }
									</Button>
								</li>
							) }
						{ isExternalEdit && (
							<li>
								<Button
									variant="link"
									disabled={ disabled || isBeingSaved }
									onClick={ () =>
										replaceAlternatives(
											alternativeId,
											createAlternative()
										)
									}
								>
									{ _x(
										'Reset',
										'command',
										'nelio-ab-testing'
									) }
								</Button>
							</li>
						) }
						{ canBeRemoved && (
							<li>
								<Button
									variant="link"
									isDestructive
									disabled={ disabled || isBeingSaved }
									onClick={ () =>
										removeAlternatives( alternative.id )
									}
								>
									{ _x(
										'Delete',
										'command',
										'nelio-ab-testing'
									) }
								</Button>
							</li>
						) }
					</ul>
				) }
			</div>

			<div className="nab-alternative-list__alternative-help">
				{ !! help && <HelpIcon text={ help } /> }
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useExperimentType = () =>
	useSelect( ( select ) => select( NAB_EDITOR ).getExperimentType() );

const useDefaults = () => {
	const type = useExperimentType();
	return useSelect(
		( select ) =>
			select( NAB_EXPERIMENTS ).getExperimentType( type )?.defaults
	);
};

const useDuplicator = ( alternative: Maybe< Alternative > ) => {
	const alternatives = useSelect( ( select ) =>
		select( NAB_EDITOR ).getAlternatives()
	);
	const { replaceAlternatives } = useDispatch( NAB_EDITOR );
	return alternative
		? () =>
				void replaceAlternatives(
					alternatives.map( ( a ) => a.id ),
					[ ...alternatives, duplicateAlternative( alternative ) ]
				)
		: () => void null;
};

const useAlternative = ( alternativeId: AlternativeId ) => {
	const [ didApplyDefaults, markApplyDefaults ] = useState( false );
	const defaults = useDefaults();
	const { setAlternative } = useDispatch( NAB_EDITOR );
	const alternative = useSelect( ( select ) =>
		select( NAB_EDITOR ).getAlternative( alternativeId )
	);

	useEffect( () => {
		if ( didApplyDefaults ) {
			return;
		} //end if

		if ( ! defaults || ! alternative ) {
			return;
		} //end if

		const attrs =
			'control' === alternativeId
				? defaults.original
				: defaults.alternative;
		void setAlternative( alternative.id, {
			...alternative,
			attributes: {
				...attrs,
				...alternative.attributes,
			},
		} );
		markApplyDefaults( true );
	}, [ didApplyDefaults, !! defaults, !! alternative ] );

	return didApplyDefaults ? alternative : undefined;
};

const useCanBeRemoved = () => {
	const [ status ] = useExperimentAttribute( 'status' );
	return useSelect( ( select ) => {
		const { getAlternativeIds } = select( NAB_EDITOR );
		const isPaused = ( status || '' ).includes( 'paused' );
		return getAlternativeIds().length > 2 && ! isPaused;
	} );
};

const useIsBeingSaved = () =>
	useSelect( ( select ) => select( NAB_EDITOR ).isExperimentBeingSaved() );

type View = ( props: ExperimentEditProps< Dict > ) => JSX.Element;
const useView = ( index: number ): View =>
	useSelect( ( select ) => {
		const { getExperimentView } = select( NAB_EXPERIMENTS );
		const { getExperimentType } = select( NAB_EDITOR );
		const view = ! index
			? getExperimentView( getExperimentType(), 'original' )
			: getExperimentView( getExperimentType(), 'alternative' );
		return view ?? ( () => <></> );
	} );

const useHelp = ( index: number ) =>
	useSelect( ( select ) => {
		const { getExperimentType } = select( NAB_EDITOR );
		const { getHelpString } = select( NAB_EXPERIMENTS );

		if ( 0 === index ) {
			return getHelpString( getExperimentType(), 'original' );
		} //end if

		if ( 1 === index ) {
			return getHelpString( getExperimentType(), 'alternative' );
		} //end if

		return '';
	} );

const useIsExternalEdit = () => {
	const type = useExperimentType();
	const control = useSelect( ( select ) =>
		select( NAB_EDITOR ).getAlternative( 'control' )
	);
	return useSelect( ( select ) => {
		const { getExperimentSupport } = select( NAB_EXPERIMENTS );
		const alternativeEdition = getExperimentSupport(
			type,
			'alternativeEdition'
		);
		if ( 'external' !== alternativeEdition?.type ) {
			return false;
		} //end if
		if ( 'function' !== typeof alternativeEdition.enabled ) {
			return true;
		} //end if
		return !! control && alternativeEdition.enabled( control.attributes );
	} );
};

const useIsPreviewDisabled = (
	alternative: Maybe< Alternative >,
	control: Maybe< Alternative >
) =>
	useSelect( ( select ): boolean => {
		const { getExperimentType } = select( NAB_EXPERIMENTS );
		const type = getExperimentType(
			select( NAB_EDITOR ).getExperimentType()
		);
		if ( ! type || ! alternative || ! control ) {
			return false;
		} //end if
		return !! type.checks.isAlternativePreviewDisabled?.(
			alternative.attributes,
			control.attributes,
			select
		);
	} );
