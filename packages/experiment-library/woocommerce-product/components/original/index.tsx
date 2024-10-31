/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { PostSearcher } from '@nab/components';

import type { PostSearcherProps } from '@nab/components';
import type { ExperimentEditProps } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';

import type { ControlAttributes } from '../../types';
import { CheckboxControl } from '@safe-wordpress/components';

export type OriginalProps = ExperimentEditProps< ControlAttributes > & {
	readonly validPostFilter?: PostSearcherProps[ 'filter' ];
};

export const Original = ( {
	attributes,
	setAttributes,
	validPostFilter,
}: OriginalProps ): JSX.Element => {
	return (
		<div className="nab-original-product-alternative">
			<div className="nab-original-product-alternative__selector">
				<PostSearcher
					type="product"
					value={ attributes.postId }
					perPage={ 10 }
					onChange={ ( value ) =>
						setAttributes( {
							// @ts-expect-error Product IDs are always numbers.
							postId: value,
							postType: 'product',
						} )
					}
					filter={ validPostFilter }
					placeholder={ _x(
						'Please select a product…',
						'user',
						'nelio-ab-testing'
					) }
				/>
			</div>
			<div className="nab-original-product-alternative__flags">
				<CheckboxControl
					className="nab-original-product-alternative__flag"
					checked={ ! attributes.disablePriceTesting }
					onChange={ ( enabled ) =>
						setAttributes( {
							disablePriceTesting: ! enabled ? true : undefined,
						} )
					}
					label={ _x(
						'Enable price testing',
						'command',
						'nelio-ab-testing'
					) }
				/>
			</div>
		</div>
	);
};
