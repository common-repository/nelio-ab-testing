/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { appendContextualHelp } from '@nab/components';

export function renderHelp(): void {
	appendContextualHelp( {
		screen: 'settings',
		questions,
	} );
} //end renderHelp()

const questions = [
	{
		label: _x(
			'After starting an A/B test, some parameters appear in my URLs. What are they?',
			'text',
			'nelio-ab-testing'
		),
		link: _x(
			'https://neliosoftware.com/testing/help/after-starting-an-ab-test-some-parameters-appear-in-my-urls-what-are-they/',
			'text',
			'nelio-ab-testing'
		),
	},
	{
		label: _x(
			'How can I hide A/B testing parameters from my URLs?',
			'text',
			'nelio-ab-testing'
		),
		link: _x(
			'https://neliosoftware.com/testing/help/how-can-i-hide-ab-testing-parameters-from-my-urls/',
			'text',
			'nelio-ab-testing'
		),
	},
	{
		label: _x(
			'How do I purchase additional quota?',
			'text',
			'nelio-ab-testing'
		),
		link: _x(
			'https://neliosoftware.com/testing/help/how-to-purchase-quota/',
			'text',
			'nelio-ab-testing'
		),
	},
];
