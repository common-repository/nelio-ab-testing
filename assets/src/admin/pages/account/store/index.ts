/**
 * WordPress dependencies
 */
import { createReduxStore, register, controls } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import type { WithResolverDispatch, WithResolverSelect } from '@nab/types';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import * as selectors from './selectors';
import * as realActions from './actions';
import * as sideEffects from './side-effects/actions';
import * as resolvers from './side-effects/resolvers';

export * from './types';

const actions = { ...realActions, ...sideEffects };

export const store = createReduxStore( 'nab/account', {
	reducer,
	controls,
	actions: actions as WithResolverDispatch<
		typeof actions,
		typeof resolvers
	>,
	selectors: selectors as WithResolverSelect<
		typeof selectors,
		typeof resolvers
	>,
	resolvers,
} );
register( store );
