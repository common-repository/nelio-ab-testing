/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';
import cloudIcon from './assets/cloud.svg';
import collectingResultsIcon from './assets/collecting-results.svg';
import overviewIcon from './assets/overview.svg';
import defaultIcon from './assets/default.svg';
import noWinnerIcon from './assets/no-winner.svg';
import possibleWinnerIcon from './assets/possible-winner.svg';
import settingsIcon from './assets/settings.svg';
import winnerIcon from './assets/winner.svg';

const icons = {
	cloud: cloudIcon,
	'collecting-results': collectingResultsIcon,
	overview: overviewIcon,
	default: defaultIcon,
	'no-winner': noWinnerIcon,
	'possible-winner': possibleWinnerIcon,
	settings: settingsIcon,
	winner: winnerIcon,
};

export type FancyIconProps = {
	readonly icon?: keyof typeof icons;
	readonly className?: string;
	readonly isRounded?: boolean;
};

export const FancyIcon = ( {
	icon,
	className,
	isRounded,
}: FancyIconProps ): JSX.Element => {
	const MaybeIcon = icon ? icons[ icon ] : undefined;
	const Icon = MaybeIcon ?? icons.default;
	className = classnames( [
		'nab-fancy-icon',
		{ 'nab-fancy-icon--rounded': isRounded },
		className,
	] );

	return <Icon className={ className } />;
};
