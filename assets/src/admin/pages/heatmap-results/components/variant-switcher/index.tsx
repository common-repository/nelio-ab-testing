/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { SelectControl } from '@safe-wordpress/components';
import { _x, sprintf } from '@safe-wordpress/i18n';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { addQueryArgs } from '@safe-wordpress/url';

/**
 * External dependencies
 */
import { indexOf, map } from 'lodash';
import { getLetter } from '@nab/utils';

/**
 * Internal dependencies
 */
import './style.scss';
import { useActiveExperiment, useIsLocked } from '../hooks';
import { store as NAB_HEATMAP } from '../../store';

export const VariantSwitcher = (): JSX.Element | null => {
	const [ alternative, setAlternative ] = useAlternative();
	const alternatives = useAlternatives();
	const disabled = useIsLocked();

	if ( ! alternative || ! alternatives.length ) {
		return null;
	} //end if

	const options = alternatives.map( ( id, index ) => ( {
		value: id,
		label: sprintf(
			/* translators: variant letter */
			_x( 'Variant %s', 'text', 'nelio-ab-testing' ),
			getLetter( index )
		),
	} ) );

	return (
		<div className="nab-heatmap-results-header__variant">
			<SelectControl
				disabled={ disabled }
				value={ alternative }
				options={ options }
				onChange={ setAlternative }
			/>
		</div>
	);
};

// =====
// HOOKS
// =====

const useAlternative = () => {
	const altIndex = useSelect( ( select ) =>
		select( NAB_HEATMAP ).getActiveAlternative()
	);
	const alternatives = useAlternatives();
	const alternative = alternatives[ altIndex ];
	const { setActiveAlternative } = useDispatch( NAB_HEATMAP );
	const setAlternative = ( alt: string ) => {
		const index = indexOf( alternatives, alt );
		void setActiveAlternative( index );
		const url = addQueryArgs( document.location.href, {
			heatmap: index,
		} );
		window.history.replaceState( {}, '', url );
	};
	return [ alternative, setAlternative ] as const;
};

const useAlternatives = () => {
	const experiment = useActiveExperiment();
	return experiment?.type === 'nab/heatmap'
		? []
		: map( experiment?.alternatives, 'id' );
};
