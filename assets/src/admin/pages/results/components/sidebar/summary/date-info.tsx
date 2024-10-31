/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PanelRow } from '@safe-wordpress/components';
import { _n, _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { formatI18nDate } from '@nab/date';
import { numberFormat } from '@nab/i18n';
import { computeDuration } from '@nab/utils';
import type { Experiment } from '@nab/types';

export type DateInfoProps = {
	readonly start: Experiment[ 'startDate' ];
	readonly end: Experiment[ 'endDate' ];
	readonly endMode: Experiment[ 'endMode' ];
	readonly endValue: Experiment[ 'endValue' ];
};

export const DateInfo = ( {
	start,
	end,
	endMode,
	endValue,
}: DateInfoProps ): JSX.Element | null => {
	if ( ! start || ! endMode ) {
		return null;
	} //end if

	end = end || '';

	return (
		<>
			<PanelRow className="nab-experiment-summary__start">
				<span>{ _x( 'Duration', 'text', 'nelio-ab-testing' ) }</span>
				<span>{ formatDateDifference( start, end ) }</span>
			</PanelRow>

			<PanelRow className="nab-experiment-summary__start">
				<span>{ _x( 'Start', 'text', 'nelio-ab-testing' ) }</span>
				<span>{ formatI18nDate( start ) }</span>
			</PanelRow>

			{ !! end ? (
				<PanelRow className="nab-experiment-summary__end">
					<span>{ _x( 'End', 'text', 'nelio-ab-testing' ) }</span>
					<span>{ formatI18nDate( end ) }</span>
				</PanelRow>
			) : (
				<PanelRow className="nab-experiment-summary__end-mode">
					<span>{ _x( 'End', 'text', 'nelio-ab-testing' ) }</span>
					<span>{ getLabel( endMode, endValue ) }</span>
				</PanelRow>
			) }
		</>
	);
};

function formatDateDifference( start: string, end?: string ) {
	const duration = computeDuration( start, end );

	const snippets = [
		duration.months,
		duration.days,
		duration.hours,
		duration.minutes,
	];

	const { months, days, hours, minutes } = duration;

	const stringifiedSnippets = [
		sprintf(
			/* translators: number of months */
			_n( '%d month', '%d months', months, 'nelio-ab-testing' ),
			months
		),
		/* translators: number of days */
		sprintf( _n( '%d day', '%d days', days, 'nelio-ab-testing' ), days ),
		sprintf(
			/* translators: number of hours */
			_n( '%d hour', '%d hours', hours, 'nelio-ab-testing' ),
			hours
		),
		sprintf(
			/* translators: number of minutes */
			_n( '%d minute', '%d minutes', minutes, 'nelio-ab-testing' ),
			minutes
		),
	];

	for ( let i = 0; i < snippets.length - 1; ++i ) {
		if ( snippets[ i ] && snippets[ i + 1 ] ) {
			return joinTimes(
				stringifiedSnippets[ i ],
				stringifiedSnippets[ i + 1 ]
			);
		} //end if

		if ( snippets[ i ] ) {
			return stringifiedSnippets[ i ];
		} //end if
	} //end for

	if ( snippets[ snippets.length - 1 ] ) {
		return stringifiedSnippets[ snippets.length - 1 ];
	} //end if

	return _x( 'Less than a minute', 'text', 'nelio-ab-testing' );
} //end formatDateDifference()

function joinTimes( a: string | undefined, b: string | undefined ) {
	if ( ! a && ! b ) {
		return '';
	} //end if

	if ( ! a || ! b ) {
		return a || b;
	} //end if

	const and = _x( 'and', 'text', 'nelio-ab-testing' );
	return `${ a } ${ and } ${ b }`;
} //end joinTimes()

function getLabel(
	endMode: Experiment[ 'endMode' ],
	endValue?: Experiment[ 'endValue' ]
): string {
	endValue = endValue ?? 0;
	switch ( endMode ) {
		case 'duration':
			return sprintf(
				/* translators: number of days */
				_n(
					'After %s day',
					'After %s days',
					endValue,
					'nelio-ab-testing'
				),
				numberFormat( endValue )
			); // eslint-disable-line

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

		default:
			return _x( 'Manual', 'text', 'nelio-ab-testing' );
	} //end switch
} //end getLabel()
