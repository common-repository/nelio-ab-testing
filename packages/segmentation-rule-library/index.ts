/**
 * External dependencies
 */
import {
	registerSegmentationRuleType,
	registerSegmentationRuleTypeCategory,
} from '@nab/segmentation-rules';
import { SegmentationRuleType } from '@nab/types';

/**
 * Internal dependencies
 */
import * as source from './categories/source';
import * as technology from './categories/technology';
import * as timestamp from './categories/timestamp';
import * as visitor from './categories/visitor';
import * as others from './categories/others';

import * as browser from './rules/browser';
import * as cookie from './rules/cookie';
import * as dayOfWeek from './rules/day-of-week';
import * as deviceType from './rules/device-type';
import * as ipAddress from './rules/ip-address';
import * as language from './rules/language';
import * as location from './rules/location';
import * as operatingSystem from './rules/operating-system';
import * as queryParameter from './rules/query-parameter';
import * as referringUrl from './rules/referring-url';
import * as time from './rules/time';
import * as userLogin from './rules/user-login';
import * as windowWidth from './rules/window-width';

export const registerCoreSegmentationRules = (): void => {
	registerCoreSegmentationRuleCategories();

	[
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
	].forEach( ( segmentationRule ) => {
		if ( ! segmentationRule ) {
			return;
		} //end if
		const { name, settings } = segmentationRule;
		registerSegmentationRuleType(
			name,
			settings as unknown as SegmentationRuleType
		);
	} );
};

function registerCoreSegmentationRuleCategories() {
	[ source, visitor, timestamp, technology, others ].forEach(
		( category ) => {
			if ( ! category ) {
				return;
			} //end if
			const { name, settings } = category;
			registerSegmentationRuleTypeCategory( name, settings );
		}
	);
}
