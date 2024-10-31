/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { appendContextualHelp } from '@nab/components';

export function renderHelp(): void {
	appendContextualHelp( {
		screen: 'account',
		questions,
	} );
} //end renderHelp()

const questions = [
	{
		label: _x(
			'How do I change my payment details?',
			'text',
			'nelio-ab-testing'
		),
		link: _x(
			'https://neliosoftware.com/testing/help/how-do-i-change-my-payment-details/',
			'text',
			'nelio-ab-testing'
		),
	},
	{
		label: _x(
			'What if my monthly quota of page views gets exhausted?',
			'text',
			'nelio-ab-testing'
		),
		link: _x(
			'https://neliosoftware.com/testing/help/what-if-my-monthly-quota-gets-exhausted/',
			'text',
			'nelio-ab-testing'
		),
	},
];
