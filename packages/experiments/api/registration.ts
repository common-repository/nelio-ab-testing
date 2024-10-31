/**
 * WordPress dependencies
 */
import { select, dispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { isFunction, isObject } from 'lodash';
import { isValidIcon } from '@nab/utils';
import type {
	Dict,
	ExperimentType,
	ExperimentTypeName,
	Maybe,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { store as NAB_EXPERIMENTS } from '../store';

/**
 * Registers a new experiment provided a unique name and an object defining its
 * behavior. Once registered, the experiment is made available as an option to
 * any interface where experiments are implemented.
 *
 * @param {string} name     Experiment name.
 * @param {Object} settings Experiment settings.
 *
 * @return {?Object} The experiment, if it has been successfully registered;
 *                       otherwise `undefined`.
 */
export function registerExperimentType(
	name: ExperimentTypeName,
	settings: Dict
): Maybe< ExperimentType > {
	const et = {
		description: '',
		supports: {},
		checks: hasChecks( settings )
			? settings.checks
			: {
					getControlError: (): string | false => false,
					getAlternativeError: (): string | false => false,
			  },
		...settings,
		name,
	};

	if ( 'nab/heatmap' === name ) {
		void dispatch( NAB_EXPERIMENTS ).addExperimentTypes(
			et as ExperimentType
		);
		return et as ExperimentType;
	} //end if

	if ( typeof name !== 'string' ) {
		// eslint-disable-next-line
		console.error( 'Experiment type names must be strings.' );
		return;
	} //end if

	if ( ! /^[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*$/.test( name ) ) {
		// eslint-disable-next-line
		console.error(
			'Experiment type names must contain a namespace prefix, include only lowercase alphanumeric characters or dashes, and start with a letter. Example: my-plugin/my-custom-experiment'
		);
		return;
	} //end if

	if ( select( NAB_EXPERIMENTS ).getExperimentType( name ) ) {
		// eslint-disable-next-line
		console.error( `Experiment type “${ name }” is already registered.` );
		return;
	} //end if

	if ( ! hasChecks( et ) ) {
		// eslint-disable-next-line
		console.error(
			`Experiment type “${ name }” must provide at least two checks: “getControlError” and “getAlternativeError”.`
		);
		return;
	} //end if

	if ( ! hasHelp( et ) ) {
		// eslint-disable-next-line
		console.error(
			`The experiment “${ name }” must provide help strings explaining the control version and its variants.`
		);
		return;
	} //end if

	if ( ! hasCategory( et ) ) {
		// eslint-disable-next-line
		console.error(
			`The experiment “${ name }” must have a valid category.`
		);
		return;
	} //end if

	if ( ! hasTitle( et ) ) {
		// eslint-disable-next-line
		console.error( `The experiment “${ name }” must have a title.` );
		return;
	} //end if

	if ( ! hasIcon( et ) ) {
		// eslint-disable-next-line
		console.error( `The experiment “${ name }” must have an icon.` );
		return;
	} //end if

	if ( ! isValidIcon( settings.icon ) ) {
		// eslint-disable-next-line
		console.error(
			'The icon passed is invalid. The icon should be an element or a function.'
		);
		return;
	} //end if

	if ( ! hasDefaultValues( et ) ) {
		// eslint-disable-next-line
		console.error(
			`The experiment “${ name }” must specify original and alternative default values.`
		);
		return;
	} //end if

	if ( ! hasViews( et ) ) {
		// eslint-disable-next-line
		console.error(
			`The experiment “${ name }” must specify original and alternative edit views.`
		);
		return;
	} //end if

	void dispatch( NAB_EXPERIMENTS ).addExperimentTypes( et );

	return et;
} //end registerExperimentType()

// =======
// HELPERS
// =======

const hasHelp = (
	x: Partial< ExperimentType >
): x is { help: ExperimentType[ 'help' ] } =>
	!! x.help &&
	'string' === typeof x.help.original &&
	!! x.help.original &&
	'string' === typeof x.help.alternative &&
	!! x.help.alternative;

const hasCategory = (
	x: Partial< ExperimentType >
): x is { category: ExperimentType[ 'category' ] } =>
	[ 'page', 'global', 'woocommerce', 'other' ].includes( x.category ?? '' );

const hasTitle = (
	x: Partial< ExperimentType >
): x is { title: ExperimentType[ 'title' ] } =>
	'string' === typeof x.title && !! x.title;

const hasIcon = (
	x: Partial< ExperimentType >
): x is { icon: ExperimentType[ 'icon' ] } => 'icon' in x;

const hasViews = (
	x: Partial< ExperimentType >
): x is { views: ExperimentType[ 'views' ] } =>
	isFunction( x.views?.original ) && isFunction( x.views?.alternative );

const hasChecks = (
	x: Partial< ExperimentType >
): x is {
	checks: Pick<
		ExperimentType[ 'checks' ],
		'getControlError' | 'getAlternativeError'
	>;
} =>
	isFunction( x.checks?.getControlError ) &&
	isFunction( x.checks?.getAlternativeError );

const hasDefaultValues = (
	x: Partial< ExperimentType >
): x is { defaults: ExperimentType[ 'defaults' ] } =>
	isObject( x.views?.original ) && isObject( x.defaults?.alternative );
