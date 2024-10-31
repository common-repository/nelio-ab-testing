/**
 * External dependencies
 */
import type { Attributes } from '../../../../../packages/conversion-action-library/click-external-link/types';

/**
 * Internal dependencies
 */
import { getClosest } from '../../utils/helpers';
import { removeQueryArgs } from '../../utils/url';
import type { ConvertibleAction, Convert } from '../../types';

export function isClickExternalLinkAction(
	action: ConvertibleAction
): action is ConvertibleAction< Attributes > {
	return 'nab/click-external-link' === action.type;
} //end isClickExternalLinkAction()

export function listenToClickExternalLinkEvent(
	action: ConvertibleAction< Attributes >,
	convert: Convert
): void {
	const maybeConvert = ( anchorTag: HTMLAnchorElement ) => {
		const {
			attributes: { mode, value },
			experiment,
			goal,
		} = action;
		const href = removeQueryArgs(
			anchorTag.getAttribute( 'href' ) ?? '',
			'nab'
		);

		switch ( mode ) {
			case 'exact':
				return href === value && convert( experiment, goal );

			case 'partial':
				return (
					0 <= href.indexOf( value ) && convert( experiment, goal )
				);

			case 'start':
				return href.startsWith( value ) && convert( experiment, goal );

			case 'end':
				return href.endsWith( value ) && convert( experiment, goal );

			case 'regex':
				try {
					return (
						new RegExp( value ).test( href ) &&
						convert( experiment, goal )
					);
				} catch ( _ ) {}
		} //end switch
	};

	document.addEventListener( 'click', ( ev ) => {
		const target = ev.target as HTMLElement | null;
		if ( ! target ) {
			return;
		} //end if

		const anchorTag = getClosest< HTMLAnchorElement >( target, 'a' );
		if ( ! anchorTag ) {
			return;
		} //end if

		maybeConvert( anchorTag );
	} );

	Array.from( document.querySelectorAll< HTMLAnchorElement >( 'a' ) ).forEach(
		( el ) => {
			el.addEventListener( 'click', () => maybeConvert( el ) );
			el.addEventListener(
				'auxclick',
				( ev ) => 1 === ev.button && maybeConvert( el )
			);
		}
	);
} //end listenToClickExternalLinkEvent()
