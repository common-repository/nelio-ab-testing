/**
 * WordPress dependencies
 */
import { controls, createReduxStore, register } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import { reducer } from './reducer';
import * as selectors from './selectors';
import * as realActions from './actions';
import * as sideEffects from './side-effects';

const actions = { ...realActions, ...sideEffects };

export const store = createReduxStore( 'nab/heatmap', {
	reducer,
	controls,
	actions,
	selectors,
} );
register( store );
