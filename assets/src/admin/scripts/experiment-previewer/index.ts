/**
 * External dependencies
 */
import type { Dict } from '@nab/types';

/**
 * Internal dependencies
 */
import { domReady } from '../../../public/utils/helpers/dom-ready';
import { headReady } from '../../../public/utils/helpers/head-ready';
import { applyAutoInlineExperiments } from '../../../public/alternative-loading/apply-auto-inline-experiments';
import type { ActiveExperiment } from '../../../public/types';

void ( async () => {
	const experiment = await getExperiment();
	if ( experiment ) {
		await applyAutoInlineExperiments( [ experiment ] );
	} //end if
	headReady( () => {
		const overlay = document.getElementById( 'nelio-ab-testing-overlay' );
		if ( overlay ) {
			overlay.parentNode?.removeChild( overlay );
		} else {
			document.body.classList.add( 'nab-done' );
		} //end if
	} );
} )();

// =======
// HELPERS
// =======

async function getExperiment(): Promise< ActiveExperiment | undefined > {
	if ( await getExperimentNow() ) {
		return getExperimentNow();
	} //end if

	if ( await isExperimentReadyAfter( 0 ) ) {
		return getExperimentNow();
	} //end if

	if ( await isExperimentReadyAfter( 500 ) ) {
		return getExperimentNow();
	} //end if

	if ( await isExperimentReadyAfter( 2000 ) ) {
		return getExperimentNow();
	} //end if

	return undefined;
} //end getExperiment()

function getExperimentNow(): Promise< ActiveExperiment | undefined > {
	return new Promise( ( resolve ) => {
		const win = window as unknown as Dict;
		return resolve(
			win.nabExperiment
				? ( win.nabExperiment as ActiveExperiment )
				: undefined
		);
	} );
} //end getExperimentNow()

function isExperimentReadyAfter( timeout: number ): Promise< boolean > {
	return new Promise( ( resolve ) =>
		domReady( () =>
			setTimeout(
				async () => resolve( !! ( await getExperimentNow() ) ),
				timeout
			)
		)
	);
} //end isExperimentReadyLater()
