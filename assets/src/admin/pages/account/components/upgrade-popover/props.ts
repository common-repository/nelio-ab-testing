/**
 * WordPress dependencies
 */
import type { Popover } from '@safe-wordpress/components';

export type UpgradePopoverProps = {
	readonly isOpen?: boolean;
	readonly placement: Popover.Props[ 'placement' ];
	readonly onClick: () => void;
	readonly onFocusOutside: () => void;
};
