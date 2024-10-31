/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { isUrlInvalid } from '@nab/utils';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export function validate(
	attributes: Attributes
): Partial< Record< keyof Attributes, string > > {
	const { mode, url, postId } = attributes;
	if ( 'id' === mode && ! postId ) {
		return {
			postId: _x(
				'Please select a content to track its visits as conversions',
				'user',
				'nelio-ab-testing'
			),
		};
	} //end if

	const urlError = 'url' === mode && getUrlError( url );
	if ( urlError ) {
		return { url: urlError };
	} //end if

	return {};
} //end validate()

// =======
// HELPERS
// =======

const getUrlError = ( url: string ): false | string =>
	isUrlInvalid( url ) || hasQueryArgs( url ) || isMissingProtocol( url );

const hasQueryArgs = ( url: string ): false | string =>
	0 <= url.indexOf( '?' ) &&
	_x( 'Please write a URL with no query args', 'user', 'nelio-ab-testing' );

const isMissingProtocol = ( url: string ): false | string =>
	! /^https:\/\//.test( url ) &&
	_x(
		'Please write a full URL starting with “https://”',
		'user',
		'nelio-ab-testing'
	);
