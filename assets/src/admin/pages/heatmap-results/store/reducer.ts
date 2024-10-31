/**
 * WordPress dependencies
 */
import { combineReducers } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import { reducer as data } from './data/reducer';
import { reducer as misc } from './misc/reducer';
import { reducer as ui } from './ui/reducer';

export const reducer = combineReducers( {
	data,
	misc,
	ui,
} );
