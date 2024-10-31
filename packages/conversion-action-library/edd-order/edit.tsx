/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	BaseControl,
	ToggleControl,
	ExternalLink,
} from '@safe-wordpress/components';
import { useInstanceId } from '@safe-wordpress/compose';
import { useSelect } from '@safe-wordpress/data';
import { createInterpolateElement, useEffect } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { ErrorText, PostSearcher } from '@nab/components';
import { store as NAB_DATA } from '@nab/data';
import type {
	AllDownloads,
	CAEditProps,
	DownloadId,
	DownloadSelection,
	SomeDownloads,
} from '@nab/types';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export const Edit = ( {
	attributes: attrs,
	setAttributes: setAttrs,
	errors,
}: CAEditProps< Attributes > ): JSX.Element => {
	const instanceId = useInstanceId( Edit );

	const { value: attributes } = attrs;
	const downloadId =
		attributes.type === 'some-downloads' &&
		attributes.value.type === 'download-ids'
			? attributes.value.downloadIds[ 0 ] || 0
			: 0;

	const setAttributes = ( value: DownloadSelection ): void =>
		setAttrs( {
			type: 'download-selection',
			value,
		} );

	useEffect( () => {
		if ( attrs.type === 'download-selection' ) {
			return;
		} //end if
		setAttributes( attributes );
	}, [] );

	return (
		<>
			<ToggleControl
				label={ _x(
					'Track conversion if the order contains a specific download.',
					'command',
					'nelio-ab-testing'
				) }
				checked={ attributes.type === 'some-downloads' }
				onChange={ ( any ) =>
					setAttributes( any ? SOME_DOWNLOADS : ALL_DOWNLOADS )
				}
			/>

			{ attributes.type === 'some-downloads' &&
				attributes.value.type === 'download-ids' && (
					<BaseControl
						id={ `nab-conversion-action__edd-add-to-cart-${ instanceId }` }
						className={ classnames( {
							'nab-conversion-action__field--has-errors':
								errors.type,
						} ) }
						label={ <Label downloadId={ downloadId } /> }
						help={ <ErrorText value={ errors.type } /> }
					>
						<PostSearcher
							id={ `nab-conversion-action__edd-add-to-cart-${ instanceId }` }
							type="download"
							perPage={ 10 }
							value={ downloadId }
							onChange={ ( newDownloadId ) =>
								setAttributes( {
									type: 'some-downloads',
									value: {
										type: 'download-ids',
										mode: 'and',
										// @ts-expect-error Download IDs are always number.
										downloadIds: newDownloadId
											? [ newDownloadId ]
											: [],
									},
								} )
							}
						/>
					</BaseControl>
				) }
		</>
	);
};

const Label = ( { downloadId }: { downloadId: DownloadId } ) => {
	const permalink = useDownloadPermalink( downloadId );

	if ( ! permalink ) {
		return <span>{ _x( 'Download', 'text', 'nelio-ab-testing' ) }</span>;
	} //end if

	return (
		<span>
			{ createInterpolateElement(
				_x( 'Download (<a>View</a>)', 'text', 'nelio-ab-testing' ),
				// @ts-expect-error children prop is set by createInterpolateComponent.
				{ a: <ExternalLink href={ permalink } /> }
			) }
		</span>
	);
};

// =========
// CONSTANTS
// =========

const ALL_DOWNLOADS: AllDownloads = {
	type: 'all-downloads',
};

const SOME_DOWNLOADS: SomeDownloads = {
	type: 'some-downloads',
	value: {
		type: 'download-ids',
		mode: 'and',
		downloadIds: [],
	},
};

// =====
// HOOKS
// =====

const useDownloadPermalink = ( downloadId: DownloadId ) =>
	useSelect(
		( select ) =>
			select( NAB_DATA ).getEntityRecord( 'download', downloadId )?.link
	);
