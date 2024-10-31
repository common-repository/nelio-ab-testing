/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon } from '@safe-wordpress/components';

/**
 * Internal dependencies
 */
import { Tooltip } from '../tooltip';
import type { TooltipProps } from '../tooltip';

export type HelpIconProps = {
	readonly className?: string;
	readonly type?: 'info' | 'editor-help';
	readonly text?: string;
	readonly tooltipPlacement?: TooltipProps[ 'placement' ];
};

export const HelpIcon = ( {
	type,
	text,
	className,
	tooltipPlacement = 'bottom',
}: HelpIconProps ): JSX.Element => (
	<Tooltip text={ text } placement={ tooltipPlacement }>
		<span className={ className }>
			<Dashicon icon={ 'info' === type ? 'info' : 'editor-help' } />
		</span>
	</Tooltip>
);
