declare module '@wordpress/editor' {
	// store should be a full object, but selectors and actions in @types assume it's just a string
	export const store: 'core/editor';
}
