/**
 * Internal dependencies
 */
import { domReady, headReady } from '../utils/helpers';
import type { Experiment, ActiveExperiment, ScriptAlternative } from '../types';
import { ExperimentId, Maybe } from '@nab/types';

export const applyAutoInlineExperiments = async (
	experiments: ReadonlyArray< Experiment >
): Promise< void > => {
	await applyAutoInlineExperimentsOn( 'header', experiments );
	await applyAutoInlineExperimentsOn( 'footer', experiments );
};

const applyAutoInlineExperimentsOn = (
	inlineLoad: 'header' | 'footer',
	experiments: ReadonlyArray< Experiment >
): Promise< void > =>
	new Promise( ( resolve ) => {
		const inlineExperiments = experiments.filter(
			( experiment ): experiment is ActiveExperiment =>
				experiment.active && experiment.inline?.load === inlineLoad
		);

		if ( ! inlineExperiments.length ) {
			return resolve();
		} //end if

		const onReady = 'header' === inlineLoad ? headReady : domReady;
		onReady( async () => {
			await Promise.all( inlineExperiments.map( applyExperiment ) );
			resolve();
		} );
	} );

// ========
// INTERNAL
// ========

const applyExperiment = async (
	experiment: ActiveExperiment
): Promise< void > => {
	if ( ! experiment.inline ) {
		return;
	} //end if

	switch ( experiment.inline.mode ) {
		case 'unwrap':
			return applyUnwrapExperiment( experiment );
		case 'visibility':
			return applyVisibilityExperiment( experiment );
		case 'script':
			return await applyScriptExperiment( experiment );
	} //end switch
};

const applyUnwrapExperiment = ( experiment: ActiveExperiment ) => {
	const exp = experiment.id;
	const alt = experiment.alternative;
	Array.from(
		document.querySelectorAll( `.nab-exp-${ exp }.nab-alt-${ alt }` )
	).forEach(
		( node ) =>
			node.innerHTML.trim() &&
			node.insertAdjacentHTML( 'afterend', node.innerHTML )
	);
	Array.from( document.querySelectorAll( `.nab-exp-${ exp }` ) ).forEach(
		( node ) => node.parentNode?.removeChild( node )
	);
};

const applyVisibilityExperiment = ( experiment: ActiveExperiment ) => {
	const exp = experiment.id;
	const alt = experiment.alternative;
	Array.from(
		document.querySelectorAll< HTMLElement >(
			`.nab-exp-${ exp }.nab-alt-${ alt }`
		)
	).forEach( ( node ) => {
		node.style.display = '';
	} );
	Array.from( document.querySelectorAll( `.nab-exp-${ exp }` ) ).forEach(
		( node ) => node.parentNode?.removeChild( node )
	);
};

const applyScriptExperiment = (
	experiment: ActiveExperiment
): Promise< void > =>
	new Promise( ( resolve ) => {
		if ( ! isScriptExperiment( experiment ) ) {
			return resolve();
		} //end if

		const done = () => {
			resolve();
			getViewTracker()( experiment.id );
		};

		const alt = experiment.alternative;
		return experiment.alternatives[ alt ]?.run( done, {
			showContent: resolve,
			domReady,
		} );
	} );

const isScriptExperiment = (
	experiment: ActiveExperiment
): experiment is ActiveExperiment & {
	alternatives: ReadonlyArray< ScriptAlternative >;
} => experiment.inline?.mode === 'script';

function getViewTracker(): ( id: ExperimentId ) => void {
	/* eslint-disable */
	const win = window as any;
	const nab = win.nab as any;
	const view = nab?.view as Maybe< ( id: ExperimentId ) => void >;
	/* eslint-enable */
	return view ?? ( () => void null );
} //end getViewTracker()
