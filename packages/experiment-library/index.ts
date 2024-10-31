/**
 * External dependencies
 */
import { registerExperimentType } from '@nab/experiments';

/**
 * Internal dependencies
 */
import { settings as css } from './css';
import { settings as customPostType } from './custom-post-type';
import { settings as headline } from './headline';
import { settings as heatmap } from './heatmap';
import { settings as javascript } from './javascript';
import { settings as menu } from './menu';
import { settings as page } from './page';
import { settings as post } from './post';
import { settings as template } from './template';
import { settings as theme } from './theme';
import { settings as url } from './url';
import { settings as widget } from './widget';

import { settings as wcProduct } from './woocommerce-product';
import { settings as wcBulkSale } from './woocommerce-bulk-sale';

/**
 * Function to register core experiments.
 *
 * @example
 * ```js
 * import { registerCoreExperiments } from '@nab/experiment-library';
 *
 * registerCoreExperiments();
 * ```
 */
export const registerCoreExperiments = (): void => {
	[
		// Content experiments
		page,
		post,
		customPostType,
		headline,
		url,

		// Heatmap and scrollmap
		heatmap,

		// Site-wide experiments
		template,
		theme,
		widget,
		menu,
		css,
		javascript,

		// WooCommerce experiments
		wcProduct,
		wcBulkSale,
	].forEach( ( settings ) => {
		if ( ! settings ) {
			return;
		} //end if
		registerExperimentType( settings.name, settings );
	} );
};
