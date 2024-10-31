/**
 * External dependencies
 */
import 'es6-symbol';

/**
 * Internal dependencies
 */
import { loadAlternative, loadUntestedControl } from './alternative-loading';
import {
	exportTrackingApi,
	markContentAsReady,
	maybeStartTracking,
} from './tracking';
import { getSession } from './utils/helpers';

void ( async function (): Promise< void > {
	exportTrackingApi();

	const session = await getSession();
	if ( ! session ) {
		await loadUntestedControl();
		markContentAsReady();
		return;
	} //end if

	const loaded = await loadAlternative( session );
	maybeStartTracking( session, loaded );
	markContentAsReady();
} )();
