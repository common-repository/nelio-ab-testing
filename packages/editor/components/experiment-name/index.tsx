/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PlainText } from '@safe-wordpress/block-editor';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';
import { useExperimentAttribute } from '../hooks';

export const ExperimentName = (): JSX.Element => {
	const [ name, setName ] = useExperimentAttribute( 'name' );
	return (
		<div className="nab-experiment-title">
			<PlainText
				value={ name }
				className="nab-experiment-title__edit"
				placeholder={ _x(
					'Name your test…',
					'user',
					'nelio-ab-testing'
				) }
				onChange={ setName }
			/>
		</div>
	);
};
