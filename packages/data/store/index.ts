/**
 * WordPress dependencies
 */
import {
	controls,
	createReduxStore,
	dispatch,
	register,
	select,
} from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { format } from '@nab/date';
import type { WithResolverDispatch, WithResolverSelect } from '@nab/types';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import * as selectors from './selectors';
import * as realActions from './actions';
import * as sideEffects from './side-effects/actions';
import * as resolvers from './side-effects/resolvers';
import { syncPageAttributeWithLocalStore } from './utils';

export * from './types';

const actions = { ...realActions, ...sideEffects };

export const store = createReduxStore( 'nab/data', {
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

select( store ).getPluginSetting( 'siteId' );
void dispatch( store ).setToday( format( 'Y-m-d', new Date() ) );

syncPageAttributeWithLocalStore( 'editor/shouldShowUniqueResults', true );
