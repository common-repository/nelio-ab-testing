/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { appendContextualHelp } from '@nab/components';
import type { TutorialStep } from '@nab/components';

export function renderHelp(): void {
	appendContextualHelp( {
		screen: 'experiment-list',
		questions,
		walkthrough,
	} );
} //end renderHelp()

const questions = [
	{
		label: _x( 'How do I create a test?', 'text', 'nelio-ab-testing' ),
		link: _x(
			'https://neliosoftware.com/testing/help/how-do-i-create-a-test/',
			'text',
			'nelio-ab-testing'
		),
	},
	{
		label: _x(
			'Why A/B testing my site is important?',
			'text',
			'nelio-ab-testing'
		),
		link: _x(
			'https://neliosoftware.com/testing/help/why-ab-testing-my-site/',
			'text',
			'nelio-ab-testing'
		),
	},
	{
		label: _x(
			'How long should I run a test?',
			'text',
			'nelio-ab-testing'
		),
		link: _x(
			'https://neliosoftware.com/testing/help/how-long-should-i-run-a-test/',
			'text',
			'nelio-ab-testing'
		),
	},
];

const walkthrough: ReadonlyArray< TutorialStep > = [
	{
		title: _x( 'Test List', 'text', 'nelio-ab-testing' ),
		intro: _x(
			'Welcome to your Tests screen. Here you can find and manage all the tests you create with Nelio A/B Testing.',
			'user',
			'nelio-ab-testing'
		),
	},
	{
		title: _x( 'Test List', 'text', 'nelio-ab-testing' ),
		intro: _x(
			'All your tests will show up here. If you hover on any of them, you’ll see actions like, for example, “Edit,” “Start,” or “Trash” a test.',
			'user',
			'nelio-ab-testing'
		),
		element: () => document.querySelector( '.wp-list-table' ),
	},
	{
		title: _x( 'Customization', 'text', 'nelio-ab-testing' ),
		intro: _x(
			'If you want to customize the look and feel of the test list, you can enable/disable columns or change the number of tests that will show up using the “Screen Options” tab in the upper right corner of your screen.',
			'user',
			'nelio-ab-testing'
		),
		element: () => document.querySelector( '#show-settings-link' ),
	},
	{
		title: _x( 'New Test', 'text', 'nelio-ab-testing' ),
		intro: _x(
			'You can create new tests using the “Add Test” button. Just click on it and then select the specific type of test you want to create, and you’ll be presented the test editor.',
			'user',
			'nelio-ab-testing'
		),
		element: () => document.querySelector( '.nab-add-test-title-action' ),
		active: () => !! document.querySelector( '.nab-add-test-title-action' ),
	},
	{
		title: _x( 'Quota', 'text', 'nelio-ab-testing' ),
		intro: _x(
			'When a test is running, it’ll track the behavior of your visitors. Every interaction will consume one quota unit. The quota bar always shows you the amount of avilable quota you have. As quota decreases, so will the bar.',
			'user',
			'nelio-ab-testing'
		),
		element: () => document.querySelector( '.nab-quota-meter' ),
	},
	{
		title: _x( 'Subscribe', 'text', 'nelio-ab-testing' ),
		intro: _x(
			'If you want more quota or you want to unlock all the premium features, please consider subscribing.',
			'user',
			'nelio-ab-testing'
		),
		element: () => document.querySelector( '.nab-subscribe-title-action' ),
		active: () =>
			!! document.querySelector( '.nab-subscribe-title-action' ),
	},
];
