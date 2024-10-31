export type ECommercePlugin = 'woocommerce' | 'edd';

export type OrderStatus = {
	readonly value: OrderStatusName;
	readonly label: string;
};

export type OrderStatusName = string;
