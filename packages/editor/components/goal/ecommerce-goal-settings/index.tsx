/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { CheckboxControl, SelectControl } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NAB_DATA } from '@nab/data';
import type {
	ECommercePlugin,
	Goal as RealGoal,
	Maybe,
	OrderStatus,
	OrderStatusName,
	ConversionAction,
} from '@nab/types';
type Goal = Omit< RealGoal, 'conversionActions' >;

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NAB_EDITOR } from '../../../store';

export const ECommerceGoalSettings = (): JSX.Element | null => {
	const plugin = useECommercePlugin();
	return plugin ? <ActualSettings plugin={ plugin } /> : null;
};

const ActualSettings = ( { plugin }: { plugin: ECommercePlugin } ) => {
	const title = useTitle( plugin );
	const [ checked, onToggle ] = useOrderRevenueToggle();
	const statuses = useECommerceOrderStatuses( plugin );
	const [ orderStatus, setOrderStatus ] = useOrderStatus( plugin );

	return (
		<div className="nab-ecommerce-goal-settings">
			<p>
				<strong>{ title }</strong>
			</p>
			<SelectControl
				label={ _x(
					'Order status required for conversions:',
					'command',
					'nelio-ab-testing'
				) }
				options={ statuses }
				value={ orderStatus }
				onChange={ setOrderStatus }
			/>
			<CheckboxControl
				label={ _x(
					'Track revenue and show in test results',
					'command',
					'nelio-ab-testing'
				) }
				checked={ checked }
				onChange={ onToggle }
			/>
		</div>
	);
};

// =====
// HOOKS
// =====

const useTitle = ( plugin: ECommercePlugin ): string => {
	switch ( plugin ) {
		case 'woocommerce':
			return _x(
				'WooCommerce Goal Settings',
				'text',
				'nelio-ab-testing'
			);

		case 'edd':
			return _x(
				'Easy Digital Downloads Goal Settings',
				'text',
				'nelio-ab-testing'
			);
	} //end switch
};

const useECommercePlugin = () =>
	useSelect( ( select ): Maybe< ECommercePlugin > => {
		const { getActiveGoal } = select( NAB_EDITOR );
		const { getConversionActions } = select( NAB_EDITOR );
		const goalId = getActiveGoal()?.id;
		const actions = goalId ? getConversionActions( goalId ) : [];

		if ( ! actions.length ) {
			return undefined;
		} //end if

		const isWcOrder = ( { type }: ConversionAction ) =>
			'nab/wc-order' === type;
		if ( actions.every( isWcOrder ) ) {
			return 'woocommerce';
		} //end if

		const isEddOrder = ( { type }: ConversionAction ) =>
			'nab/edd-order' === type;
		if ( actions.every( isEddOrder ) ) {
			return 'edd';
		} //end if

		return undefined;
	} );

const useOrderRevenueToggle = () => {
	const goal = useGoal();
	const value = goal?.attributes.useOrderRevenue ?? true;
	const { updateGoal } = useDispatch( NAB_EDITOR );
	const update = () =>
		goal ? updateGoal( goal.id, { useOrderRevenue: ! value } ) : void null;
	return [ value, update ] as const;
};

const useOrderStatus = ( plugin: ECommercePlugin ) => {
	const goal = useGoal();
	const validStatuses = useECommerceOrderStatuses( plugin );
	const status = goal?.attributes.orderStatusForConversion;
	const value =
		status &&
		validStatuses
			.map( ( s: OrderStatus ) => s.value )
			.includes( goal?.attributes.orderStatusForConversion )
			? status
			: getDefaultOrderStatus( plugin );

	const { updateGoal } = useDispatch( NAB_EDITOR );
	const update = ( v: OrderStatusName ) =>
		goal
			? updateGoal( goal.id, { orderStatusForConversion: v } )
			: void null;

	return [ value, update ] as const;
};

const useECommerceOrderStatuses = ( plugin: ECommercePlugin ) =>
	useSelect( ( select ) =>
		select( NAB_DATA ).getECommerceSetting( plugin, 'orderStatuses' )
	);

const useGoal = (): Maybe< Goal > =>
	useSelect( ( select ) => select( NAB_EDITOR ).getActiveGoal() );

// =======
// HELPERS
// =======

const getDefaultOrderStatus = ( plugin: ECommercePlugin ): OrderStatusName => {
	switch ( plugin ) {
		case 'woocommerce':
			return 'wc-completed';

		case 'edd':
			return 'complete';
	} //end switch
};
