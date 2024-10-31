/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { TextControl } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { useEffect } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { MenuSearcher } from '@nab/components';
import type { ExperimentEditProps } from '@nab/types';

/**
 * Internal dependencies
 */
import type { ControlAttributes, AlternativeAttributes } from '../../types';

export type AlternativeProps = ExperimentEditProps< AlternativeAttributes > & {
	readonly placeholder?: string;
};

// NOTE. Dependency loop with @nab package.
import type { store as editorStore } from '@nab/editor';
const NAB_EDITOR = 'nab/editor' as unknown as typeof editorStore;

export const Alternative = ( {
	attributes,
	disabled,
	placeholder = _x( 'Describe your variant…', 'user', 'nelio-ab-testing' ),
	setAttributes,
}: AlternativeProps ): JSX.Element => {
	const isExistingMenu = useExistingMenu();

	useEffect( () => {
		setAttributes( {
			isExistingMenu: isExistingMenu ? true : undefined,
		} );
	}, [ isExistingMenu ] );

	return isExistingMenu ? (
		<MenuSearcher
			disabled={ disabled }
			value={ attributes.menuId }
			onChange={ ( value ) => setAttributes( { menuId: value } ) }
			placeholder={ _x( 'Select variant…', 'user', 'nelio-ab-testing' ) }
		/>
	) : (
		<TextControl
			disabled={ disabled }
			value={ attributes.name }
			onChange={ ( value ) => setAttributes( { name: value } ) }
			placeholder={ placeholder }
		/>
	);
};

// =====
// HOOKS
// =====

const useExistingMenu = () =>
	!! useControl()?.attributes.testAgainstExistingMenu;

const useControl = () =>
	useSelect( ( select ) =>
		select( NAB_EDITOR ).getAlternative< ControlAttributes >( 'control' )
	);
