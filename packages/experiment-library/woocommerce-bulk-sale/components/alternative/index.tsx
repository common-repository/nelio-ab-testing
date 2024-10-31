/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { CheckboxControl, TextControl } from '@safe-wordpress/components';
import { useEffect, useState } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { ExperimentEditProps } from '@nab/types';

/**
 * Internal dependencies
 */
import type { AlternativeAttributes } from '../../types';

export const Alternative = (
	props: ExperimentEditProps< AlternativeAttributes >
): JSX.Element => {
	const { attributes, disabled, setAttributes } = props;
	const { name, overwritesExistingSalePrice, discount } = attributes;
	const [ value, setValue ] = useState( `${ discount }` );

	useEffect( () => {
		const newName = getName( discount );
		if ( name !== newName ) {
			setAttributes( { name: newName } );
		} //end if
	}, [ discount ] );

	return (
		<>
			<TextControl
				label={ _x( 'Discount (%)', 'text', 'nelio-ab-testing' ) }
				disabled={ disabled }
				value={ value }
				type="number"
				min={ 0 }
				max={ 100 }
				step={ 1 }
				onChange={ ( v ) => {
					v = v.replace( /[^0-9]/g, '' );
					let aux: number;
					aux = Number.parseInt( v );
					aux = isNaN( aux ) ? 0 : aux;
					aux = aux < 0 ? 0 : aux;
					aux = aux > 100 ? 100 : aux;
					v = v.length ? `${ aux }` : '';
					setValue( v );
					setAttributes( {
						discount: aux,
						name: getName( aux ),
					} );
				} }
			/>
			<CheckboxControl
				label={ _x(
					'Overwrite existing sale prices (if any) when applying tested discount',
					'command',
					'nelio-ab-testing'
				) }
				checked={ !! overwritesExistingSalePrice }
				onChange={ ( v ) =>
					setAttributes( { overwritesExistingSalePrice: v } )
				}
			/>
		</>
	);
};

// =======
// HELPERS
// =======

const getName = ( discount: number ) =>
	sprintf(
		/* translators: 1 -> discount percentage */
		_x( '%1$d%% discount', 'text', 'nelio-ab-testing' ),
		discount
	);
