/**
 * External dependencies
 */
import debounce from 'lodash/debounce';
import toPairs from 'lodash/toPairs';
import type { ExperimentId } from '@nab/types';
import type { Attributes } from '../../../../../packages/conversion-action-library/form-submission/types';

/**
 * Internal dependencies
 */
import { domReady, getClosest } from '../../utils/helpers';
import { getCookie } from '../../utils/cookies';
import type { AlternativeIndex, Convert, ConvertibleAction } from '../../types';
import { getUniqueViews } from '../../utils/tracking';
import { getAllActiveSegments } from '../../utils/segmentation';

type ExpAlt = {
	readonly experiment: ExperimentId;
	readonly alternative: AlternativeIndex;
};

const formActions = [
	'nab/form-submission',
	'nab/wc-order',
	'nab/edd-order',
	'nab/surecart-order',
];
export function isWordPressFormSubmissionAction(
	action: ConvertibleAction
): boolean {
	return (
		formActions.includes( action.type ) &&
		! isJavaScriptFormSubmissionAction( action )
	);
} //end isWordPressFormSubmissionAction()

const jsFormTypes = [ 'nab_hubspot_form' ];
export function isJavaScriptFormSubmissionAction(
	action: ConvertibleAction
): action is ConvertibleAction< Attributes > {
	return (
		isFormSubmissionAction( action ) &&
		jsFormTypes.includes( action.attributes.formType )
	);
} //end isWordPressFormSubmissionAction()

const actions: ExpAlt[] = [];
export function prepareFormForSyncingEventInWordPress(
	action: ConvertibleAction
): void {
	const { experiment, alternative } = action;
	actions.push( { experiment, alternative } );
	addEventListenersToExtendFormFields();
} //end prepareFormForSyncingEventInWordPress()

const jsActions: [ ConvertibleAction< Attributes >, Convert ][] = [];
export function listenToJavaScriptFormSubmission(
	action: ConvertibleAction< Attributes >,
	convert: Convert
): void {
	jsActions.push( [ action, convert ] );
} //end listenToJavaScriptFormSubmission()

// ====================
// JAVASCRIPT LISTENERS
// ====================

// -------
// HUBSPOT
// -------

window.addEventListener( 'message', ( event ) => {
	if ( ! isHubSpotEvent( event ) ) {
		return;
	} //end if

	if ( event.data.eventName !== 'onBeforeFormSubmit' ) {
		return;
	} //end if

	const result = jsActions
		.filter(
			( [ action ] ) => action.attributes.formType === 'nab_hubspot_form'
		)
		.find( ( [ action ] ) => action.attributes.formName === event.data.id );

	if ( ! result ) {
		return;
	} //end if

	const [ action, convert ] = result;
	convert( action.experiment, action.goal );
} );

const isHubSpotEvent = ( event: {
	data: unknown;
} ): event is MessageEvent< {
	readonly type: 'hsFormCallback';
	readonly eventName: string;
	readonly id: string;
} > =>
	!! event.data &&
	'object' === typeof event.data &&
	'type' in event.data &&
	event.data.type === 'hsFormCallback';

// =======
// HELPERS
// =======

const isFormSubmissionAction = (
	action: ConvertibleAction
): action is ConvertibleAction< Attributes > =>
	action.type === 'nab/form-submission';

const isJQuery = ( x?: unknown ): x is JQuery =>
	!! x && typeof x === 'function' && 'ajaxPrefilter' in x;

type JQuery = {
	readonly ajaxPrefilter: (
		handler: ( opts: unknown, originalOpts: unknown ) => void
	) => void;
};

const hasData = ( x?: unknown ): x is { data: unknown } =>
	!! x && 'object' === typeof x && 'data' in x;

const hasAction = ( x?: unknown ): x is { action: unknown } =>
	!! x && 'object' === typeof x && 'action' in x;

domReady( () => {
	/* eslint-disable */
	const jQuery = ( window as any ).jQuery;
	/* eslint-enable */
	if ( ! isJQuery( jQuery ) ) {
		return;
	} //end if

	jQuery.ajaxPrefilter( ( opts, oriOpts ) => {
		if ( ! hasData( oriOpts ) || ! hasAction( oriOpts.data ) ) {
			return;
		} //end if
		if ( 'nf_ajax_submit' !== oriOpts.data.action ) {
			return;
		} //end if

		if ( ! hasData( opts ) || 'string' !== typeof opts.data ) {
			return;
		} //end if
		opts.data += generateCloudFields()
			.map(
				( [ key, value ] ) =>
					`&${ key }=${ encodeURIComponent( value ) }`
			)
			.join( '' );
	} );
} );

let areListenersReady = false;
function addEventListenersToExtendFormFields() {
	if ( areListenersReady ) {
		return;
	} //end if
	areListenersReady = true;

	document.addEventListener( 'click', maybeAddHiddenFieldsInForm );
	document.addEventListener( 'click', maybeAddHiddenFieldsInForm, true );
	document.addEventListener( 'keyup', maybeAddHiddenFieldsInForm );
	document.addEventListener( 'keyup', maybeAddHiddenFieldsInForm, true );
} //end addEventListenersToExtendFormFields()

const maybeAddHiddenFieldsInForm = debounce(
	( ev: Event ) => {
		const target = ev.target as HTMLElement | null;
		if ( ! target ) {
			return;
		} //end if

		const form = getClosest< HTMLFormElement >( target, 'form' );
		if ( ! form ) {
			return;
		} //end if

		generateCloudFields().forEach( ( [ key, value ] ) =>
			maybeAddHiddenField( form, key, value )
		);
	},
	1000,
	{ leading: true }
);

function maybeAddHiddenField(
	form: HTMLFormElement,
	fieldName: string,
	fieldValue: string | undefined
): void {
	if ( ! fieldValue ) {
		return;
	} //end if

	const hiddenField = getHiddenField( form, fieldName );
	hiddenField.setAttribute( 'value', fieldValue );
} //end maybeAddHiddenField()

function getHiddenField(
	form: HTMLFormElement,
	fieldName: string
): HTMLElement {
	let hiddenField = form.querySelector< HTMLElement >(
		`input[name=${ fieldName }]`
	);
	if ( hiddenField ) {
		return hiddenField;
	} //end if

	hiddenField = document.createElement( 'input' );
	hiddenField.setAttribute( 'type', 'hidden' );
	hiddenField.setAttribute( 'name', fieldName );

	form.appendChild( hiddenField );

	return hiddenField;
} //end getHiddenField()

function generateCloudFields(): ReadonlyArray< [ string, string ] > {
	return toPairs( {
		nab_experiments_with_page_view: generateExperimentsWithPageViewValue(),
		nab_segments: generateExperimentSegments(),
		nab_unique_views: generateUniqueViewsValue(),
	} );
} //end generateCloudFields()

function generateExperimentsWithPageViewValue() {
	const experiments = getExperimentsWithPageView();
	const relevantActions = actions.filter( ( { experiment } ) =>
		experiments.includes( experiment )
	);
	return relevantActions
		.map(
			( { experiment, alternative } ) =>
				`${ experiment }:${ alternative }`
		)
		.join( ';' );
} //end generateExperimentsWithPageViewValue()

function generateExperimentSegments() {
	return toPairs( getAllActiveSegments() )
		.map( ( [ e, ss = [] ] ) => `${ e }:${ ss.join( ',' ) }` )
		.join( ';' );
} //end generateExperimentSegments()

function generateUniqueViewsValue() {
	const uniqueViews = getUniqueViews();
	return Object.entries( uniqueViews )
		.map( ( [ key, value ] ) => `${ key }:${ value }` )
		.join( ';' );
} //end generateUniqueViewsValue()

function getExperimentsWithPageView(): ReadonlyArray< ExperimentId > {
	try {
		const value = JSON.parse(
			getCookie( 'nabExperimentsWithPageViews' ) ?? ''
		) as Partial< Record< ExperimentId, number > >;
		return Object.keys( value ).map(
			( id ) => ( Number.parseInt( id ) || 0 ) as ExperimentId
		);
	} catch {
		return [];
	} //end try
} //end getExperimentsWithPageView()
