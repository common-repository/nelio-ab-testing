/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { SelectControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { sortBy } from 'lodash';
import type { ConfettiType, HeatmapMode } from '@nab/types';

/**
 * Internal dependencies
 */
import { FilterOptionsList } from '../filter-options-list';
import { useActiveFilter, useIsLocked } from '../hooks';

export type FilterSectionProps = {
	readonly kind: HeatmapMode;
};

export const FilterSection = ( {
	kind,
}: FilterSectionProps ): JSX.Element | null =>
	'confetti' === kind ? <ConfettiFilterSection /> : null;

// =======
// HELPERS
// =======

const ConfettiFilterSection = (): JSX.Element => {
	const isLocked = useIsLocked();
	const [ activeFilter, setActiveFilter ] = useActiveFilter();
	const options = useConfettiOptions();

	return (
		<>
			<SelectControl
				disabled={ isLocked }
				label={ _x( 'Filter', 'text', 'nelio-ab-testing' ) }
				value={ activeFilter } // e.g: value = [ 'a', 'c' ]
				onChange={ ( value ) => setActiveFilter( value ) }
				options={ options }
			/>
			<FilterOptionsList />
		</>
	);
};

// =====
// HOOKS
// =====

const useConfettiOptions = () => CONFETTI_OPTIONS;

// ====
// DATA
// ====

const CONFETTI_OPTIONS: ReadonlyArray< {
	readonly value: ConfettiType;
	readonly label: string;
} > = sortBy(
	[
		{
			value: 'country',
			label: _x( 'Country', 'text', 'nelio-ab-testing' ),
		},
		{
			value: 'device',
			label: _x( 'Device Type', 'text', 'nelio-ab-testing' ),
		},
		{
			value: 'os',
			label: _x( 'Operating System', 'text', 'nelio-ab-testing' ),
		},
		{
			value: 'browser',
			label: _x( 'Browser', 'text', 'nelio-ab-testing' ),
		},
		{
			value: 'dayOfWeek',
			label: _x( 'Day of Week', 'text', 'nelio-ab-testing' ),
		},
		{
			value: 'hourOfDay',
			label: _x( 'Time of Day', 'text', 'nelio-ab-testing' ),
		},
		{
			value: 'timeToClick',
			label: _x( 'Time to Click', 'text', 'nelio-ab-testing' ),
		},
		{
			value: 'windowWidth',
			label: _x( 'Window Width', 'text', 'nelio-ab-testing' ),
		},
	],
	'label'
);
