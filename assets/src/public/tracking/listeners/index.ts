/**
 * Internal dependencies
 */
import './woocommerce';
import { addActionTypeListeners } from '../conversions';

import { isClickAction, listenToClickEvent } from './click';
import {
	isClickExternalLinkAction,
	listenToClickExternalLinkEvent,
} from './click-external-link';
import {
	isJavaScriptFormSubmissionAction,
	isWordPressFormSubmissionAction,
	listenToJavaScriptFormSubmission,
	prepareFormForSyncingEventInWordPress,
} from './form-submission';
import {
	isVideoPlaybackAction,
	listenToVideoPlaybackEvent,
} from './video-playback';
import {
	isWooCommerceAddToCartAction,
	listenToWooCommerceAddToCartEvent,
} from './wc-add-to-cart';

import type { Convert } from '../../types';

export function initDefaultListeners( convert: Convert ): void {
	addActionTypeListeners(
		( action ) =>
			isClickAction( action ) && listenToClickEvent( action, convert )
	);

	addActionTypeListeners(
		( action ) =>
			isClickExternalLinkAction( action ) &&
			listenToClickExternalLinkEvent( action, convert )
	);

	addActionTypeListeners(
		( action ) =>
			isWordPressFormSubmissionAction( action ) &&
			prepareFormForSyncingEventInWordPress( action )
	);

	addActionTypeListeners(
		( action ) =>
			isJavaScriptFormSubmissionAction( action ) &&
			listenToJavaScriptFormSubmission( action, convert )
	);

	addActionTypeListeners(
		( action ) =>
			isVideoPlaybackAction( action ) &&
			listenToVideoPlaybackEvent( action, convert )
	);

	addActionTypeListeners(
		( action ) =>
			isWooCommerceAddToCartAction( action ) &&
			listenToWooCommerceAddToCartEvent( action, convert )
	);
} //end initDefaultListeners()
