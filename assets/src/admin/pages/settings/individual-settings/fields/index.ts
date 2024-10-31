import type { FieldSettingProps } from './types';

import { AlternativeLoadingSetting } from './alternative-loading-setting';
import { CloudProxySetting } from './cloud-proxy-setting';
import { ExcludedIPsSetting } from './excluded-ips-setting';
import { GdprCookieSetting } from './gdpr-cookie-setting';

export const fields: Record<
	string,
	( props: FieldSettingProps ) => JSX.Element | null
> = {
	AlternativeLoadingSetting,
	CloudProxySetting,
	ExcludedIPsSetting,
	GdprCookieSetting,
};
