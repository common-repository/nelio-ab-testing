/**
 * WordPress dependencies
 */
import { controls, createReduxStore, register } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import { reducer } from './reducer';
import * as selectors from './selectors';
import * as actions from './actions';

export const store = createReduxStore( 'nab/individual-settings', {
	reducer,
	controls,
	actions,
	selectors,
} );
register( store );
