/**
 * WordPress dependencies
 */
import { select } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { appendContextualHelp } from '@nab/components';
import { store as NAB_DATA } from '@nab/data';
import { store as NAB_EXPERIMENTS } from '@nab/experiments';
import type { Question, TutorialStep } from '@nab/components';

/**
 * Internal dependencies
 */
import { store as NAB_EDITOR } from './store';

export function renderHelp(): void {
	const typeName = select( NAB_EDITOR ).getExperimentType();
	appendContextualHelp( {
		screen: `experiment-list:${ typeName }`,
		questions,
		walkthrough: getWalkthrough( typeName ),
	} );
} //end renderHelp()

const questions: ReadonlyArray< Question > = [
	{
		label: _x(
			'What is the original page or post of a test?',
			'text',
			'nelio-ab-testing'
		),
		link: _x(
			'https://neliosoftware.com/testing/help/what-is-the-original-page-or-post-of-a-test/',
			'text',
			'nelio-ab-testing'
		),
	},
	{
		label: _x(
			'Why don’t all my posts/pages appear in the selection list when I’m creating a new test?',
			'text',
			'nelio-ab-testing'
		),
		link: _x(
			'https://neliosoftware.com/testing/help/why-dont-all-my-posts-appear-in-the-selection-list/',
			'text',
			'nelio-ab-testing'
		),
	},
	{
		label: _x(
			'What is a conversion and what counts as one?',
			'text',
			'nelio-ab-testing'
		),
		link: _x(
			'https://neliosoftware.com/testing/help/what-is-a-conversion/',
			'text',
			'nelio-ab-testing'
		),
	},
	{
		label: _x(
			'How can I track conversions occurring in third-party websites?',
			'text',
			'nelio-ab-testing'
		),
		link: _x(
			'https://neliosoftware.com/testing/help/how-can-i-track-conversions-occurring-in-third-party-websites/',
			'text',
			'nelio-ab-testing'
		),
	},
];

// =======
// HELPERS
// =======

function getWalkthrough( typeName: string ): ReadonlyArray< TutorialStep > {
	const type = select( NAB_EXPERIMENTS ).getExperimentType( typeName );
	const { isSubscribedTo } = select( NAB_DATA );

	return [
		{
			title: _x( 'Test Editor', 'text', 'nelio-ab-testing' ),
			intro: _x(
				'Welcome to the Test Editor. Here you’ll be able to select the element you want to test and create one or more variants to find out which one converts the most. As you can see, it’s quite similar to WordPress’ Block Editor: there’s a header, a sidebar, and a main area.',
				'user',
				'nelio-ab-testing'
			),
		},
		{
			title: _x( 'Name', 'text', 'nelio-ab-testing' ),
			intro: _x(
				'You’ll notice that all test types have a similar user interface. When creating a new test, you’ll first have to name it. Just type in a descriptive name that helps you identify the test in the future.',
				'user',
				'nelio-ab-testing'
			),
			element: () => document.querySelector( '.nab-experiment-title' ),
		},
		{
			title: _x( 'Variants', 'text', 'nelio-ab-testing' ),
			intro: _x(
				'Next, there’s a “Control Version and Variants” section. Use it to (a) identify the element you want to test and (b) create one or more split testing variants.',
				'user',
				'nelio-ab-testing'
			),
			element: () =>
				document.querySelector(
					'.nab-edit-experiment__alternative-section'
				),
		},
		{
			title: _x( 'Variant A', 'text', 'nelio-ab-testing' ),
			intro: type?.help?.original ?? '',
			element: () =>
				document.querySelector(
					'.nab-alternative-list__alternative--original'
				),
			active: () => !! type?.help?.original,
		},
		{
			title: _x( 'Variant B', 'text', 'nelio-ab-testing' ),
			intro: type?.help?.alternative ?? '',
			element: () =>
				document.querySelector(
					'.nab-alternative-list__alternative:not(.nab-alternative-list__alternative--original)'
				),
			active: () =>
				!! type?.help?.alternative &&
				!! document.querySelector(
					'.nab-alternative-list__alternative:not(.nab-alternative-list__alternative--original)'
				),
		},
		{
			title: _x( 'Goals', 'text', 'nelio-ab-testing' ),
			intro: _x(
				'Split tests help you to improve the conversion rate of your website. Here you can set up the goals a test pursues and the specific conversion actions that, when performed by a visitor, will trigger a conversion.',
				'user',
				'nelio-ab-testing'
			),
			element: () =>
				document.querySelector( '.nab-edit-experiment__goal-section' ),
			active: () => ! type?.supports?.automaticGoalSetup,
		},
		{
			title: _x( 'Goals', 'text', 'nelio-ab-testing' ),
			intro: _x(
				'Split tests help you to improve the conversion rate of your website. With this type of test, the conversion goal and conversion action that might trigger a conversion is already set up by Nelio A/B Testing.',
				'user',
				'nelio-ab-testing'
			),
			element: () =>
				document.querySelector( '.nab-edit-experiment__goal-section' ),
			active: () => !! type?.supports?.automaticGoalSetup,
		},
		{
			title: _x( 'Actions', 'text', 'nelio-ab-testing' ),
			intro: _x(
				'Use these buttons to add the specific conversion actions that might trigger a conversion like, for example, “visiting a page” or “clicking an element on the page.”',
				'user',
				'nelio-ab-testing'
			),
			element: () =>
				document.querySelector( '.nab-conversion-action-type-list' ),
			active: () =>
				!! document.querySelector( '.nab-conversion-action-type-list' ),
		},
		{
			title: _x( 'Segmentation', 'text', 'nelio-ab-testing' ),
			intro: _x(
				'If you subscribe to Nelio A/B Testing, you’ll be able to segment your visitors into groups and specify who may or may not participate in a test.',
				'user',
				'nelio-ab-testing'
			),
			element: () =>
				document.querySelector(
					'.nab-edit-experiment__segmentation-section'
				),
			active: () =>
				!! document.querySelector(
					'.nab-edit-experiment-segmentation-section__content--free'
				),
		},
		{
			title: _x( 'Segmentation', 'text', 'nelio-ab-testing' ),
			intro: _x(
				'You can segment your audience into different groups and look at the performance of your split test with respect to each group. You can also use segmentation to limit who may or may not participate in a test.',
				'user',
				'nelio-ab-testing'
			),
			element: () =>
				document.querySelector(
					'.nab-edit-experiment__segmentation-section'
				),
			active: () =>
				! document.querySelector(
					'.nab-edit-experiment-segmentation-section__content--free'
				),
		},
		{
			title: _x( 'Status', 'text', 'nelio-ab-testing' ),
			intro: _x(
				'Here you can see the current status of your test: once it’s “Ready,” you’ll be able to start it. Also, if you subscribe to our Professional plan, you’ll be able to schedule when a test should be started, as well as to define if and when it should be automatically stopped.',
				'user',
				'nelio-ab-testing'
			),
			element: () =>
				document.querySelector( '.nab-experiment-management' ),
			active: () => ! isSubscribedTo( 'professional' ),
		},
		{
			title: _x( 'Status', 'text', 'nelio-ab-testing' ),
			intro: _x(
				'Here you can see the current status of your test: once it’s “Ready,” you’ll be able to start it. You can also schedule when the test should be started, as well as define a stop condition to automatically stop the test.',
				'user',
				'nelio-ab-testing'
			),
			element: () =>
				document.querySelector( '.nab-experiment-management' ),
			active: () => isSubscribedTo( 'professional' ),
		},
		{
			title: _x( 'Scope', 'text', 'nelio-ab-testing' ),
			intro: _x(
				'By default, this type of test will show up on all pages of your website. You can limit its scope by specifying the URLs in which the test should be visible.',
				'user',
				'nelio-ab-testing'
			),
			element: () => document.querySelector( '.nab-experiment-scope' ),
			active: () =>
				'custom' === type?.supports?.scope ||
				'custom-with-tested-post' === type?.supports?.scope,
		},
		{
			title: _x( 'Scope', 'text', 'nelio-ab-testing' ),
			intro: _x(
				'This type of test applies to a specific element of your website, be it a page, a post, or what. If you enable “Global Consistency,” our plugin will also load the appropriate variant on any page in which the tested element (i.e. its title, featured image, and so on) shows up.',
				'user',
				'nelio-ab-testing'
			),
			element: () => document.querySelector( '.nab-experiment-scope' ),
			active: () =>
				'tested-post-with-consistency' === type?.supports?.scope,
		},
	];
} //end getWalkthrough()
