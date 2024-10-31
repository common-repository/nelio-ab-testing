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
	Dict,
	Maybe,
	SegmentationRuleCategory,
	SegmentationRuleCategoryName,
	SegmentationRuleType,
	SegmentationRuleTypeName,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { store as NAB_SEGMENTS } from '../store';

/**
 * Registers a new segmentation rule provided a unique name and an object defining
 * its behavior. Once registered, the rule is made available as an option to any
 * interface where segmentation rules are implemented.
 *
 * @param {string} name     SegmentationRule name.
 * @param {Object} settings SegmentationRule settings.
 *
 * @return {?Object} The segmentation rule, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
export function registerSegmentationRuleType< T extends Dict = Dict >(
	name: SegmentationRuleTypeName,
	settings: Partial< SegmentationRuleType< T > >
): Maybe< SegmentationRuleType< T > > {
	if ( typeof name !== 'string' ) {
		// eslint-disable-next-line
		console.error( 'Segmentation rule names must be strings.' );
		return undefined;
	} //end if

	if ( ! /^[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*$/.test( name ) ) {
		// eslint-disable-next-line
		console.error(
			'Segmentation rule names must contain a namespace prefix, include only lowercase alphanumeric characters or dashes, and start with a letter. Example: my-plugin/my-custom-segmentation-rule'
		);
		return undefined;
	} //end if

	if ( select( NAB_SEGMENTS ).getSegmentationRuleType( name ) ) {
		// eslint-disable-next-line
		console.error( `Segmentation rule “${ name }” is already registered.` );
		return undefined;
	} //end if

	if ( ! hasAttributes( settings ) ) {
		// eslint-disable-next-line
		console.error(
			`Segmentation rule “${ name }” should specify its default attributes.`
		);
		return undefined;
	} //end if

	if ( ! hasIcon( settings ) ) {
		// eslint-disable-next-line
		console.error( `Segmentation rule “${ name }” must have an icon.` );
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

	if ( ! hasTitle( settings ) ) {
		// eslint-disable-next-line
		console.error( `Segmentation rule “${ name }” must have a title.` );
		return undefined;
	} //end if

	if ( ! hasCategory( settings ) ) {
		// eslint-disable-next-line
		console.error( `Segmentation rule “${ name }” must have a category.` );
		return undefined;
	} //end if

	if ( ! hasSingleton( settings ) ) {
		// eslint-disable-next-line
		console.error(
			`Segmentation rule “${ name }” must specify whether it’s singleton or not.`
		);
		return undefined;
	} //end if

	const srt = { name, ...settings };
	void dispatch( NAB_SEGMENTS ).addSegmentationRuleTypes( srt );
	return srt as SegmentationRuleType< T >;
} //end registerSegmentationRuleType()

/**
 * Registers a new segmentation rule category provided a unique name and an object defining
 * its settings. Once registered, the category is made available as an option to any
 * interface where segmentation rules are implemented.
 *
 * @param {string} name     SegmentationRuleCategory name.
 * @param {Object} settings SegmentationRuleCategory settings.
 *
 * @return {?Object} The segmentation rule category, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
export function registerSegmentationRuleTypeCategory(
	name: SegmentationRuleCategoryName,
	settings: Omit< SegmentationRuleCategory, 'name' >
): Maybe< SegmentationRuleCategory > {
	const src = { name, ...settings };

	if ( typeof name !== 'string' ) {
		// eslint-disable-next-line
		console.error( 'Segmentation rule category names must be strings.' );
		return undefined;
	} //end if

	if ( ! /^[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*$/.test( name ) ) {
		// eslint-disable-next-line
		console.error(
			'Segmentation rule category names must contain a namespace prefix, include only lowercase alphanumeric characters or dashes, and start with a letter. Example: my-plugin/my-custom-segmentation-rule-category'
		);
		return undefined;
	} //end if

	if ( select( NAB_SEGMENTS ).getSegmentationRuleTypeCategory( name ) ) {
		// eslint-disable-next-line
		console.error(
			`Segmentation rule category “${ name }” is already registered.`
		);
		return undefined;
	} //end if

	if ( ! hasIcon( src ) ) {
		// eslint-disable-next-line
		console.error(
			`Segmentation rule category “${ name }” must have an icon.`
		);
		return undefined;
	} //end if

	if ( ! isValidIcon( src.icon ) ) {
		// eslint-disable-next-line
		console.error(
			'The icon passed is invalid. The icon should be an element or a function.'
		);
		return undefined;
	} //end if

	if ( ! hasTitle( src ) ) {
		// eslint-disable-next-line
		console.error(
			`Segmentation rule category “${ name }” must have a title.`
		);
		return undefined;
	} //end if

	void dispatch( NAB_SEGMENTS ).addSegmentationRuleTypeCategories( src );

	return src;
} //end registerSegmentationRuleTypeCategory()

// =======
// HELPERS
// =======

const hasAttributes = < T extends Dict >(
	x: Partial< SegmentationRuleType< T > >
): x is { attributes: SegmentationRuleType< T >[ 'attributes' ] } =>
	!! x.attributes;

const hasIcon = (
	x: Partial< SegmentationRuleType >
): x is { icon: SegmentationRuleType[ 'icon' ] } => 'icon' in x;

const hasView = (
	x: Partial< SegmentationRuleType >
): x is { view: SegmentationRuleType[ 'view' ] } => isFunction( x.view );

const hasEdit = (
	x: Partial< SegmentationRuleType >
): x is { edit: SegmentationRuleType[ 'edit' ] } => isFunction( x.edit );

const hasCategory = (
	x: Partial< SegmentationRuleType >
): x is { category: SegmentationRuleType[ 'category' ] } => !! x.category;

const hasSingleton = (
	x: Partial< SegmentationRuleType >
): x is { singleton: SegmentationRuleType[ 'singleton' ] } =>
	undefined !== x.singleton && 'boolean' === typeof x.singleton;

const hasTitle = (
	x: Dict
): x is { title: SegmentationRuleCategory[ 'title' ] } => !! x.title;
