/**
 * WordPress dependencies
 */
import type { SelectFunction as Select } from '@wordpress/data/build-types/types';

/**
 * External dependencies
 */
import type { Brand } from 'ts-brand';

/**
 * Internal dependencies
 */
import type { Dict } from './utils';
import type { OrderStatusName } from './ecommerce';
import type { ExperimentId } from './experiments';
import { EntityId } from './entities';

// =====
// GOALS
// =====

export type GoalId = '' | Brand< string, 'GoalId' >;

export type Goal = {
	readonly id: GoalId;
	readonly attributes: {
		readonly name: string;
		readonly useOrderRevenue?: boolean;
		readonly orderStatusForConversion?: OrderStatusName;
	};
	readonly conversionActions: ReadonlyArray< ConversionAction >;
};

// =======================
// CONVERSION ACTION TYPES
// =======================

export type ConversionActionTypeName = string;

export type ConversionActionType< A extends Dict = Dict > = {
	readonly name: ConversionActionTypeName;
	readonly title: string;
	readonly description: string;
	readonly attributes: A;
	readonly scope: ConversionActionScope;
	readonly icon: ( props?: Dict ) => JSX.Element;
	readonly edit: ( props: CAEditProps< A > ) => JSX.Element;
	readonly view: ( props: CAViewProps< A > ) => JSX.Element;
	readonly isActive?: ( s: Select ) => boolean;
	readonly validate?: ( attrs: A ) => Partial< Record< keyof A, string > >;
};

export type CAEditProps< A extends Dict = Dict > = CAViewProps< A > & {
	readonly errors: Partial< Record< keyof A, string > > & {
		readonly _scope?: string;
	};
	readonly setAttributes: ( attrs: Partial< A > ) => void;
	readonly setScope: ( scope: ConversionActionScope ) => void;
};

export type CAViewProps< A extends Dict = Dict > = {
	readonly attributes: A;
	readonly scope: ConversionActionScope;
	readonly experimentId: ExperimentId;
	readonly goal: Goal[ 'attributes' ];
	readonly goalId: GoalId;
	readonly goalIndex: number;
};

// ===========================
// CONVERSION ACTION INSTANCES
// ===========================

export type ConversionActionId = string;

export type ConversionAction< A extends Dict = Dict > = {
	readonly id: ConversionActionId;
	readonly type: ConversionActionTypeName;
	readonly attributes: A;
	readonly scope: ConversionActionScope;
};

export type ConversionActionScope =
	| { readonly type: 'all-pages' }
	| { readonly type: 'test-scope' }
	| { readonly type: 'php-function' }
	| { readonly type: 'post-ids'; readonly ids: ReadonlyArray< EntityId > } // TODO DAVID. Review this.
	| { readonly type: 'urls'; readonly regexes: ReadonlyArray< string > };
