/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dashicon, Dropdown } from '@safe-wordpress/components';
import { useInstanceId } from '@safe-wordpress/compose';
import { useState } from '@safe-wordpress/element';

/**
 * Internal dependencies
 */
import './style.scss';

import { useWalkthroughEffect } from './walkthrough';
import { QuestionList } from './question-list';
import { ContactForm } from './contact-form';

import type { Question, State, Submission, TutorialStep } from './types';

export type ContextualHelpProps = {
	readonly screen: string;
	readonly questions: ReadonlyArray< Question >;
	readonly walkthrough: ReadonlyArray< TutorialStep >;
	readonly onSubmitTicket: ( submission: Submission ) => void;
};

export const ContextualHelp = ( {
	screen,
	questions,
	walkthrough,
	onSubmitTicket,
}: ContextualHelpProps ): JSX.Element => {
	const instanceId = useInstanceId( ContextualHelp );
	const [ state, doSetState ] = useState< State >( {
		mode: 'questions',
		email: '',
		description: '',
		isTicketSubmitting: false,
		submissionStatus: 'none',
	} );

	const runWalkthrough = useWalkthroughEffect( screen, walkthrough );

	const setState = ( a: Partial< State > ) =>
		doSetState( { ...state, ...a } );
	const { mode } = state;

	return (
		<div className="nab-contextual-help__wrapper">
			<Dropdown
				placement="top-start"
				contentClassName="nab-contextual-help__dropdown"
				renderToggle={ ( { onToggle, isOpen } ) => (
					<>
						<Button
							id={ `nab-contextual-help__toggle-${ instanceId }` }
							className="nab-contextual-help__toggle"
							onClick={ onToggle }
							aria-expanded={ isOpen }
							aria-live="polite"
						>
							<Dashicon icon="editor-help" />
						</Button>
					</>
				) }
				renderContent={ ( { onToggle } ) =>
					'contact-form' === mode ? (
						<ContactForm
							attributes={ state }
							setAttributes={ setState }
							onSubmit={ onSubmitTicket }
							closeForm={ onToggle }
						/>
					) : (
						<QuestionList
							runWalkthrough={
								runWalkthrough
									? () => {
											onToggle();
											runWalkthrough();
									  }
									: undefined
							}
							questions={ questions }
							onContactUs={ () =>
								setState( {
									mode: 'contact-form',
									email: '',
									description: '',
								} )
							}
						/>
					)
				}
			/>
		</div>
	);
};
