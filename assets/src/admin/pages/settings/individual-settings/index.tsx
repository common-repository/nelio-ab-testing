/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { dispatch } from '@safe-wordpress/data';
import { render } from '@safe-wordpress/element';

/**
 * Internal dependencies
 */
import { store as NAB_SETTINGS } from './store';
import { fields } from './fields';
import type { FieldId, Attributes } from './store/types';

type Settings = {
	readonly attributes: Attributes;
	readonly component: string;
	readonly name: FieldId;
	readonly value: string;
};

export function initField( id: string, settings: Settings ): void {
	const { component } = settings;
	const Component = fields[ component ];
	if ( ! Component ) {
		return;
	} //end if

	const node = document.getElementById( id );
	if ( ! node ) {
		return;
	} //end if

	const { name, value, attributes } = settings;
	const { setValue, setAttributes } = dispatch( NAB_SETTINGS );

	void setValue( name, value );
	void setAttributes( name, attributes );

	render( <Component name={ name } />, node );
} //end initField()
