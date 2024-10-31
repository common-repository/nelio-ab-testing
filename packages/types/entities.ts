/**
 * External dependencies
 */
import type { Brand } from 'ts-brand';

/**
 * Internal dependencies
 */
import { MediaId, PostId } from './wordpress';

// =====
// POSTS
// =====

export type GenericId = '' | Brand< string, 'GenericId' >;

export type EntityId = PostId | GenericId;

export type EntityKindName = string;

export type EntityKind = {
	readonly kind: 'form' | 'entity';
	readonly name: EntityKindName;
	readonly labels: {
		// eslint-disable-next-line camelcase
		readonly singular_name: string;
	};
};

export type EntityInstance = {
	readonly id: EntityId;
	readonly authorName: string;
	readonly date: string;
	readonly excerpt: string;
	readonly imageId: MediaId;
	readonly imageSrc: string;
	readonly link: string;
	readonly thumbnailSrc: string;
	readonly title: string;
	readonly type: EntityKindName;
	readonly typeLabel: string;
	readonly extra: Partial< {
		readonly specialPostType: 'page-for-posts' | 'page-on-front';
	} >;
};

// =====
// MENUS
// =====

export type MenuId = 0 | Brand< number, 'MenuId' >;

export type Menu = {
	readonly id: Exclude< MenuId, 0 >;
	readonly name: string;
};

// =========
// TEMPLATES
// =========

export type TemplateId = '' | Brand< string, 'TemplateId' >;

export type TemplateContextGroupName = string;
export type TemplateContextGroup = {
	readonly label: string;
	readonly contexts: Record< TemplateContextName, TemplateContext >;
};

export type TemplateContextName = string;
export type TemplateContext = {
	readonly name: string;
	readonly label: string;
};

export type Template = {
	readonly id: TemplateId;
	readonly name: string;
};

// ======
// THEMES
// ======

export type ThemeId = '' | Brand< string, 'ThemeId' >;

export type Theme = {
	readonly id: ThemeId;
	readonly name: string;
};
