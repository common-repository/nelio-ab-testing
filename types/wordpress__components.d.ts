import * as C from '@wordpress/components';

import { ButtonAsButtonProps } from '@wordpress/components/build-types/button/types';
import { CheckboxControlProps } from '@wordpress/components/build-types/checkbox-control/types';
import { DashiconProps } from '@wordpress/components/build-types/dashicon/types';
import { IconKey as Dashicon } from '@wordpress/components/build-types/dashicon/types';
import { MenuItemProps } from '@wordpress/components/build-types/menu-item/types';
import { MenuItemsChoiceProps } from '@wordpress/components/build-types/menu-items-choice/types';
import { Popover } from '@wordpress/components';
import { PopoverProps } from '@wordpress/components/build-types/popover/types';
import { RadioControlProps } from '@wordpress/components/build-types/radio-control/types';
import { SelectControlProps } from '@wordpress/components/build-types/select-control/types';
import { TabPanelProps } from '@wordpress/components/build-types/tab-panel/types';
import { WordPressComponentProps } from '@wordpress/components/build-types/context';

declare module '@wordpress/components' {
	export default C;

	// Button.Props should be available
	export namespace Button {
		export type Props = ButtonAsButtonProps;
	}

	// label should probably not accept Elements, but we do that often.
	// onChange should provide a boolean value
	export const CheckboxControl: (
		props: Omit<
			WordPressComponentProps< CheckboxControlProps >,
			'label' | 'onChange'
		> & {
			readonly label?: string | JSX.Element;
			readonly onChange: ( value: boolean ) => void;
		}
	) => JSX.Element;

	// Dashicon.Props should be available
	export namespace Dashicon {
		export type Props = DashiconProps;
	}

	// icon should accept Dashicons
	export const MenuItem: (
		props: Pick< MenuItemsProps, 'role' | 'onClick' | 'children' > & {
			readonly disabled?: boolean;
			readonly icon?: Dashicon | JSX.Element;
		}
	) => JSX.Element;

	// onHover should be optional
	export const MenuItemsChoice: (
		props: Omit< MenuItemsChoiceProps, 'onHover' > &
			Pick< Partial< MenuItemsChoiceProps >, 'onHover' >
	) => JSX.Element;

	// Popover.Slot should exist
	export const Popover: Popover & {
		readonly Slot: () => JSX.Element;
	};

	// Popover.Props should be available
	export namespace Popover {
		export type Props = PopoverProps;
	}

	// options and onChange props should have proper type inference
	export const RadioControl: < T extends string >(
		props: Omit< RadioControlProps, 'options' | 'onChange' > & {
			readonly className?: string;
			readonly options: ReadonlyArray< Option< T > >;
			readonly onChange: ( v: NoInfer< T > ) => void;
		}
	) => JSX.Element;

	// options and onChange props should have proper type inference
	export const SelectControl: < O extends Option< string > >(
		props: Omit< SelectControlProps, 'options' | 'onChange' > & {
			readonly className?: string;
			readonly options: ReadonlyArray< O >;
			readonly onChange: ( v: O[ 'value' ] ) => void;
		}
	) => JSX.Element;

	// Spinner should not require any props
	export const Spinner: () => JSX.Element;

	// initialTabName, onSelect, tabs, and children props should have proper type inference
	export const TabPanel: < T extends Tab< string > >(
		props: Omit<
			TabPanelProps,
			'initialTabName' | 'onSelect' | 'tabs' | 'children'
		> & {
			readonly initialTabName?: T[ 'name' ];
			readonly tabs: ReadonlyArray< T >;
			readonly onSelect: ( tabName: T[ 'name' ] ) => void;
			readonly children: ( tab: Tab ) => JSX.Element;
		}
	) => JSX.Element;

	// ToolbarButton should not require a ton of properties
	export const ToolbarButton: ( props: {
		readonly className?: string;
		readonly icon: JSX.Element | Dashicon;
		readonly title: string;
		readonly isActive?: boolean;
		readonly onClick: () => void;
	} ) => JSX.Element;

	// HELPERS

	type Option< T > = {
		readonly label: string;
		readonly value: T;
	};

	type Tab< T > = {
		readonly name: T;
		readonly title: string | JSX.Element;
		readonly className?: string;
	};
}
