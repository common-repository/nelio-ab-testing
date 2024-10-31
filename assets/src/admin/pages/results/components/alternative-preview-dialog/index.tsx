/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Modal } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { find, findIndex } from 'lodash';
import { usePageAttribute } from '@nab/data';
import { store as NAB_EXPERIMENTS } from '@nab/experiments';
import type { AlternativeId } from '@nab/types';

/**
 * Internal dependencies
 */
import { getAlternativeName } from '../utils';
import { useExperimentAttribute } from '../hooks';

export const AlternativePreviewDialog = (): JSX.Element | null => {
	const [ experimentId ] = usePageAttribute( 'editor/activeExperiment', 0 );
	const [ alternativeId, setAlternativeId ] = usePageAttribute(
		'editor/alternativeInPreviewDialog',
		false
	);
	const alternative = useAlternative( alternativeId );
	const alternativeName = useAlternativeName( alternativeId );
	const Content = usePreviewComponent();

	if ( ! alternative || ! alternativeId || ! Content ) {
		return null;
	} //end if

	return (
		<Modal
			title={ alternativeName }
			onRequestClose={ () => setAlternativeId( false ) }
		>
			<Content
				experimentId={ experimentId }
				alternativeId={ alternativeId }
				attributes={ alternative }
			/>
		</Modal>
	);
};

// =====
// HOOKS
// =====

const useAlternative = ( alternativeId: AlternativeId | false ) => {
	const alternatives = useExperimentAttribute( 'alternatives' );
	return alternativeId
		? find( alternatives, { id: alternativeId } )?.attributes
		: undefined;
};

const useAlternativeName = ( alternativeId: AlternativeId | false ) => {
	const alternatives = useExperimentAttribute( 'alternatives' );
	const alternative = useAlternative( alternativeId );

	if ( ! alternative || ! alternativeId ) {
		return '';
	} //end if

	return getAlternativeName(
		findIndex( alternatives, { id: alternativeId } ),
		alternative.name
	);
};

const usePreviewComponent = () => {
	const type = useExperimentAttribute( 'type' );
	return useSelect( ( select ) => {
		return select( NAB_EXPERIMENTS ).getExperimentSupport(
			type ?? '',
			'alternativePreviewDialog'
		);
	} );
};
