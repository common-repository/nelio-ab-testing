/**
 * WordPress dependencies
 */
import { select, dispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { isFunction } from 'lodash';
import { isValidIcon } from '@nab/utils';
import type {
	ConversionActionType,
	ConversionActionTypeName,
	Dict,
	Maybe,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { store as NAB_ACTIONS } from '../store';

/**
 * Registers a new conversion action provided a unique name and an object defining
 * its behavior. Once registered, the action is made available as an option to any
 * interface where conversion actions are implemented.
 *
 * @param {string} name     ConversionAction name.
 * @param {Object} settings ConversionAction settings.
 *
 * @return {?Object} The conversion action, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
export function registerConversionActionType< T extends Dict = Dict >(
	name: ConversionActionTypeName,
	settings: Partial< ConversionActionType< T > >
): Maybe< ConversionActionType< T > > {
	if ( typeof name !== 'string' ) {
		// eslint-disable-next-line
		console.error( 'Conversion action names must be strings.' );
		return undefined;
	} //end if

	if ( ! /^[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*$/.test( name ) ) {
		// eslint-disable-next-line
		console.error(
			// eslint-disable-line
			'Conversion action names must contain a namespace prefix, include only lowercase alphanumeric characters or dashes, and start with a letter. Example: my-plugin/my-custom-conversion-action'
		);
		return undefined;
	} //end if

	if ( select( NAB_ACTIONS ).getConversionActionType( name ) ) {
		// eslint-disable-next-line
		console.error( `Conversion action “${ name }” is already registered.` );
		return undefined;
	} //end if

	if ( ! hasTitle( settings ) ) {
		// eslint-disable-next-line
		console.error(
			`Conversion action “${ name }” should specify a title.`
		);
		return undefined;
	} //end if

	if ( ! hasDescription( settings ) ) {
		// eslint-disable-next-line
		console.error(
			`Conversion action “${ name }” should specify a description.`
		);
		return undefined;
	} //end if

	if ( ! hasAttributes( settings ) ) {
		// eslint-disable-next-line
		console.error(
			`Conversion action “${ name }” should specify its default attributes.`
		);
		return undefined;
	} //end if

	if ( ! hasScope( settings ) ) {
		// eslint-disable-next-line
		console.error(
			`Conversion action “${ name }” should specify its default scope.`
		);
		return undefined;
	} //end if

	if ( ! hasIcon( settings ) ) {
		// eslint-disable-next-line
		console.error( `The conversion action “${ name }” must have an icon.` );
		return undefined;
	} //end if

	if ( ! isValidIcon( settings.icon ) ) {
		// eslint-disable-next-line
		console.error(
			'The icon passed is invalid. The icon should be an element or a function.'
		);
		return undefined;
	} //end if

	if ( ! hasView( settings ) ) {
		// eslint-disable-next-line
		console.error( 'The “view” property must be a valid function.' );
		return undefined;
	} //end if

	if ( ! hasEdit( settings ) ) {
		// eslint-disable-next-line
		console.error( 'The “edit” property must be a valid function.' );
		return undefined;
	} //end if

	const cat = { name, ...settings };
	void dispatch( NAB_ACTIONS ).addConversionActionTypes( cat );
	return cat as ConversionActionType< T >;
} //end registerConversionActionType()

// =======
// HELPERS
// =======

const hasTitle = < T extends Dict = Dict >(
	x: Partial< ConversionActionType< T > >
): x is { title: ConversionActionType< T >[ 'title' ] } =>
	'string' === typeof x.title && !! x.title;

const hasDescription = < T extends Dict = Dict >(
	x: Partial< ConversionActionType< T > >
): x is { description: ConversionActionType< T >[ 'description' ] } =>
	'string' === typeof x.description && !! x.description;

const hasAttributes = < T extends Dict >(
	x: Partial< ConversionActionType< T > >
): x is { attributes: ConversionActionType< T >[ 'attributes' ] } =>
	!! x.attributes;

const hasScope = < T extends Dict >(
	x: Partial< ConversionActionType< T > >
): x is { scope: ConversionActionType< T >[ 'scope' ] } => !! x.scope;

const hasIcon = < T extends Dict = Dict >(
	x: Partial< ConversionActionType< T > >
): x is { icon: ConversionActionType< T >[ 'icon' ] } => 'icon' in x;

const hasView = < T extends Dict = Dict >(
	x: Partial< ConversionActionType< T > >
): x is { view: ConversionActionType< T >[ 'view' ] } => isFunction( x.view );

const hasEdit = < T extends Dict = Dict >(
	x: Partial< ConversionActionType< T > >
): x is { edit: ConversionActionType< T >[ 'edit' ] } => isFunction( x.edit );
