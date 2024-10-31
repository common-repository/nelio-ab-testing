import { RichTextValue } from '@wordpress/rich-text';

declare module '@wordpress/rich-text' {
	export type RichTextFormat =
		RichTextValue[ 'formats' ][ number ][ number ] & {
			readonly attributes?: Record< string, string >;
		};
}
