/**
 * External dependencies
 */
import type { MenuId } from '@nab/types';

export type ControlAttributes = {
	readonly menuId: MenuId;
	readonly testAgainstExistingMenu?: boolean;
};

export type AlternativeAttributes = {
	readonly name: string;
	readonly menuId: MenuId;
	readonly isExistingMenu?: true;
};
