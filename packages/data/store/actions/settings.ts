/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type {
	ECommercePlugin,
	EntityKindName,
	Menu,
	PluginSettings,
	Template,
	TemplateContextGroup,
	TemplateContextGroupName,
	Theme,
} from '@nab/types';

/**
 * Internal dependencies
 */
import type { ECommerceSettings } from '../types';

export type SettingsAction =
	| SetToday
	| ReceivePlugins
	| ReceiveMenus
	| ReceiveTemplateContexts
	| ReceiveTemplates
	| ReceiveThemes
	| ReceivePluginSettings
	| ReceiveECommerceSettings;

export function setToday( today: string ): SetToday {
	return {
		type: 'SET_TODAY',
		today,
	};
} //end setToday()

export function receivePlugins(
	plugins: string | ReadonlyArray< string >
): ReceivePlugins {
	return {
		type: 'RECEIVE_PLUGINS',
		plugins: castArray( plugins ),
	};
} //end receivePlugins()

export function receiveMenus(
	menus: Menu | ReadonlyArray< Menu >
): ReceiveMenus {
	return {
		type: 'RECEIVE_MENUS',
		menus: castArray( menus ),
	};
} //end receiveMenus()

export function receiveTemplateContexts(
	templateContexts: Record< TemplateContextGroupName, TemplateContextGroup >
): ReceiveTemplateContexts {
	return {
		type: 'RECEIVE_TEMPLATE_CONTEXTS',
		templateContexts,
	};
} //end receiveTemplateContexts()

export function receiveTemplates(
	templates: Record< EntityKindName, ReadonlyArray< Template > >
): ReceiveTemplates {
	return {
		type: 'RECEIVE_TEMPLATES',
		templates,
	};
} //end receiveTemplates()

export function receiveThemes(
	themes: Theme | ReadonlyArray< Theme >
): ReceiveThemes {
	return {
		type: 'RECEIVE_THEMES',
		themes: castArray( themes ),
	};
} //end receiveThemes()

export function receivePluginSettings(
	settings: PluginSettings
): ReceivePluginSettings {
	return {
		type: 'RECEIVE_PLUGIN_SETTINGS',
		settings,
	};
} //end receivePluginSettings()

export function receiveECommerceSettings(
	ecommerce: ECommercePlugin,
	settings: ECommerceSettings
): ReceiveECommerceSettings {
	return {
		type: 'RECEIVE_ECOMMERCE_SETTINGS',
		ecommerce,
		settings,
	};
} //end receiveECommerceSettings()

// ============
// HELPER TYPES
// ============

type SetToday = {
	readonly type: 'SET_TODAY';
	readonly today: string;
};

type ReceivePlugins = {
	readonly type: 'RECEIVE_PLUGINS';
	readonly plugins: ReadonlyArray< string >;
};

type ReceiveMenus = {
	readonly type: 'RECEIVE_MENUS';
	readonly menus: ReadonlyArray< Menu >;
};

type ReceiveTemplateContexts = {
	readonly type: 'RECEIVE_TEMPLATE_CONTEXTS';
	readonly templateContexts: Record<
		TemplateContextGroupName,
		TemplateContextGroup
	>;
};

type ReceiveTemplates = {
	readonly type: 'RECEIVE_TEMPLATES';
	readonly templates: Record< EntityKindName, ReadonlyArray< Template > >;
};

type ReceiveThemes = {
	readonly type: 'RECEIVE_THEMES';
	readonly themes: ReadonlyArray< Theme >;
};

type ReceivePluginSettings = {
	readonly type: 'RECEIVE_PLUGIN_SETTINGS';
	readonly settings: PluginSettings;
};

type ReceiveECommerceSettings = {
	readonly type: 'RECEIVE_ECOMMERCE_SETTINGS';
	readonly ecommerce: ECommercePlugin;
	readonly settings: ECommerceSettings;
};
