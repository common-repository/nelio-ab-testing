/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	Button,
	ExternalLink,
	TextareaControl,
	TextControl,
} from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';
import { isEmail } from '@safe-wordpress/url';
import { addFreeTracker } from '@nab/utils';

/**
 * Internal dependencies
 */
import type { State, Submission } from './types';

export type ContactFormProps = {
	readonly attributes: State;
	readonly closeForm: () => void;
	readonly onSubmit: ( submission: Submission ) => void;
	readonly setAttributes: ( attrs: Partial< State > ) => void;
};

export const ContactForm = ( {
	attributes: {
		description = '',
		email = '',
		isTicketSubmitting = false,
		submissionStatus = 'none',
	},
	closeForm,
	onSubmit,
	setAttributes,
}: ContactFormProps ): JSX.Element => {
	const isSubmitDisabled =
		isTicketSubmitting || ! description.trim() || ! isEmail( email );
	const reset = () => {
		setAttributes( {
			email: '',
			description: '',
			isTicketSubmitting: false,
			submissionStatus: 'none',
			mode: 'questions',
		} );
		closeForm();
	};

	if ( 'error' === submissionStatus ) {
		return (
			<div className="nab-contextual-help__content">
				<h2 className="nab-contextual-help__title">
					{ _x( 'Error', 'text', 'nelio-ab-testing' ) }
				</h2>
				<p>
					{ _x(
						'Something went wrong and the ticket couldn’t be created.',
						'text',
						'nelio-ab-testing'
					) }{ ' ' }
					<ExternalLink
						href={ addFreeTracker(
							_x(
								'https://neliosoftware.com/testing/contact/',
								'text',
								'nelio-ab-testing'
							)
						) }
						onClick={ reset }
					>
						{ _x(
							'Open ticket in our website',
							'user',
							'nelio-ab-testing'
						) }
					</ExternalLink>
				</p>
			</div>
		);
	} //end if

	if ( 'success' === submissionStatus ) {
		return (
			<div className="nab-contextual-help__content">
				<h2 className="nab-contextual-help__title">
					{ _x(
						'Ticket Successfully Submitted',
						'text',
						'nelio-ab-testing'
					) }
				</h2>
				<p>
					{ _x(
						'Your ticket has been successfully created. We’ll get back to you as soon as possible.',
						'user',
						'nelio-ab-testing'
					) }
				</p>
				<Button className="button" onClick={ reset }>
					{ _x( 'OK', 'command', 'nelio-ab-testing' ) }
				</Button>
			</div>
		);
	} //end if

	return (
		<div className="nab-contextual-help__content">
			<h2 className="nab-contextual-help__title">
				{ _x( 'Contact Us', 'user', 'nelio-ab-testing' ) }
			</h2>

			<TextareaControl
				label={ _x( 'Description:', 'text', 'nelio-ab-testing' ) }
				disabled={ isTicketSubmitting }
				placeholder={ _x(
					'Tell us what’s going on',
					'text',
					'nelio-ab-testing'
				) }
				value={ description }
				onChange={ ( value ) =>
					setAttributes( { description: value } )
				}
			/>

			<TextControl
				label={ _x( 'Email:', 'text', 'nelio-ab-testing' ) }
				disabled={ isTicketSubmitting }
				value={ email }
				onChange={ ( value ) => setAttributes( { email: value } ) }
			/>

			<div className="nab-contextual-help__actions">
				<Button
					className="button"
					onClick={ () => setAttributes( { mode: 'questions' } ) }
					disabled={ isTicketSubmitting }
				>
					{ _x( 'Back', 'command', 'nelio-ab-testing' ) }
				</Button>{ ' ' }
				<Button
					disabled={ isSubmitDisabled }
					className={ `button${
						isSubmitDisabled ? '' : ' button-primary'
					}` }
					onClick={ () => {
						setAttributes( { isTicketSubmitting: true } );
						onSubmit( {
							email,
							description,
							success: () =>
								setAttributes( {
									isTicketSubmitting: false,
									submissionStatus: 'success',
								} ),
							error: () =>
								setAttributes( {
									isTicketSubmitting: false,
									submissionStatus: 'error',
								} ),
						} );
					} }
				>
					{ isTicketSubmitting
						? _x( 'Submitting…', 'text', 'nelio-ab-testing' )
						: _x( 'Submit', 'command', 'nelio-ab-testing' ) }
				</Button>
			</div>
		</div>
	);
};
