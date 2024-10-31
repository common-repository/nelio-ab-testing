/**
 * WordPress dependencies
 */
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NAB_DATA } from '@nab/data';
import type { EntityInstance, Maybe, ProductId } from '@nab/types';

// NOTE. Dependency loop with @nab package.
import type { store as editorStore } from '@nab/editor';
const NAB_EDITOR = 'nab/editor' as unknown as typeof editorStore;

type MaybeProduct = { readonly postId?: ProductId };

export const useTestedProduct = (): Maybe< EntityInstance > =>
	useSelect( ( select ) => {
		const { getAlternative } = select( NAB_EDITOR );
		const original = getAlternative< MaybeProduct >( 'control' );
		if ( ! original?.attributes.postId ) {
			return;
		} //end if

		const { getEntityRecord } = select( NAB_DATA );
		return getEntityRecord( 'product', original.attributes.postId );
	} );

export const useCurrency = (): string =>
	useSelect( ( select ) =>
		select( NAB_DATA ).getECommerceSetting(
			'woocommerce',
			'currencySymbol'
		)
	);
