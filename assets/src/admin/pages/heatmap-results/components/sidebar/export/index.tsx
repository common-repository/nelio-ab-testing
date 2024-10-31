/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PanelBody, Button } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NAB_DATA } from '@nab/data';
import { downloadAsCsv } from '@nab/utils';
import type { Click } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { useIsHeatmap, useIsLocked, useRawClicks } from '../../hooks';
import { store as NAB_HEATMAP } from '../../../store';

export const Export = (): JSX.Element | null => {
	const isLocked = useIsLocked();
	const isHeatmap = useIsHeatmap();
	const expId = useActiveExperimentId();
	const altId = useActiveAlternativeId();
	const cliks = useRawClicks();
	const handleDownload = useDownloadHandle(
		isHeatmap ? `${ expId }` : `${ expId }-${ altId }`,
		cliks
	);

	return (
		<PanelBody
			initialOpen={ false }
			className="nab-export"
			title={ _x( 'Export', 'text', 'nelio-ab-testing' ) }
		>
			<p>
				{ _x(
					'Export all the clicks of the heatmap:',
					'user',
					'nelio-ab-testing'
				) }
			</p>

			<Button
				className="nab-export__button"
				disabled={ isLocked }
				variant="secondary"
				onClick={ handleDownload }
			>
				{ _x( 'Download CSV', 'command', 'nelio-ab-testing' ) }
			</Button>
		</PanelBody>
	);
};

// =====
// HOOKS
// =====

const useActiveExperimentId = () =>
	useSelect( ( select ) =>
		select( NAB_DATA ).getPageAttribute( 'editor/activeExperiment' )
	);

const useActiveAlternativeId = () =>
	useSelect( ( select ) => select( NAB_HEATMAP ).getActiveAlternative() );

const useDownloadHandle =
	( id: string, clicks: ReadonlyArray< Click > ) => () => {
		const columns = [
			{
				accessor: ( item: Click ) =>
					item.xpath || item.cssPath || 'unknown',
				name: _x( 'Element', 'text', 'nelio-ab-testing' ),
			},
			{
				accessor: ( item: Click ) => item.x,
				name: _x( 'X coordinate', 'text', 'nelio-ab-testing' ),
			},
			{
				accessor: ( item: Click ) => item.y,
				name: _x( 'Y coordinate', 'text', 'nelio-ab-testing' ),
			},
			{
				accessor: ( item: Click ) => item.browser,
				name: _x( 'Browser', 'text', 'nelio-ab-testing' ),
			},
			{
				accessor: ( item: Click ) => item.country,
				name: _x( 'Country', 'text', 'nelio-ab-testing' ),
			},
			{
				accessor: ( item: Click ) => item.os,
				name: _x( 'OS', 'text', 'nelio-ab-testing' ),
			},
			{
				accessor: ( item: Click ) => item.device,
				name: _x( 'Device', 'text', 'nelio-ab-testing' ),
			},
			{
				accessor: ( item: Click ) => item.windowWidthInPx,
				name: _x( 'Window Width', 'text', 'nelio-ab-testing' ),
			},
			{
				accessor: ( item: Click ) => item.dayOfWeek,
				name: _x( 'Day of Week', 'text', 'nelio-ab-testing' ),
			},
			{
				accessor: ( item: Click ) => item.hourOfDay,
				name: _x( 'Hour of Day', 'text', 'nelio-ab-testing' ),
			},
			{
				accessor: ( item: Click ) => item.timeToClick,
				name: _x( 'Time to Click', 'text', 'nelio-ab-testing' ),
			},
			{
				accessor: ( item: Click ) => item.timestamp,
				name: _x( 'Timestamp', 'text', 'nelio-ab-testing' ),
			},
		];

		downloadAsCsv(
			columns,
			[ ...clicks ],
			sprintf(
				/* translators: a unique identifier */
				_x( 'heatmap-clicks-%s.csv', 'text', 'nelio-ab-testing' ),
				id
			)
		);
	};
