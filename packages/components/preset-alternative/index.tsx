/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { SelectControl } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { find, isArray, map, noop } from 'lodash';
import { store as NAB_EXPERIMENTS } from '@nab/experiments';
import { isEmpty } from '@nab/utils';
import type { ExperimentTypeName, Maybe } from '@nab/types';

export type PresetAlternativeProps = {
	readonly experimentType: ExperimentTypeName;
	readonly value: Maybe< string >;
	readonly onChange: ( val: Maybe< Value > ) => void;
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	readonly collection?: 'default' | 'nab-check-availability' | string;
	readonly disabled?: boolean;
	readonly labels?: {
		readonly selection?: string;
		readonly selectAction?: string;
		readonly loading?: string;
		readonly empty?: string;
		readonly unknownOption?: string;
	};
};

type Value = {
	readonly value: string;
	readonly label: string;
	readonly disabled?: boolean;
};

export const PresetAlternative = (
	props: PresetAlternativeProps
): JSX.Element => {
	const {
		experimentType,
		collection = 'default',
		value,
		disabled,
		onChange,
		labels: {
			selection = '',
			selectAction: selectActionText,
			loading: loadingPlaceholder = _x(
				'Loading…',
				'text',
				'nelio-ab-testing'
			),
			empty: emptyPlaceholder = _x(
				'No options available',
				'text',
				'nelio-ab-testing'
			),
			unknownOption: unknownOptionWarning = _x(
				'Option not found',
				'text',
				'nelio-ab-testing'
			),
		} = {},
	} = props;

	const presetAlternatives = usePresetAlternatives< Value >(
		experimentType,
		collection
	);
	if ( ! presetAlternatives ) {
		return (
			<SelectControl
				className="nab-preset-alternative--loading"
				onChange={ noop }
				options={ [
					{
						disabled: true,
						value: '_nab_disabled',
						label: loadingPlaceholder,
					},
				] }
				disabled
			/>
		);
	} //end if

	if ( isEmpty( presetAlternatives ) ) {
		return (
			<SelectControl
				className="nab-preset-alternative--error"
				onChange={ noop }
				options={ [
					{
						disabled: true,
						value: '_nab_disabled',
						label: emptyPlaceholder,
					},
				] }
				disabled
			/>
		);
	} //end if

	if ( value && ! map( presetAlternatives, 'value' ).includes( value ) ) {
		return (
			<SelectControl
				className="nab-preset-alternative--error"
				onChange={ noop }
				options={ [
					{
						disabled: true,
						value: '_nab_disabled',
						label: !! selection
							? sprintf(
									/* translators: 1 -> unknown option message as in “Option not found”, 2 -> option name as, for instance, “Twenty Nineteen” */
									_x(
										'%1$s (%2$s)',
										'text (invalid option)',
										'nelio-ab-testing'
									),
									unknownOptionWarning,
									selection
							  )
							: unknownOptionWarning,
					},
				] }
				disabled
			/>
		);
	} //end if

	let options = presetAlternatives;
	if ( selectActionText ) {
		options = [
			{
				disabled: true,
				value: '_nab_no_option_selected' as const,
				label: selectActionText,
			},
			...options,
		];
	} //end if

	return (
		<SelectControl
			className="nab-preset-alternative"
			value={ value || '_nab_no_option_selected' }
			onChange={ ( id ) =>
				onChange( find( presetAlternatives, { value: id } ) )
			}
			options={ options }
			disabled={ disabled }
		/>
	);
};

// =====
// HOOKS
// =====

function usePresetAlternatives< T >(
	experimentType: ExperimentTypeName,
	collection: string
) {
	return useSelect( ( select ) => {
		const { getExperimentSupport } = select( NAB_EXPERIMENTS );
		const getPresetAlternatives = getExperimentSupport(
			experimentType,
			'presetAlternatives'
		);
		const result = getPresetAlternatives?.( select, collection );
		return isArray( result ) ? ( result as ReadonlyArray< T > ) : undefined;
	} );
} //end usePresetAlternatives()
