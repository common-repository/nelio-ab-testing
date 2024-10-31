/**
 * WordPress dependencies
 */
export * from '@wordpress/block-editor';

import { store as blockEditorStore } from '@wordpress/block-editor';
export const store = blockEditorStore as 'core/block-editor';
