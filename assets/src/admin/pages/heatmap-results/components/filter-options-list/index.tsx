/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { CheckboxControl } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { map, noop, sortBy, sum, uniq, values, without } from 'lodash';
import { compactInteger } from '@nab/i18n';
import { getCountryName } from '@nab/utils';
import type { ConfettiOption } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { FilterToggle } from './filter-toggle';
import { useIsLocked } from '../hooks';
import { store as NAB_HEATMAP } from '../../store';

export const FilterOptionsList = (): JSX.Element | null => {
	const isLocked = useIsLocked();
	const filterOptions = useFilterOptions();
	const disabledFilterOptions = useDisabledFilterOptions();
	const toggleDisabledFilterOption = useFilterOptionToggler();

	if ( ! filterOptions ) {
		return null;
	} //end if

	const totalClicks = sum( map( filterOptions, 'value' ) );

	return (
		<>
			<CheckboxControl
				className="nab-filter-option nab-filter-option--header"
				label={
					<span className="nab-filter-option-label__container">
						<span className="nab-filter-option-label__name">
							{ _x( 'Name', 'text', 'nelio-ab-testing' ) }
						</span>
						<span className="nab-filter-option-label__amount">
							{ _x( 'Amount', 'text', 'nelio-ab-testing' ) }
						</span>
					</span>
				}
				checked={ ! disabledFilterOptions.length }
				onChange={ ( isChecked ) =>
					toggleDisabledFilterOption( 'all', isChecked )
				}
				disabled={ isLocked }
			/>

			{ filterOptions.map( ( { key, label, value, color } ) => (
				<FilterToggle
					key={ key }
					color={ color }
					disabled={ isLocked }
					className={ classnames( 'nab-filter-option', {
						'nab-filter-option--deactivated':
							disabledFilterOptions.includes( key ),
					} ) }
					label={
						<span className="nab-filter-option-label__container">
							<span
								className="nab-filter-option-label__name"
								title={ label }
							>
								{ label }
							</span>
							<span className="nab-filter-option-label__amount-container">
								<span className="nab-filter-option-label__value">
									{ 'number' === typeof value
										? compactInteger( value )
										: value }
								</span>
								<span className="nab-bar__container">
									<span
										className="nab-bar__value"
										style={ {
											width: ! value
												? '0px'
												: `${ (
														( value /
															totalClicks ) *
														100
												  ).toFixed( 2 ) }%`,
										} }
									></span>
								</span>
							</span>
						</span>
					}
					checked={ ! disabledFilterOptions.includes( key ) }
					onChange={ ( isChecked ) =>
						toggleDisabledFilterOption( key, isChecked )
					}
				/>
			) ) }
		</>
	);
};

// =====
// HOOKS
// =====

const useFilterOptions = () =>
	useSelect( ( select ) => {
		const activeFilter = select( NAB_HEATMAP ).getActiveFilter();
		const alternative = select( NAB_HEATMAP ).getActiveAlternative();
		const resolution = select( NAB_HEATMAP ).getActiveResolution();
		const filterOptions = select( NAB_HEATMAP ).getConfettiFilterOptions(
			alternative,
			resolution
		);

		let options: ReadonlyArray< ConfettiOption > = values(
			filterOptions[ activeFilter ]
		);
		if ( 'dayOfWeek' === activeFilter ) {
			const firstDayOfWeek = select( NAB_HEATMAP ).getFirstDayOfWeek();
			options = [
				...[ ...options ].splice( firstDayOfWeek ),
				...[ ...options ].splice( 0, firstDayOfWeek ),
			];
		} //end if

		if ( 'country' === activeFilter ) {
			options = options.map( ( option ) => ( {
				...option,
				label:
					'other' === option.key
						? _x( 'Other', 'text', 'nelio-ab-testing' )
						: getCountryName( option.key ),
			} ) );
			options = sortAlphabetically( options );
		} //end if

		return options;
	} );

const useDisabledFilterOptions = () =>
	useSelect( ( select ) => select( NAB_HEATMAP ).getDisabledFilterOptions() );

const useFilterOptionToggler = () => {
	const { setDisabledFilterOptions } = useDispatch( NAB_HEATMAP );

	const filterOptions = useFilterOptions();
	const disabledFilterOptions = useDisabledFilterOptions();
	const activeFilter = useSelect( ( select ) =>
		select( NAB_HEATMAP ).getActiveFilter()
	);

	if ( ! activeFilter || ! filterOptions.length ) {
		return noop;
	} //end if

	return ( key: ConfettiOption[ 'key' ], active: boolean ): void => {
		if ( 'all' === key ) {
			return void setDisabledFilterOptions(
				active ? [] : map( filterOptions, 'key' )
			);
		} //end if

		void setDisabledFilterOptions(
			active
				? without( disabledFilterOptions, key )
				: uniq( [ ...disabledFilterOptions, key ] )
		);
	};
};

// =======
// HELPERS
// =======

const sortAlphabetically = ( options: ReadonlyArray< ConfettiOption > ) =>
	sortBy( [ ...options ], [ 'label' ] );
