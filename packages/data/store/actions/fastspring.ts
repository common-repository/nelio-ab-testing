/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type { FastSpringProduct } from '@nab/types';

export type FastSpringAction =
	| ReceiveFSCurrency
	| ReceiveFSProducts
	| ReceiveFSSubscriptionId;

export function receiveFSCurrency( currency: string ): ReceiveFSCurrency {
	return {
		type: 'RECEIVE_FS_CURRENCY',
		currency,
	};
} //end receiveFSCurrency()

export function receiveFSProducts(
	products: FastSpringProduct | ReadonlyArray< FastSpringProduct >
): ReceiveFSProducts {
	return {
		type: 'RECEIVE_FS_PRODUCTS',
		products: castArray( products ),
	};
} //end receiveFSProducts()

export function receiveFSSubscriptionId(
	subscriptionId: string
): ReceiveFSSubscriptionId {
	return {
		type: 'RECEIVE_FS_SUBSCRIPTION_ID',
		subscriptionId,
	};
} //end receiveFSSubscriptionId()

// ============
// HELPER TYPES
// ============

type ReceiveFSCurrency = {
	readonly type: 'RECEIVE_FS_CURRENCY';
	readonly currency: string;
};

type ReceiveFSProducts = {
	readonly type: 'RECEIVE_FS_PRODUCTS';
	readonly products: ReadonlyArray< FastSpringProduct >;
};

type ReceiveFSSubscriptionId = {
	readonly type: 'RECEIVE_FS_SUBSCRIPTION_ID';
	readonly subscriptionId: string;
};
