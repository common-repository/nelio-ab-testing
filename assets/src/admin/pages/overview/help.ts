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
		screen: 'overview',
		questions,
		walkthrough,
	} );
} //end renderHelp()

const questions = [
	{
		label: _x( 'What is an A/B Test?', 'text', 'nelio-ab-testing' ),
		link: _x(
			'https://neliosoftware.com/testing/help/what-is-an-ab-test/',
			'text',
			'nelio-ab-testing'
		),
	},
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
			'How does Nelio A/B Testing work?',
			'text',
			'nelio-ab-testing'
		),
		link: _x(
			'https://neliosoftware.com/testing/help/how-does-nelio-ab-testing-work/',
			'text',
			'nelio-ab-testing'
		),
	},
];

const walkthrough: ReadonlyArray< TutorialStep > = [
	{
		title: _x( 'Test Overview', 'text', 'nelio-ab-testing' ),
		intro: _x(
			'Welcome to Nelio A/B Testing’s Overview screen. Here you’ll find the most relevant information about your running tests.',
			'user',
			'nelio-ab-testing'
		),
	},
	{
		title: _x( 'Tests', 'text', 'nelio-ab-testing' ),
		intro: _x(
			'After creating and starting a new test, it’ll show up here while it’s running. For each of them, you’ll have a quick summary about how it’s performing, including its quota usage, days running, conversion rates, status, and so on. You can click on any test to open the results page.',
			'user',
			'nelio-ab-testing'
		),
		element: () =>
			document.querySelector(
				'.nab-experiments, .nab-heatmaps, .nab-no-experiments'
			),
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
