/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { RangeControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';
import { useHeatmapIntensity, useIsLocked } from '../hooks';

export const HeatmapIntensity = (): JSX.Element => {
	const isLocked = useIsLocked();
	const [ heatmapIntensity, setHeatmapIntensity ] = useHeatmapIntensity();

	return (
		<RangeControl
			disabled={ isLocked }
			className="nab-heatmap-intensity"
			label={ _x( 'Heat Intensity', 'text', 'nelio-ab-testing' ) }
			value={ heatmapIntensity }
			onChange={ ( value ) => setHeatmapIntensity( value || 40 ) }
			min={ 40 }
			max={ 100 }
		/>
	);
};
