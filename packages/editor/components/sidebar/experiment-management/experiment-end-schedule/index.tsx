/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	Button,
	Dropdown,
	PanelRow,
	SelectControl,
	TextControl,
} from '@safe-wordpress/components';
import { useInstanceId } from '@safe-wordpress/compose';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { useState } from '@safe-wordpress/element';
import { _n, _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { find } from 'lodash';
import { numberFormat } from '@nab/i18n';
import type { Experiment } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { useExperimentAttribute, useIsSubscribedTo } from '../../../hooks';
import { store as NAB_EDITOR } from '../../../../store';

export const ExperimentEndSchedule = (): JSX.Element => {
	const instanceId = useInstanceId( ExperimentEndSchedule );

	const canBeScheduled = useIsSubscribedTo( 'professional' );
	const [ endMode ] = useExperimentAttribute( 'endMode' );
	const [ endValue ] = useExperimentAttribute( 'endValue' );
	const experimentType = useExperimentType();
	const options = END_MODE_OPTIONS[ endMode ];

	const [ isCustom, setCustom ] = useCustomValue();

	const { setExperimentData } = useDispatch( NAB_EDITOR );
	const onUpdateEndSchedule = (
		mode: Experiment[ 'endMode' ],
		value: number
	) => setExperimentData( { endMode: mode, endValue: value } );

	if ( ! canBeScheduled ) {
		return (
			<PanelRow className="nab-experiment-end-schedule">
				<span>{ _x( 'End', 'text', 'nelio-ab-testing' ) }</span>
				<span>{ _x( 'Manual', 'text', 'nelio-ab-testing' ) }</span>
			</PanelRow>
		);
	} //end if

	return (
		<PanelRow className="nab-experiment-end-schedule">
			<span>{ _x( 'End', 'text', 'nelio-ab-testing' ) }</span>

			<Dropdown
				placement="bottom-end"
				contentClassName="nab-experiment-end-schedule__dropdown"
				renderToggle={ ( { onToggle, isOpen } ) => (
					<>
						<label
							className="nab-experiment-end-schedule__value screen-reader-text"
							htmlFor={ `nab-experiment-end-schedule__toggle-${ instanceId }` }
						>
							{ _x(
								'Click to change',
								'command',
								'nelio-ab-testing'
							) }
						</label>
						<Button
							variant="link"
							id={ `nab-experiment-end-schedule__toggle-${ instanceId }` }
							type="button"
							className="nab-experiment-end-schedule__toggle"
							onClick={ onToggle }
							aria-expanded={ isOpen }
							aria-live="polite"
						>
							{ getLabel( endMode, endValue ) }
						</Button>
					</>
				) }
				renderContent={ () => (
					<>
						<SelectControl
							label={ _x(
								'End Mode',
								'text',
								'nelio-ab-testing'
							) }
							value={ endMode }
							onChange={ ( mode ) => {
								setCustom( false );
								void onUpdateEndSchedule(
									mode,
									getDefaultValue( mode )
								);
							} }
							options={ END_MODES.filter(
								( { value } ) =>
									'confidence' !== value ||
									'nab/heatmap' !== experimentType
							) }
						/>

						{ !! options && (
							<div style={ { marginTop: '1em' } }>
								<SelectControl
									label={ _x(
										'Value',
										'text',
										'nelio-ab-testing'
									) }
									onChange={ ( value: string ) => {
										setCustom( 'custom' === value );
										void onUpdateEndSchedule(
											endMode,
											Number.parseInt( value ) || 0
										);
									} }
									value={
										isCustom ? 'custom' : `${ endValue }`
									}
									options={ options }
								/>
							</div>
						) }

						{ !! options && isCustom && (
							<div style={ { marginTop: '0.5em' } }>
								<TextControl
									type="number"
									placeholder={ getCustomPlaceholder(
										endMode
									) }
									value={ endValue || '' }
									onChange={ ( value ) =>
										onUpdateEndSchedule(
											endMode,
											Number.parseInt( value ) || 0
										)
									}
								/>
							</div>
						) }
					</>
				) }
			/>
		</PanelRow>
	);
};

// =====
// HOOKS
// =====

const useExperimentType = () =>
	useSelect( ( select ) => select( NAB_EDITOR ).getExperimentType() );

const useCustomValue = () => {
	const [ endMode ] = useExperimentAttribute( 'endMode' );
	const [ endValue ] = useExperimentAttribute( 'endValue' );
	const options = END_MODE_OPTIONS[ endMode ];
	const shouldBeCustom =
		!! find( options, { value: 'custom' } ) &&
		! find( options, { value: `${ endValue }` } );
	const [ isCustom, setCustom ] = useState( shouldBeCustom );
	return [ isCustom, setCustom ] as const;
};

// ====
// DATA
// ====

const END_MODES: ReadonlyArray< {
	readonly value: Experiment[ 'endMode' ];
	readonly label: string;
} > = [
	{
		value: 'manual',
		label: _x( 'Manual', 'text', 'nelio-ab-testing' ),
	},
	{
		value: 'duration',
		label: _x( 'Duration', 'text', 'nelio-ab-testing' ),
	},
	{
		value: 'page-views',
		label: _x( 'Page Views', 'text', 'nelio-ab-testing' ),
	},
	{
		value: 'confidence',
		label: _x( 'Confidence', 'text', 'nelio-ab-testing' ),
	},
];

const END_MODE_OPTIONS: Record<
	Experiment[ 'endMode' ],
	ReadonlyArray< {
		readonly value: string;
		readonly label: string;
		readonly placeholder?: string;
	} >
> = {
	manual: [],
	confidence: [ 95, 96, 97, 98, 99 ].map( ( percentage ) => ( {
		value: `${ percentage }`,
		label: sprintf(
			/* translators: a percentage number, such as “95” */
			_x( '%1$s%%', 'text', 'nelio-ab-testing' ),
			numberFormat( percentage )
		),
	} ) ),
	duration: [
		...[ 5, 7, 15, 30, 60, 90 ].map( ( duration ) => ( {
			value: `${ duration }`,
			label: sprintf(
				/* translators: number of days */
				_n( '%d day', '%d days', duration, 'nelio-ab-testing' ),
				duration
			),
		} ) ),
		{
			value: 'custom',
			label: _x( 'Custom', 'text', 'nelio-ab-testing' ),
			placeholder: _x( 'Days', 'text', 'nelio-ab-testing' ),
		},
	],
	'page-views': [
		...[ 2500, 5000, 10000, 20000, 50000, 100000 ].map( ( views ) => ( {
			value: `${ views }`,
			label: numberFormat( views ),
		} ) ),
		{
			value: 'custom',
			label: _x( 'Custom', 'text', 'nelio-ab-testing' ),
			placeholder: _x( 'Days', 'text', 'nelio-ab-testing' ),
		},
	],
};

// =======
// HELPERS
// =======

function getLabel(
	endMode: Experiment[ 'endMode' ],
	endValue: number
): string {
	switch ( endMode ) {
		case 'duration':
			return sprintf(
				/* translators: number of days */
				_n(
					'After %d day',
					'After %d days',
					endValue,
					'nelio-ab-testing'
				),
				endValue
			);
		case 'page-views':
			return sprintf(
				/* translators: a number */
				_n(
					'After %s page view',
					'After %s page views',
					endValue,
					'nelio-ab-testing'
				),
				numberFormat( endValue )
			); // eslint-disable-line
		case 'confidence':
			return sprintf(
				/* translators: a percentage number, such as “95” */
				_x( 'At %1$s%% confidence', 'text', 'nelio-ab-testing' ),
				numberFormat( endValue )
			);
		case 'manual':
			return _x( 'Manual', 'text', 'nelio-ab-testing' );
	} //end switch
} //end getLabel()

function getDefaultValue( mode: Experiment[ 'endMode' ] ): number {
	switch ( mode ) {
		case 'duration':
			return 15;
		case 'page-views':
			return 5000;
		case 'confidence':
			return 97;
		case 'manual':
			return 0;
	} //end switch
} //end getDefaultValue()

const getCustomPlaceholder = ( mode: Experiment[ 'endMode' ] ) =>
	find( END_MODE_OPTIONS[ mode ], { value: 'custom' } )?.placeholder ?? '';
