/**
 * Internal dependencies
 */
import { addQueryArgs } from '../url';
import type { ParamValue, Session } from '../../types';

export const getApiUrl = (
	api: Session[ 'api' ],
	path: string,
	args?: Record< string, ParamValue >
): string =>
	addQueryArgs(
		'rest' === api.mode
			? addQueryArgs( api.url, { path } )
			: `${ api.url }${ path }`,
		args
	);
