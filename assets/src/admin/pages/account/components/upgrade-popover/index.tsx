/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { useState } from '@safe-wordpress/element';

/**
 * Internal dependencies
 */
import './style.scss';
import { EnterpriseUpgradePopover } from './enterprise';
import { RegularUpgradePopover } from './regular';
import { store as NAB_ACCOUNT } from '../../store';

import type { UpgradePopoverProps } from './props';
export type { UpgradePopoverProps } from './props';

export const UpgradePopover = (
	props: UpgradePopoverProps
): JSX.Element | null => {
	const currentPlan = useSelect( ( select ) =>
		select( NAB_ACCOUNT ).getPlan()
	);
	const [ interestedInEnterprise, enableEnterprise ] = useState( false );

	return 'enterprise' === currentPlan || interestedInEnterprise ? (
		<EnterpriseUpgradePopover
			back={
				'enterprise' !== currentPlan &&
				( () => enableEnterprise( false ) )
			}
			{ ...props }
		/>
	) : (
		<RegularUpgradePopover
			showEnterprise={ () => enableEnterprise( true ) }
			{ ...props }
		/>
	);
};
