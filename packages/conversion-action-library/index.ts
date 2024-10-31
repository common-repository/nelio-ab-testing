/**
 * External dependencies
 */
import { registerConversionActionType } from '@nab/conversion-actions';
import type { Dict } from '@nab/types';

/**
 * Internal dependencies
 */
import * as click from './click';
import * as clickExternalLink from './click-external-link';
import * as customEvent from './custom-event';
import * as downloadPurchase from './edd-order';
import * as formSubmission from './form-submission';
import * as pageView from './page-view';
import * as productPurchase from './wc-order';
import * as productToCart from './wc-add-to-cart';
import * as surecartPurchase from './surecart-order';
import * as videoPlayback from './video-playback';

export const registerCoreConversionActions = (): void => {
	[
		pageView,
		click,
		clickExternalLink,
		downloadPurchase,
		formSubmission,
		videoPlayback,
		productPurchase,
		productToCart,
		surecartPurchase,
		customEvent,
	].forEach( ( conversionAction?: { name: string; settings: Dict } ) => {
		if ( ! conversionAction ) {
			return;
		} //end if
		const { name, settings } = conversionAction;
		registerConversionActionType( name, settings );
	} );
};
