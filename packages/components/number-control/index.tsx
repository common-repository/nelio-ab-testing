/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import type { Maybe } from '@nab/types';

export type NumberControlProps = {
	readonly id?: string;
	readonly className?: string;
	readonly value?: number | string;
	readonly onChange: ( val?: number ) => void;
	readonly min?: number;
	readonly max?: number;
	readonly disabled?: boolean;
};

// NOTE. NumberControl should come from @wordpress/components.
export const NumberControl = ( {
	id,
	className,
	value,
	onChange,
	min = -Infinity,
	max = Infinity,
	disabled,
}: NumberControlProps ): JSX.Element => (
	<input
		id={ id }
		className={ className }
		type="number"
		disabled={ disabled }
		min={ min }
		max={ max }
		defaultValue={ numerize( value ) }
		onChange={ ( ev ) => {
			const newValue = Number.parseInt( ev.target.value ) || undefined;
			return undefined === newValue || newValue < min || max < newValue
				? onChange( undefined )
				: onChange( newValue );
		} }
	/>
);

// =======
// HELPERS
// =======

function numerize( value: NumberControlProps[ 'value' ] ): Maybe< number > {
	if ( 'number' === typeof value ) {
		return value;
	} //end if

	if ( 'string' !== typeof value ) {
		return undefined;
	} //end if

	const num = Number.parseInt( value );
	return isNaN( num ) ? undefined : num;
} //end numerize()
