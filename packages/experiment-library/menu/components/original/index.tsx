/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { CheckboxControl } from '@safe-wordpress/components';
import { useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';
import {
	select as doSelect,
	useDispatch,
	useSelect,
} from '@safe-wordpress/data';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { filter, map } from 'lodash';
import { MenuSearcher } from '@nab/components';
import { createAlternative } from '@nab/utils';

import type { Alternative, ExperimentEditProps } from '@nab/types';

// NOTE. Dependency loop with @nab package.
import type { store as editorStore } from '@nab/editor';
const NAB_EDITOR = 'nab/editor' as unknown as typeof editorStore;

/**
 * Internal dependencies
 */
import './style.scss';
import type { ControlAttributes } from '../../types';

export type OriginalProps = ExperimentEditProps< ControlAttributes >;

export const Original = ( {
	attributes,
	setAttributes,
}: OriginalProps ): JSX.Element => {
	const isPaused = useIsPaused();
	const toggleExistingMenu = useExistingMenuToggler( setAttributes );

	return (
		<div className="nab-original-menu-alternative">
			<div className="nab-original-menu-alternative__selector">
				<MenuSearcher
					value={ attributes.menuId }
					onChange={ ( value ) => setAttributes( { menuId: value } ) }
				/>
			</div>
			<div
				className={ classnames( {
					'nab-original-menu-alternative__existing-content': true,
					'nab-original-menu-alternative__existing-content--is-disabled':
						isPaused,
				} ) }
			>
				<CheckboxControl
					label={ _x(
						'Test against already-existing menus',
						'command',
						'nelio-ab-testing'
					) }
					disabled={ isPaused }
					checked={ !! attributes.testAgainstExistingMenu }
					onChange={ toggleExistingMenu }
				/>
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useIsPaused = () =>
	useSelect( ( select ) =>
		`${ select( NAB_EDITOR ).getExperimentAttribute( 'status' ) }`.includes(
			'paused'
		)
	);

const useExistingMenuToggler = (
	setAttributes: (
		props: Partial< Pick< ControlAttributes, 'testAgainstExistingMenu' > >
	) => void
) => {
	const [ prevAlts, setPrevAlts ] = useState( [ createAlternative() ] );
	const { replaceAlternatives } = useDispatch( NAB_EDITOR );
	return ( checked: boolean ) => {
		const alts = filter(
			doSelect( NAB_EDITOR ).getAlternatives(),
			( { id }: Alternative ) => 'control' !== id
		);
		void replaceAlternatives( map( alts, 'id' ), prevAlts );
		setPrevAlts( alts );
		setAttributes( {
			testAgainstExistingMenu: checked ? true : undefined,
		} );
	};
};
