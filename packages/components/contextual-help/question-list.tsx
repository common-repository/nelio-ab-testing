/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, ExternalLink } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import type { Question } from './types';

export type QuestionListProps = {
	readonly questions: ReadonlyArray< Question >;
	readonly onContactUs: () => void;
	readonly runWalkthrough?: () => void;
};

export const QuestionList = ( {
	questions,
	onContactUs,
	runWalkthrough,
}: QuestionListProps ): JSX.Element => (
	<div className="nab-contextual-help__content">
		<h2 className="nab-contextual-help__title">
			{ _x( 'Help', 'text', 'nelio-ab-testing' ) }
		</h2>
		<p>
			{ _x(
				'Here you have some resources that might help you:',
				'user',
				'nelio-ab-testing'
			) }
		</p>
		<ul className="nab-contextual-help__questions">
			{ questions.map( ( { link, label } ) => (
				<li key={ link }>
					<ExternalLink href={ link }>{ label }</ExternalLink>
				</li>
			) ) }
		</ul>
		{ runWalkthrough && (
			<p className="nab-contextual-help__tour">
				<Button variant="primary" onClick={ runWalkthrough }>
					{ _x( 'Welcome Guide', 'text', 'nelio-ab-testing' ) }
				</Button>
			</p>
		) }
		<p>
			{ _x( 'Not finding what you need?', 'user', 'nelio-ab-testing' ) }{ ' ' }
			<Button variant="link" onClick={ onContactUs }>
				{ _x( 'Contact us', 'user', 'nelio-ab-testing' ) }
			</Button>
		</p>
	</div>
);
