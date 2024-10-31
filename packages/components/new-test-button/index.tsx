/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import apiFetch from '@safe-wordpress/api-fetch';
import { Button, Popover } from '@safe-wordpress/components';
import { useState } from '@safe-wordpress/element';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';
import { store as NOTICES } from '@safe-wordpress/notices';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { v4 as uuid } from 'uuid';
import { filter, groupBy, isFunction, map, mapValues, values } from 'lodash';
import { store as NAB_DATA } from '@nab/data';
import { store as NAB_EXPERIMENTS } from '@nab/experiments';
import type {
	Experiment,
	ExperimentCategory,
	ExperimentTypeName,
} from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { isExperimentTypeDisabled } from './helpers';

const CATEGORY_LABELS: Record< ExperimentCategory, string > = {
	page: _x( 'Page', 'text', 'nelio-ab-testing' ),
	global: _x( 'Global', 'text', 'nelio-ab-testing' ),
	woocommerce: _x( 'WooCommerce', 'text', 'nelio-ab-testing' ),
	other: _x( 'Other', 'text', 'nelio-ab-testing' ),
};

export const NewTestButton = (): JSX.Element => {
	const [ isVisible, setVisible ] = useState( false );
	const experimentTypes = useExperimentTypes();

	return (
		<span className="nab-experiment-selector__container">
			<Button
				className="page-title-action nab-add-test-title-action"
				onClick={ () => setVisible( ! isVisible ) }
				style={ { height: 'auto' } }
			>
				{ _x( 'Add Test', 'command', 'nelio-ab-testing' ) }
			</Button>
			{ isVisible && (
				<Popover
					className="nab-new-experiment-dialog"
					placement="bottom-end"
					onFocusOutside={ () => setVisible( false ) }
				>
					{ values(
						mapValues(
							experimentTypes,
							(
								types: ReadonlyArray< ExperimentTypeName >,
								category: ExperimentCategory
							) =>
								!! types.length && (
									<div
										className="nab-experiment-type-list"
										key={ category }
									>
										<h3 className="nab-experiment-type-list__title">
											{ CATEGORY_LABELS[ category ] }
										</h3>
										<ul className="nab-experiment-type-list__types">
											{ types.map( ( type ) => (
												<ExperimentType
													key={ type }
													type={ type }
													onCreationFail={ () =>
														setVisible( false )
													}
												/>
											) ) }
										</ul>
									</div>
								)
						)
					) }
				</Popover>
			) }
		</span>
	);
};

// ============
// HELPER VIEWS
// ============

type ExperimentTypeProps = {
	readonly type: ExperimentTypeName;
	readonly onCreationFail: () => void;
};

const ExperimentType = ( {
	type,
	onCreationFail,
}: ExperimentTypeProps ): JSX.Element | null => {
	const [ isCreatingOfType, createExperiment ] =
		useExperimentCreator( onCreationFail );
	const experimentType = useExperimentType( type );
	const postTypes = usePostTypes();

	if ( ! experimentType ) {
		return null;
	} //end if

	const { title, shortTitle, description, icon: Icon } = experimentType;

	const isDisabled = isExperimentTypeDisabled( experimentType, postTypes );

	return (
		<li
			className={ classnames(
				'nab-experiment-type-list__experiment-type',
				{
					'nab-experiment-type-list__experiment-type--is-creating':
						isCreatingOfType === type,
					'nab-experiment-type-list__experiment-type--is-disabled':
						isDisabled,
				}
			) }
		>
			<Button
				title={ description }
				disabled={ !! isCreatingOfType || isDisabled }
				onClick={ () => createExperiment( type ) }
			>
				<Icon className="nab-experiment-type-list__experiment-icon" />
				<span>{ shortTitle || title }</span>
			</Button>
		</li>
	);
};

// =====
// HOOKS
// =====

const useExperimentCreator = ( onCreationFail: () => void ) => {
	const [ creatingType, setCreatingType ] = useState( '' );
	const showError = useShowError();
	const experimentTypes = useSelect( ( select ) =>
		select( NAB_EXPERIMENTS ).getExperimentTypes()
	);

	const create = ( typeName: ExperimentTypeName ) => {
		setCreatingType( typeName );

		const experimentType = experimentTypes[ typeName ];
		const addTestedPostScopeRule =
			'tested-post-with-consistency' === experimentType?.supports?.scope;

		void apiFetch< Experiment >( {
			path: '/nab/v1/experiment',
			method: 'post',
			data: {
				type: typeName,
				addTestedPostScopeRule,
			},
		} )
			.then( ( experiment ) => {
				window.location.href = experiment.links.edit; // phpcs:ignore
			} )
			.catch( ( err: { message: string } ) => {
				setCreatingType( '' );
				onCreationFail();
				showError( err.message );
			} );
	};

	return [ creatingType, create ] as const;
};

const useShowError = () => {
	const { createErrorNotice, removeNotice } = useDispatch( NOTICES );
	const defaultMessage = _x(
		'Unknown error while creating test.',
		'text',
		'nelio-ab-testing'
	);

	return ( message: string ) => {
		const id = uuid();
		const msg = message || defaultMessage;
		void createErrorNotice( msg, {
			id,
			onDismiss: () => removeNotice( id ),
		} );
	};
};

const useExperimentTypes = (): Record<
	ExperimentCategory,
	ReadonlyArray< ExperimentTypeName >
> => {
	const types = useSelect( ( select ) =>
		mapValues(
			groupBy(
				values( select( NAB_EXPERIMENTS ).getExperimentTypes() ),
				'category'
			),
			( ts ) => map( ts, 'name' )
		)
	);
	return {
		page: [],
		global: [],
		woocommerce: [],
		other: [],
		...types,
	};
};

const useExperimentType = ( typeName: ExperimentTypeName ) =>
	useSelect( ( select ) => {
		const types = select( NAB_EXPERIMENTS ).getExperimentTypes();
		const type = types[ typeName ];
		if ( ! type ) {
			return;
		} //end if

		return {
			...type,
			_usesPresetAlternatives: isFunction(
				type.supports.presetAlternatives
			),
			_hasPresetAlternatives: !! type.supports.presetAlternatives?.(
				select,
				'nab-check-availability'
			),
			_isDisabled:
				isFunction( type.checks.isTestTypeEnabled ) &&
				! type.checks.isTestTypeEnabled( select ),
		};
	} );

const usePostTypes = () =>
	useSelect( ( select ) =>
		filter( select( NAB_DATA ).getKindEntities(), { kind: 'entity' } )
	);
