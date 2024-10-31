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
		screen: 'results',
		questions,
		walkthrough,
	} );
} //end renderHelp()

const questions = [
	{
		label: _x(
			'Do I need a minimum number of visits to compute the results?',
			'text',
			'nelio-ab-testing'
		),
		link: _x(
			'https://neliosoftware.com/testing/help/minimum-number-of-visits-to-compute-the-results/',
			'text',
			'nelio-ab-testing'
		),
	},
	{
		label: _x(
			'How does Nelio A/B Testing decide on a winning variant?',
			'text',
			'nelio-ab-testing'
		),
		link: _x(
			'https://neliosoftware.com/testing/help/how-nelio-ab-testing-decides-on-a-winning-variant/',
			'text',
			'nelio-ab-testing'
		),
	},
];

const walkthrough: ReadonlyArray< TutorialStep > = [
	{
		title: _x( 'Test Results', 'text', 'nelio-ab-testing' ),
		intro: _x(
			'Welcome to the Results screen. Here you can look the results of a finished test or monitor the progress of a running test.',
			'user',
			'nelio-ab-testing'
		),
	},
	{
		title: _x( 'Test Results', 'text', 'nelio-ab-testing' ),
		intro: _x(
			'While the test is running, you’ll be able to temporarily “Pause” it (so that you can tweak it if you need to) or “Stop” it completely using the action buttons found in the header.',
			'user',
			'nelio-ab-testing'
		),
		element: () =>
			document.querySelector( '.nab-results-experiment-header' ),
	},
	{
		title: _x( 'Overview', 'text', 'nelio-ab-testing' ),
		intro: _x(
			'Here you’ll be able to quickly identify the status of your test. Depending on the collected data, one of the variants might be clearly better than the rest or not. Keep an eye on this section to decide whether you should keep a test running or not. If your test has more than one goal, you can also switch the active goal and look at the test results from that goal’s perspective.',
			'user',
			'nelio-ab-testing'
		),
		element: () =>
			document.querySelector( '.nab-experiment-result-summary' ),
	},
	{
		title: _x( 'Graphics', 'text', 'nelio-ab-testing' ),
		intro: _x(
			'Nelio A/B Testing’s graphics allow you to quickly figure out how the test is performing.',
			'user',
			'nelio-ab-testing'
		),
		element: () => document.querySelector( '.nab-evolution-section' ),
	},
	{
		title: _x( 'Graphics', 'text', 'nelio-ab-testing' ),
		intro: _x(
			'These two graphics show each variant’s conversion rate and identify which one (if any) is the best.',
			'user',
			'nelio-ab-testing'
		),
		element: () =>
			document.querySelector(
				'.nab-evolution-section__comparison-and-improvement-graphics'
			),
	},
	{
		title: _x( 'Variants', 'text', 'nelio-ab-testing' ),
		intro: _x(
			'You can also look at each variant’s concrete figures in the “Control Version and Variants” section. Here you may also find some additional actions like viewing a variant’s “Heatmap” (available to subscribers on certain test types only) or “Apply” a variant and overwrite the tested element with it.',
			'user',
			'nelio-ab-testing'
		),
		element: () => document.querySelector( '.nab-alternative-section' ),
	},
	{
		title: _x( 'And more!', 'text', 'nelio-ab-testing' ),
		intro: _x(
			'Some additional information about your test you’ll find in this screen include: the conversion actions you added in each goal, the scope of test, and any segmentation rules you may have defined.',
			'user',
			'nelio-ab-testing'
		),
	},
];
