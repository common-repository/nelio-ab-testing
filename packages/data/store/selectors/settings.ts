/**
 * WordPress dependencies
 */
import { addQueryArgs } from '@safe-wordpress/url';

/**
 * External dependencies
 */
import { keys, values } from 'lodash';
import type {
	ECommercePlugin,
	Maybe,
	Menu,
	MenuId,
	NabCapability,
	SubscriptionPlan,
	Theme,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { ECommerceSettings, State } from '../types';
import { isDefined } from '@nab/utils';

export function getToday( state: State ): string {
	return state.settings.today;
} //end getToday()

export function getActivePlugins( state: State ): ReadonlyArray< string > {
	return state.settings.plugins;
} //end getActivePlugins()

export function hasMenus( state: State ): boolean {
	return !! keys( state.settings.menus ).length;
} //end hasMenus()

export function getMenu( state: State, id: MenuId ): Maybe< Menu > {
	return state.settings.menus[ id ];
} //end getMenu()

export function getTemplateContexts(
	state: State
): State[ 'settings' ][ 'templateContexts' ] {
	return state.settings.templateContexts;
} //end getTemplateContexts()

export function getTemplates(
	state: State
): State[ 'settings' ][ 'templates' ] {
	return state.settings.templates;
} //end getTemplates()

export function getThemes( state: State ): ReadonlyArray< Theme > {
	return values( state.settings.themes ).filter( isDefined );
} //end getThemes()

export function getAdminUrl(
	state: State,
	path: string,
	args: Record< string, string | boolean | number >
): string {
	const adminUrl = getPluginSetting( state, 'adminUrl' );
	return addQueryArgs( `${ adminUrl }${ path }`, args );
} //end getAdminUrl()

export function hasCapability(
	state: State,
	capability: NabCapability
): boolean {
	return state.settings.nelio.capabilities.includes( capability );
} //end hasCapability()

type GetPluginSetting = typeof _getPluginSetting & {
	CurriedSignature: < K extends keyof State[ 'settings' ][ 'nelio' ] >(
		name: K
	) => State[ 'settings' ][ 'nelio' ][ K ];
};
export const getPluginSetting = _getPluginSetting as GetPluginSetting;
function _getPluginSetting< K extends keyof State[ 'settings' ][ 'nelio' ] >(
	state: State,
	name: K
): State[ 'settings' ][ 'nelio' ][ K ] {
	return state.settings.nelio[ name ];
} //end _getPluginSetting()

type GetECommerceSetting = typeof _getECommerceSetting & {
	CurriedSignature: < K extends keyof ECommerceSettings >(
		plugin: ECommercePlugin,
		name: K
	) => ECommerceSettings[ K ];
};
export const getECommerceSetting = _getECommerceSetting as GetECommerceSetting;
function _getECommerceSetting< K extends keyof ECommerceSettings >(
	state: State,
	plugin: ECommercePlugin,
	name: K
): ECommerceSettings[ K ] {
	return state.settings.ecommerce[ plugin ][ name ];
} //end _getECommerceSetting()

export function canLimitSiteQuota( state: State ): boolean {
	return isSubscribedTo( state, 'professional', 'or-above' );
} //end canLimitSiteQuota()

export function isSubscribedTo(
	state: State,
	plan: SubscriptionPlan,
	mode: 'exactly' | 'or-above' = 'or-above'
): boolean {
	const actualPlan = getPluginSetting( state, 'subscription' );
	if ( ! actualPlan ) {
		return false;
	} //end if

	const plans = [ 'basic', 'professional', 'enterprise' ];
	const expectedIndex = plans.indexOf( plan );
	const actualIndex = plans.indexOf( actualPlan );

	if ( -1 === expectedIndex || -1 === actualIndex ) {
		return false;
	} //end if

	if ( 'or-above' !== mode ) {
		return expectedIndex === actualIndex;
	} //end if

	return actualIndex >= expectedIndex;
} //end isSubscribedTo()
