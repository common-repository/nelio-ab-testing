/**
 * WordPress dependencies
 */
import { createReduxStore, register } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import * as selectors from './selectors';
import * as actions from './actions';
import { reducer } from './reducer';

export const store = createReduxStore( 'nab/segmentation-rules', {
	reducer,
	selectors,
	actions,
} );
register( store );
