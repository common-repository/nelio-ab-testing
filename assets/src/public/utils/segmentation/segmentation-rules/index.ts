/**
 * External dependencies
 */
import type { SegmentationRule } from '@nab/types';

/**
 * Internal dependencies
 */
import * as browser from './browser';
import * as cookie from './cookie';
import * as dayOfWeek from './day-of-week';
import * as deviceType from './device-type';
import * as ipAddress from './ip-address';
import * as language from './language';
import * as location from './location';
import * as operatingSystem from './operating-system';
import * as queryParameter from './query-parameter';
import * as referringUrl from './referring-url';
import * as time from './time';
import * as userLogin from './user-login';
import * as windowWidth from './window-width';

type Validator = {
	readonly type: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readonly validate: ( attrs: any ) => boolean;
};

export const isValidSegmentationRule = ( {
	type,
	attributes,
}: Omit< SegmentationRule, 'id' > ): boolean => {
	const segmentationRuleValidators: ReadonlyArray< Validator > = [
		browser,
		cookie,
		dayOfWeek,
		deviceType,
		ipAddress,
		language,
		location,
		operatingSystem,
		queryParameter,
		referringUrl,
		time,
		userLogin,
		windowWidth,
	];

	return !! segmentationRuleValidators
		.find( ( validator ) => validator.type === type )
		?.validate( attributes );
};
