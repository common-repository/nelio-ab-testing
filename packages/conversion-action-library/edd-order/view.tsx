/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { store as CORE } from '@safe-wordpress/core-data';
import { useSelect } from '@safe-wordpress/data';
import { createInterpolateElement } from '@safe-wordpress/element';
import { sprintf, _x } from '@safe-wordpress/i18n';
import type { Taxonomy } from '@safe-wordpress/core-data';

/**
 * External dependencies
 */
import { find, map, trim, reverse } from 'lodash';
import { store as NAB_DATA } from '@nab/data';
import { hasHead, isSingleton, listify } from '@nab/utils';
import type {
	CAViewProps,
	DownloadId,
	OrderStatusName,
	Maybe,
	SelectedDownloadIds,
	SelectedDownloadTaxonomies,
	SelectedDownloadTerms,
	SomeDownloads,
	TaxonomyName,
	TermId,
} from '@nab/types';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export const View = ( {
	attributes,
	...props
}: CAViewProps< Attributes > ): JSX.Element => {
	const { value: selection } = attributes;
	const { orderStatusForConversion = 'complete' } = props.goal;

	switch ( selection.type ) {
		case 'all-downloads':
			return <AllDownloadsView status={ orderStatusForConversion } />;

		case 'some-downloads':
			return (
				<SomeDownloadsView
					selection={ selection.value }
					status={ orderStatusForConversion }
				/>
			);
	} //end switch
};

// ============
// HELPER VIEWS
// ============

type HelperViewProps< T = unknown > = {
	readonly selection: T;
	readonly status: OrderStatusName;
};

const AllDownloadsView = ( {
	status,
}: Pick< HelperViewProps, 'status' > ): JSX.Element => {
	const statusName = useStatusName( status );

	if ( status === 'complete' ) {
		return (
			<>{ _x( 'An order is completed.', 'text', 'nelio-ab-testing' ) }</>
		);
	} //end if

	return beautify(
		sprintf(
			/* translators: woocommerce order status */
			_x(
				'The status of an order is set to %s.',
				'text',
				'nelio-ab-testing'
			),
			em( statusName )
		)
	);
};

const SomeDownloadsView = ( {
	selection,
	status,
}: HelperViewProps< SomeDownloads[ 'value' ] > ): JSX.Element => {
	switch ( selection.type ) {
		case 'download-ids':
			return <DownloadList selection={ selection } status={ status } />;

		case 'download-taxonomies':
			return (
				<DownloadTaxonomies selection={ selection } status={ status } />
			);
	} //end switch
};

const DownloadList = ( {
	selection,
	status,
}: HelperViewProps< SelectedDownloadIds > ): JSX.Element => {
	const { downloadIds, mode, excluded = false } = selection;

	const statusName = em( useStatusName( status ) );
	const downloadNames = map( useDownloadNames( downloadIds ), strong );

	switch ( downloadNames.length ) {
		case 0:
			return beautify( sprintf( ORDER_STATUS, statusName ) );

		case 1:
			return beautify(
				// eslint-disable-next-line @wordpress/valid-sprintf
				sprintf(
					excluded
						? DOWNLOAD_LABELS.singleExcluded
						: DOWNLOAD_LABELS.singleIncluded,
					statusName,
					downloadNames[ 0 ]
				)
			);

		default:
			return beautify(
				// eslint-disable-next-line @wordpress/valid-sprintf
				sprintf(
					excluded
						? DOWNLOAD_LABELS.multipleExcluded
						: DOWNLOAD_LABELS.multipleIncluded,
					statusName,
					listify( mode, downloadNames )
				)
			);
	} //end switch
};

const DownloadTaxonomies = ( {
	selection,
	status,
}: HelperViewProps< SelectedDownloadTaxonomies > ): JSX.Element => {
	const statusName = em( useStatusName( status ) );
	const value = selection.value.filter( ( t ) => !! t.termIds.length );

	const cat = find( value, { taxonomy: 'download_category' } );
	// eslint-disable-next-line @wordpress/no-unused-vars-before-return
	const catNames = map( useTermNames( cat?.taxonomy, cat?.termIds ), strong );

	const tag = find( value, { taxonomy: 'download_tag' } );
	// eslint-disable-next-line @wordpress/no-unused-vars-before-return
	const tagNames = map( useTermNames( tag?.taxonomy, tag?.termIds ), strong );

	if ( ! hasHead( value ) ) {
		return beautify( sprintf( ORDER_STATUS, statusName ) );
	} //end if

	if ( isSingleton( value ) && ( cat || tag ) ) {
		const terms = catNames || tagNames || [];
		const mode = cat?.mode || tag?.mode || 'or';
		const excluded = !! cat?.excluded || !! tag?.excluded || false;
		const labels = cat ? CATEGORY_LABELS : TAG_LABELS;

		if ( isSingleton( terms ) ) {
			return beautify(
				// eslint-disable-next-line @wordpress/valid-sprintf
				sprintf(
					excluded ? labels.singleExcluded : labels.singleIncluded,
					statusName,
					terms[ 0 ]
				)
			);
		}
		return beautify(
			// eslint-disable-next-line @wordpress/valid-sprintf
			sprintf(
				excluded ? labels.multipleExcluded : labels.multipleIncluded,
				statusName,
				listify( mode, terms )
			)
		);
		//end if
	} //end if

	const isTwoTaxonomies = 2 === value.length;
	if ( isTwoTaxonomies && cat && tag ) {
		return beautify(
			sprintf(
				/* translators: 1 -> woocommerce order status, 2 -> list of category names, 3 -> list of tag names */
				_x(
					'The status of an order is set to %1$s and said order has at least one download in category %2$s and is tagged as %3$s.',
					'text',
					'nelio-ab-testing'
				),
				statusName,
				listify( cat.mode, catNames ),
				listify( tag.mode, tagNames )
			)
		);
	} //end if

	const [ last, ...rest ] = reverse( value );
	const init = reverse( rest );
	return (
		<>
			{ beautify(
				sprintf(
					/* translators: woocommerce order status */
					_x(
						'The status of an order is set to %s and said order has at least one download that',
						'text',
						'nelio-ab-testing'
					),
					statusName
				)
			) }
			{ init.map( ( t ) => (
				<>
					<DownloadTaxonomyTerms
						key={ t.taxonomy }
						selection={ t }
						status={ status }
					/>
					{ init.length === 1 ? '' : '; ' }
				</>
			) ) }
			{ isSingleton( value ) ? '' : AND_PLUS }
			<DownloadTaxonomyTerms selection={ last } status={ status } />
			{ '.' }
		</>
	);
};

const DownloadTaxonomyTerms = ( {
	selection,
}: HelperViewProps< SelectedDownloadTerms > ): JSX.Element => {
	const { taxonomy, mode, termIds, excluded } = selection;

	const taxonomyName = em( useTaxonomyName( taxonomy ) );
	const termNames = map( useTermNames( taxonomy, termIds ), strong );

	return beautify(
		// eslint-disable-next-line @wordpress/valid-sprintf
		sprintf(
			excluded ? TERM_LABELS.excluded : TERM_LABELS.included,
			taxonomyName,
			listify( mode, termNames )
		)
	);
};

// =======
// HELPERS
// =======

const beautify = ( text: string ): JSX.Element =>
	createInterpolateElement(
		// eslint-disable-next-line @wordpress/valid-sprintf
		text,
		{ em: <em />, strong: <strong /> }
	);

const em = ( t: string ): string => `<em>${ t }</em>`;

const strong = ( t: string ): string => `<strong>${ t }</strong>`;

const el = document.createElement( 'div' );
const formatTermName = ( n: string ): string => {
	el.innerHTML = n;
	return el.textContent ?? n;
};

// =====
// HOOKS
// =====

const useStatusName = ( status: OrderStatusName ): string =>
	useSelect(
		( select ) =>
			find(
				select( NAB_DATA ).getECommerceSetting(
					'edd',
					'orderStatuses'
				),
				{
					value: status,
				}
			)?.label ?? status
	);

const useDownloadNames = ( downloadIds: ReadonlyArray< DownloadId > ) =>
	useSelect( ( select ) =>
		downloadIds.map(
			( downloadId ) =>
				trim(
					select( NAB_DATA ).getEntityRecord( 'download', downloadId )
						?.title
				) ||
				sprintf(
					/* translators: product id */
					_x( 'Download #%d', 'text', 'nelio-ab-testing' ),
					downloadId
				)
		)
	);

const useTaxonomyName = ( taxonomyName: TaxonomyName ) =>
	useSelect( ( select ) => {
		const taxonomy: Maybe< Taxonomy > = select( CORE ).getEntityRecord(
			'root',
			'taxonomy',
			taxonomyName
		);
		return taxonomy?.labels.singular_name ?? taxonomyName;
	} );

const useTermNames = (
	taxonomy: Maybe< TaxonomyName >,
	termIds: Maybe< ReadonlyArray< TermId > > = []
) =>
	useSelect( ( select ): ReadonlyArray< string > => {
		select( CORE );
		if ( ! taxonomy || ! termIds ) {
			return [];
		} //end if
		return termIds.map( ( id ) => {
			const term = select( CORE ).getEntityRecord(
				'taxonomy',
				taxonomy,
				id
			);
			const name = hasName( term ) ? term.name : `#${ id }`;
			return formatTermName( name );
		} );
	} );

const hasName = ( o: unknown ): o is { name: string } =>
	!! o &&
	typeof o === 'object' &&
	'name' in o &&
	!! o.name &&
	'string' === typeof o.name;

// =========
// CONSTANTS
// =========

type Labels = {
	readonly singleExcluded: string;
	readonly singleIncluded: string;
	readonly multipleExcluded: string;
	readonly multipleIncluded: string;
};

/* translators: woocommerce order status */
const ORDER_STATUS = _x(
	'The status of an order is set to %s.',
	'text',
	'nelio-ab-testing'
);

const DOWNLOAD_LABELS: Labels = {
	/* translators: 1 -> woocomerce status, 2 -> download name */
	singleExcluded: _x(
		'The status of an order not containing download %2$s is set to %1$s.',
		'text',
		'nelio-ab-testing'
	),
	/* translators: 1 -> woocomerce status, 2 -> download name */
	singleIncluded: _x(
		'The status of an order containing the download %2$s is set to %1$s.',
		'text',
		'nelio-ab-testing'
	),
	/* translators: 1 -> woocomerce status, 2 -> list of download names */
	multipleExcluded: _x(
		'The status of an order not containing any of the downloads %2$s is set to %1$s.',
		'text',
		'nelio-ab-testing'
	),
	/* translators: 1 -> woocomerce status, 2 -> list of download names */
	multipleIncluded: _x(
		'The status of an order containing downloads %2$s is set to %1$s.',
		'text',
		'nelio-ab-testing'
	),
};

const CATEGORY_LABELS: Labels = {
	/* translators: 1 -> woocomerce status, 2 -> woocommerce category name */
	singleExcluded: _x(
		'The status of an order not containing any download in category %2$s is set to %1$s.',
		'text',
		'nelio-ab-testing'
	),
	/* translators: 1 -> woocomerce status, 2 -> woocommerce category name */
	singleIncluded: _x(
		'The status of an order containing at least one download in category %2$s is set to %1$s.',
		'text',
		'nelio-ab-testing'
	),
	/* translators: 1 -> woocomerce status, 2 -> list of woocommerce category names */
	multipleExcluded: _x(
		'The status of an order not containing any downloads in categories %2$s is set to %1$s.',
		'text',
		'nelio-ab-testing'
	),
	/* translators: 1 -> woocomerce status, 2 -> list of woocommerce category names */
	multipleIncluded: _x(
		'The status of an order containing at least one download in categories %2$s is set to %1$s.',
		'text',
		'nelio-ab-testing'
	),
};

const TAG_LABELS_AUX = {
	/* translators: 1 -> woocommerce order status, 2 -> woocomerce tag name */
	singleExcluded: _x(
		'The status of an order not containing any download tagged as %2$s is set to %1$s.',
		'text',
		'nelio-ab-testing'
	),
	/* translators: 1 -> woocommerce order status, 2 -> woocomerce tag name */
	singleIncluded: _x(
		'The status of an order containing at least one download tagged as %2$s is set to %1$s.',
		'text',
		'nelio-ab-testing'
	),
};

const TAG_LABELS: Labels = {
	...TAG_LABELS_AUX,
	multipleExcluded: TAG_LABELS_AUX.singleExcluded,
	multipleIncluded: TAG_LABELS_AUX.singleIncluded,
};

const TERM_LABELS = {
	empty: '',
	/* translators: 1 -> woocomerce taxonomy name, 2 -> list of woocommerce term names */
	excluded: _x(
		'doesn’t have %2$s in taxonomy %1$s',
		'text (implicit subject: download)',
		'nelio-ab-testing'
	),
	/* translators: 1 -> woocomerce taxonomy name, 2 -> list of woocommerce term names */
	included: _x(
		'has %2$s in taxonomy %1$s',
		'text (implicit subject: download)',
		'nelio-ab-testing'
	),
};

// =========
// CONSTANTS
// =========

// eslint-disable-next-line @wordpress/i18n-no-flanking-whitespace
const AND_PLUS = _x( ', and ', 'text (2+ item list)', 'nelio-ab-testing' );
