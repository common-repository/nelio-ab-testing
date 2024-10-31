/**
 * External dependencies
 */
import type { ThemeId } from '@nab/types';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type ControlAttributes = {};

export type AlternativeAttributes = {
	readonly name: string;
	readonly themeId: ThemeId;
};
