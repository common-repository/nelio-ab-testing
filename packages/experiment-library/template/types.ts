/**
 * External dependencies
 */
import type { EntityKindName, TemplateId } from '@nab/types';

export type ControlAttributes =
	| BuiltInTemplateAttributes
	| PageBuilderTemplateAttributes;

export type AlternativeAttributes = {
	readonly templateId?: TemplateId;
	readonly name: string;
};

export type BuiltInTemplateAttributes = {
	readonly postType: EntityKindName;
	readonly templateId?: TemplateId;
	readonly name: string;
};

export type PageBuilderTemplateAttributes = {
	readonly builder: string;
	readonly context: string;
	readonly templateId?: TemplateId;
	readonly name: string;
};
