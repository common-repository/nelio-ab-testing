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
import { useIsLocked, useHeatmapOpacity } from '../hooks';

export const Opacity = (): JSX.Element => {
	const isLocked = useIsLocked();
	const [ opacity, setOpacity ] = useHeatmapOpacity();

	return (
		<RangeControl
			disabled={ isLocked }
			className="nab-heatmap-opacity"
			label={ _x( 'Opacity', 'text', 'nelio-ab-testing' ) }
			value={ opacity }
			onChange={ ( value ) => setOpacity( value ?? 25 ) }
			min={ 25 }
			max={ 75 }
		/>
	);
};
