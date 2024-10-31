/**
 * WordPress dependencies
 */
import { combineReducers } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import { entities } from './entities';
import { experiments } from './experiments';
import { fastspring } from './fastspring';
import { media } from './media';
import { page } from './page';
import { results } from './results';
import { settings } from './settings';
import { siteQuota } from './site-quota';

export default combineReducers( {
	entities,
	experiments,
	fastspring,
	media,
	page,
	results,
	settings,
	siteQuota,
} );
