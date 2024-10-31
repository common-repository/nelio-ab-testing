/**
 * External dependencies
 */
import type { FastSpringProduct, Maybe } from '@nab/types';

/**
 * Internal dependencies
 */
import { State } from '../types';

export function getCurrency( state: State ): string {
	return state.fastspring.currency;
} //end getCurrency()

export function getProducts(
	state: State
): ReadonlyArray< FastSpringProduct > {
	return state.fastspring.products;
} //end getProducts()

export function getSubscriptionId( state: State ): Maybe< string > {
	return state.fastspring.subscriptionId || undefined;
} //end getSubscriptionId()
