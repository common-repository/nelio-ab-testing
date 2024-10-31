/**
 * External dependencies
 */
import type { Attributes } from '../../../../../packages/conversion-action-library/click/types';

/**
 * Internal dependencies
 */
import type { ConvertibleAction, Convert } from '../../types';

export function isClickAction(
	action: ConvertibleAction
): action is ConvertibleAction< Attributes > {
	return 'nab/click' === action.type;
} //end isClickAction()

export function listenToClickEvent(
	action: ConvertibleAction< Attributes >,
	convert: Convert
): void {
	const { attributes, experiment, goal } = action;
	const onClick = ( ev: MouseEvent ) => {
		const target = ev.target as Element | null;
		if ( ! target ) {
			return;
		} //end if

		const els = getElements( attributes );
		if ( ! isExactlyOrDescendant( els, target ) ) {
			return;
		} //end if

		convert( experiment, goal );
	};

	document.addEventListener( 'click', onClick );
	document.addEventListener( 'click', onClick, true );
} //end listenToClickEvent()

// =======
// HELPERS
// =======

const isExactlyOrDescendant = (
	candidates: ReadonlyArray< Element >,
	el: Element
): boolean => {
	return (
		candidates.includes( el ) ||
		candidates.some( ( p ) => p.contains( el ) )
	);
};

const getElements = ( {
	mode,
	value,
}: Attributes ): ReadonlyArray< Element > => {
	try {
		switch ( mode ) {
			case 'id': {
				const el = document.getElementById( value );
				return el ? [ el ] : [];
			}

			case 'class':
				return Array.from( document.getElementsByClassName( value ) );

			case 'css':
				return Array.from( document.querySelectorAll( value ) );
		} //end switch
	} catch ( e ) {
		// eslint-disable-next-line no-console
		console.error( e );
		return [];
	} //end try
};
