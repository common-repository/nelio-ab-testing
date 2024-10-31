module.exports = {
	rootDir: '../../',
	preset: '@wordpress/jest-preset-default',
	testURL: 'http://localhost',
	testPathIgnorePatterns: [
		'/.git/',
		'/node_modules/',
		'/packages/e2e-tests',
		'<rootDir>/.*/build/',
		'<rootDir>/.*/build-module/',
	],
	transformIgnorePatterns: [ 'node_modules/(?!(simple-html-tokenizer)/)' ],
};
