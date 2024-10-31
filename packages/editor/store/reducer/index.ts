/**
 * WordPress dependencies
 */
import { combineReducers } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import { editor } from './editor';
import { alternatives } from './alternatives';
import { conversionActions } from './conversion-actions';
import { data } from './experiment-data';
import { goals } from './goals';
import { scope } from './scope';
import { segmentation } from './segmentation';

export default combineReducers( {
	editor,
	experiment: combineReducers( {
		alternatives,
		conversionActions,
		data,
		goals,
		scope,
		segmentation,
	} ),
} );
