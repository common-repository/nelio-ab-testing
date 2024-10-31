/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Modal, TextareaControl } from '@safe-wordpress/components';
import { useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';
import type { ExperimentEditProps } from '@nab/types';

/**
 * External dependencies
 */
import { trim } from 'lodash';

/**
 * Internal dependencies
 */
import './style.scss';
import type { ControlAttributes } from '../../types';

export const Original = ( {
	attributes,
	setAttributes,
}: ExperimentEditProps< ControlAttributes > ): JSX.Element => {
	const [ isModalVisible, setVisibility ] = useState( false );
	const [ editingCode, setEditingCode ] = useState( '' );
	const { code = '' } = attributes;

	const isDirty = trim( code ) !== trim( editingCode );

	const open = () => {
		setEditingCode( code );
		setVisibility( true );
	};
	const close = () => {
		setVisibility( false );
	};
	const save = () => {
		close();
		setAttributes( {
			code: ! trim( editingCode ) ? undefined : trim( editingCode ),
		} );
	};

	return (
		<div>
			<div className="nab-javascript-original-version">
				<p>
					{ _x(
						'Current look and feel',
						'text',
						'nelio-ab-testing'
					) }
				</p>
				<div className="nab-javascript-original-version__actions">
					<Button variant="link" onClick={ open }>
						{ _x(
							'Customize Tracking',
							'command',
							'nelio-ab-testing'
						) }
					</Button>
				</div>
			</div>
			{ isModalVisible && (
				<Modal
					className="nab-javascript-original-version__modal"
					title={ _x(
						'Tracking Customization',
						'text',
						'nelio-ab-testing'
					) }
					isDismissible={ false }
					onRequestClose={ () => void null }
					shouldCloseOnClickOutside={ false }
				>
					<div className="nab-javascript-original-version__modal-content">
						<TextareaControl
							placeholder={ placeholder }
							className="nab-javascript-original-version__editor"
							onChange={ setEditingCode }
							value={ editingCode }
						/>
					</div>
					<div className="nab-javascript-original-version__modal-actions">
						<Button variant="secondary" onClick={ close }>
							{ isDirty
								? _x(
										'Discard Changes',
										'command',
										'nelio-ab-testing'
								  )
								: _x( 'Close', 'command', 'nelio-ab-testing' ) }
						</Button>
						<Button
							variant="primary"
							onClick={ save }
							disabled={ ! isDirty }
						>
							{ _x( 'Save', 'command', 'nelio-ab-testing' ) }
						</Button>
					</div>
				</Modal>
			) }
		</div>
	);
};

// =======
// HELPERS
// =======

const placeholder = [
	_x(
		'Customize when the plugin should track page views in the control version. If left empty, Nelio A/B Testing will start tracking as soon as the page has been loaded.',
		'user',
		'nelio-ab-testing'
	),
	'\n',
	'\n- ',
	_x( 'Run callback when dom is ready', 'text', 'nelio-ab-testing' ),
	'\n  utils.domReady( callback );',
	'\n',
	'\n- ',
	_x( 'Show variant:', 'text', 'nelio-ab-testing' ),
	'\n  utils.showContent();',
	'\n',
	'\n- ',
	_x( 'Show variant and track events', 'text', 'nelio-ab-testing' ),
	'\n  done();',
].join( '' );
