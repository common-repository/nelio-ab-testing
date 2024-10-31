/**
 * WordPress dependencies
 */
import { createReduxStore, register, controls } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import * as selectors from './selectors';
import * as realActions from './actions';
import * as sideEffects from './side-effects/actions';

const actions = { ...realActions, ...sideEffects };

export const store = createReduxStore( 'nab/editor', {
	reducer,
	controls,
	actions,
	selectors,
} );
register( store );
