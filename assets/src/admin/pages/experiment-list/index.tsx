/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import apiFetch from '@safe-wordpress/api-fetch';
import { select, subscribe } from '@safe-wordpress/data';
import { render } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';
import domReady from '@safe-wordpress/dom-ready';

/**
 * External dependencies
 */
import { NewTestButton, QuotaMeter, TitleAction } from '@nab/components';
import { registerCoreExperiments } from '@nab/experiment-library';
import { store as NAB_EXPERIMENTS } from '@nab/experiments';
import {
	areEqual,
	createStagingNotice,
	logError,
	onElementReadyOrDomReadyTops,
} from '@nab/utils';
import { numberFormat } from '@nab/i18n';
import { debounce, keys, toPairs } from 'lodash';
import type {
	CloudAlternativeResults,
	CloudResults,
	ExperimentTypeName,
	SubscriptionPlan,
} from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { renderHelp } from './help';
import { NoticeList } from './components/notice-list';
import DefaultIcon from './icon.svg';

type Settings = {
	readonly isDeprecated: boolean;
	readonly isStaging: boolean;
	readonly subscription: SubscriptionPlan | false;
};

export function initPage( _: string, settings: Settings ): void {
	registerCoreExperiments();
	onElementReadyOrDomReadyTops( '.wp-header-end', renderQuotaMeter );
	renderExperimentIconsASAP();

	domReady( () => renderPendingPageViews() );
	domReady( () => formatPageViews() );
	domReady( () => renderHeaderItems( settings ) );

	if ( settings.isStaging ) {
		createStagingNotice();
	} //end if

	let previousTypes: ReadonlyArray< ExperimentTypeName > = [];
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	subscribe(
		debounce( () => {
			const types = keys(
				select( NAB_EXPERIMENTS ).getExperimentTypes()
			);
			if ( areEqual( types, previousTypes ) ) {
				return;
			} //end if
			previousTypes = types;
			renderExperimentIcons();
		}, 0 ),
		NAB_EXPERIMENTS
	);

	renderHelp();
} //end initPage()

// =======
// HELPERS
// =======

function renderPendingPageViews() {
	const nodes = Array.from(
		document.querySelectorAll< HTMLElement >(
			'.nab-pending-page-views-wrapper'
		)
	);

	nodes.forEach( ( node ) => {
		const id = Number.parseInt( node.getAttribute( 'data-id' ) || '' );
		if ( isNaN( id ) ) {
			return;
		} //end if

		try {
			void apiFetch< CloudResults >( {
				path: `/nab/v1/experiment/${ id }/result`,
			} ).then( ( results ) => {
				const views = toPairs( results ).reduce(
					( acc, pair ) =>
						acc +
						( isAlternativeResults( pair ) ? pair[ 1 ].v || 0 : 0 ),
					0
				);
				node.textContent = numberFormat( views );
			} );
		} catch ( e ) {
			logError( e );
			node.textContent = _x( 'Unknown', 'text', 'nelio-ab-testing' );
		} //end try
	} );
} //end renderPendingPageViews()

function formatPageViews() {
	const nodes = Array.from(
		document.querySelectorAll< HTMLElement >( '.nab-page-views-wrapper' )
	);
	nodes.forEach( ( node ) => {
		const value = Number.parseInt(
			node.getAttribute( 'data-value' ) || ''
		);
		node.textContent = isNaN( value ) ? '0' : numberFormat( value );
	} );
} //end formatPageViews()

function renderExperimentIconsASAP() {
	renderExperimentIcons();

	setTimeout( () => {
		if ( 'complete' !== document.readyState ) {
			renderExperimentIconsASAP();
		} //end if
	}, 100 );
} //end renderExperimentIconsASAP()

function renderExperimentIcons() {
	const iconWrappers = Array.from(
		document.querySelectorAll< HTMLElement >( '.js-nab-experiment__icon' )
	).filter( ( wrapper ) => ! wrapper.children.length );

	iconWrappers.map( ( wrapper ) => {
		const typeName = wrapper.getAttribute( 'data-experiment-type' ) || '';
		const type = select( NAB_EXPERIMENTS ).getExperimentType( typeName );
		const Icon = ( type && type.icon ) || DefaultIcon;
		const name =
			( type && type.title ) ||
			_x( 'Unknown', 'text (experiment type)', 'nelio-ab-testing' );
		wrapper.setAttribute( 'title', name );
		return render( <Icon />, wrapper );
	} );
} //end renderExperimentIcons()

function renderHeaderItems( settings: Settings ) {
	const pageTitle = document.querySelector( '.wp-heading-inline' );
	if ( ! pageTitle?.parentElement ) {
		return;
	} //end if

	const notices = document.createElement( 'div' );
	const testButtonWrapper = document.createElement( 'span' );
	const titleActionWrapper = document.createElement( 'span' );

	// phpcs:ignore
	pageTitle.parentElement.insertBefore( notices, pageTitle.nextSibling );
	// phpcs:ignore
	pageTitle.parentElement.insertBefore(
		titleActionWrapper,
		pageTitle.nextSibling
	);
	// phpcs:ignore
	pageTitle.parentElement.insertBefore(
		testButtonWrapper,
		pageTitle.nextSibling
	);

	render( <NoticeList />, notices );
	render( <NewTestButton />, testButtonWrapper );
	render(
		<TitleAction
			isSubscribed={ !! settings.subscription }
			isDeprecated={ settings.isDeprecated }
		/>,
		titleActionWrapper
	);
} //end renderHeaderItems()

function renderQuotaMeter() {
	const headerEnd = document.querySelector< HTMLElement >( '.wp-header-end' );
	if ( ! headerEnd?.parentElement ) {
		return;
	} //end if
	const quotaWrapper = document.createElement( 'div' );
	render( <QuotaMeter />, quotaWrapper );
	headerEnd.parentElement.insertBefore( quotaWrapper, headerEnd );
} //end renderQuotaMeter()

const isAlternativeResults = (
	pair: [ string, unknown ]
): pair is [ string, CloudAlternativeResults ] => 'a' === pair[ 0 ][ 0 ];
