/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

export function validate(
	attrs: Attributes
): Partial< Record< keyof Attributes, string > > {
	const { value: attributes } = attrs;

	if ( attributes.type === 'all-downloads' ) {
		return {};
	} //end if

	const selection = attributes.value;
	switch ( selection.type ) {
		case 'download-ids':
			return selection.downloadIds.length
				? {}
				: {
						type: _x(
							'Please select a download',
							'user',
							'nelio-ab-testing'
						),
				  };

		case 'download-taxonomies': {
			const taxonomies = selection.value;
			if ( ! taxonomies.length ) {
				return {
					type: _x(
						'Please select one or more taxonomies',
						'user',
						'nelio-ab-testing'
					),
				};
			} //end if

			return taxonomies.every( ( t ) => !! t.termIds.length )
				? {}
				: {
						type: _x(
							'Please select one or more terms in all your taxonomies',
							'user',
							'nelio-ab-testing'
						),
				  };
		}
	} //end switch
} //end validate()
