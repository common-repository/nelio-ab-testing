/**
 * External dependencies
 */
import throttle from 'lodash/throttle';
import type { Attributes } from '../../../../../packages/conversion-action-library/video-playback/types';

/**
 * Internal dependencies
 */
import { onScrollDown } from '../utils';
import { domReady } from '../../utils/helpers';
import { addQueryArgs } from '../../utils/url';
import type { ConvertibleAction, Convert } from '../../types';

const YOUTUBE_PLAY = 1;
const YOUTUBE_END = 0;

export function isVideoPlaybackAction(
	action: ConvertibleAction
): action is ConvertibleAction< Attributes > {
	return 'nab/video-playback' === action.type;
} //end isVideoPlaybackAction()

export function listenToVideoPlaybackEvent(
	action: ConvertibleAction< Attributes >,
	convert: Convert
): void {
	switch ( action?.attributes?.platform ) {
		case 'youtube':
			return listenToYouTubeVideoPlaybackEvent( action, convert );
	} //end switch
} //end listenToVideoPlaybackEvent()

// =======
// HELPERS
// =======

function listenToYouTubeVideoPlaybackEvent(
	action: ConvertibleAction< Attributes >,
	convert: Convert
): void {
	const apiReady = loadYouTubeApi();
	apiReady( () => {
		addYouTubeListeners( action, convert );
		onScrollDown(
			throttle( () => addYouTubeListeners( action, convert ), 1000 )
		);
	} );
} //end listenToYouTubeVideoPlaybackEvent()

let youTubeApiStatus: 'unavailable' | 'loading' | 'ready' = 'unavailable';
function loadYouTubeApi() {
	domReady( () => {
		if ( 'unavailable' !== youTubeApiStatus ) {
			return;
		} //end if
		youTubeApiStatus = 'loading';

		// NOTE. Improve these types.
		/* eslint-disable */
		const fn: () => void =
			( window as any ).onYouTubeIframeAPIReady ?? ( () => {} );
		( window as any ).onYouTubeIframeAPIReady = () => {
			/* eslint-enable */
			youTubeApiStatus = 'ready';
			fn();
		};

		const tag = document.createElement( 'script' );
		tag.src = 'https://www.youtube.com/iframe_api';
		document.head.appendChild( tag );
	} );

	return ( fn: () => void ) => {
		const check = ( attempt: number ) => {
			if ( 'ready' === youTubeApiStatus ) {
				return fn();
			} //end if
			if ( 5 <= attempt ) {
				return;
			} //end if
			setTimeout( () => check( attempt + 1 ), attempt * 2000 );
		};
		check( 1 );
	};
} //end loadYouTubeApi()

const listenedYouTubeIframes: HTMLIFrameElement[] = [];
function addYouTubeListeners(
	action: ConvertibleAction< Attributes >,
	convert: Convert
) {
	const { videoId, event } = action.attributes;
	const { experiment, goal } = action;

	getYouTubeIframes( videoId )
		.filter( ( iframe ) => ! listenedYouTubeIframes.includes( iframe ) )
		.forEach( ( iframe ) => {
			listenedYouTubeIframes.push( iframe );
			// NOTE. Improve these types.
			/* eslint-disable */
			new ( window as any ).YT.Player( iframe, {
				events: {
					onStateChange: ( ev: { data: number } ) => {
						switch ( ev.data ) {
							case YOUTUBE_PLAY:
								return (
									'play' === event &&
									convert( experiment, goal )
								);

							case YOUTUBE_END:
								return (
									'end' === event &&
									convert( experiment, goal )
								);
						} //end switch
					},
				},
			} );
			/* eslint-enable */
		} );
} //end addYouTubeListeners()

function getYouTubeIframes( videoId: string ) {
	const iframes = Array.from(
		document.querySelectorAll< HTMLIFrameElement >(
			`iframe[src*="${ videoId }"]`
		)
	).filter(
		( iframe ) =>
			iframe.src.includes( 'youtube' ) ||
			iframe.src.includes( 'youtu.be' )
	);

	iframes
		.filter( ( iframe ) => ! iframe.src.includes( 'enablejsapi' ) )
		.forEach( ( iframe ) => {
			iframe.src = addQueryArgs( iframe.src, { enablejsapi: 1 } );
		} );

	return iframes;
} //end getYouTubeIframes()
