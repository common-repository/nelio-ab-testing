/**
 * External dependencies
 */
import type {
	EntityId,
	EntityKindName,
	Experiment,
	Heatmap,
	Maybe,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { domReady } from '../../../public/utils/helpers';

type Settings = {
	readonly currentUrl: string;
	readonly experimentType?: string;
	readonly postId?: EntityId;
	readonly postType?: EntityKindName;
	readonly root: string;
	readonly nonce: string;
};

let settings: Maybe< Settings >;
let isCreatingExperimentOrHeatmap = false;

if ( hasQuickActionSettings( window ) ) {
	settings = window.nabQuickActionSettings;
	init();
} else {
	const el = document.getElementById( 'wp-admin-bar-nelio-ab-testing' );
	el?.parentNode?.removeChild( el );
} //end if

// =======
// HELPERS
// =======

function hasQuickActionSettings(
	w: unknown
): w is { nabQuickActionSettings: Settings } {
	return !! w && 'object' === typeof w && 'nabQuickActionSettings' in w;
} //end hasQuickActionSettings()

function init(): void {
	domReady( () => {
		const newExperimentButton = document.querySelector(
			'#wp-admin-bar-nelio-ab-testing-experiment-create a'
		);
		const newHeatmapButton = document.querySelector(
			'#wp-admin-bar-nelio-ab-testing-heatmap-create a'
		);

		if ( newExperimentButton ) {
			newExperimentButton.addEventListener(
				'click',
				onNewExperimentClick
			);
		} //end if

		if ( newHeatmapButton ) {
			newHeatmapButton.addEventListener( 'click', onNewHeatmapClick );
		} //end if
	} );
} //end init()

function onNewExperimentClick( ev: Event ) {
	ev.preventDefault();

	const { postId, postType, experimentType, root, nonce } = settings ?? {};
	if ( ! postId || ! postType || ! experimentType || ! root || ! nonce ) {
		return;
	} //end if

	if ( isCreatingExperimentOrHeatmap ) {
		return;
	} //end if
	isCreatingExperimentOrHeatmap = true;

	void fetch( `${ root }nab/v1/experiment`, {
		headers: {
			'content-type': 'application/json',
			'x-wp-nonce': nonce,
		},
		method: 'POST',
		body: JSON.stringify( {
			type: experimentType,
			addTestedPostScopeRule: true,
		} ),
	} )
		.then< Experiment >( ( response ) => response.json() )
		.then( ( experiment ) => {
			void fetch( `${ root }nab/v1/experiment/${ experiment.id }`, {
				headers: {
					'content-type': 'application/json',
					'x-wp-nonce': nonce,
				},
				method: 'PUT',
				body: JSON.stringify( {
					...experiment,
					alternatives: [
						{ id: 'control', attributes: { postId, postType } },
					],
				} ),
			} )
				.then< Experiment >( ( response ) => response.json() )
				.then( ( savedExperiment ) => {
					window.location.href = savedExperiment.links.edit; // phpcs:ignore
				} );
		} );
} //end onNewExperimentClick()

function onNewHeatmapClick( ev: Event ) {
	ev.preventDefault();
	if ( isCreatingExperimentOrHeatmap ) {
		return;
	} //end if
	isCreatingExperimentOrHeatmap = true;

	const { postId, postType, currentUrl, root, nonce } = settings ?? {};
	if ( ! root || ! nonce ) {
		return;
	} //end if

	void fetch( `${ root }nab/v1/experiment`, {
		headers: {
			'content-type': 'application/json',
			'x-wp-nonce': nonce,
		},
		method: 'POST',
		body: JSON.stringify( {
			type: 'nab/heatmap',
			addTestedPostScopeRule: false,
		} ),
	} )
		.then< Heatmap >( ( response ) => response.json() )
		.then( ( heatmap ) => {
			const experiment = {
				id: heatmap.id,
				type: 'nab/heatmap',
				trackingMode: postId ? 'post' : 'url',
				trackedPostId: postId ? postId : undefined,
				trackedPostType: postId ? postType : undefined,
				trackedUrl: ! postId ? currentUrl : undefined,
			};

			void fetch( `${ root }nab/v1/experiment/${ experiment.id }`, {
				headers: {
					'content-type': 'application/json',
					'x-wp-nonce': nonce,
				},
				method: 'PUT',
				body: JSON.stringify( experiment ),
			} )
				.then< Heatmap >( ( response ) => response.json() )
				.then( ( savedExperiment ) => {
					window.location.href = savedExperiment.links.edit; // phpcs:ignore
				} );
		} );
} //end onNewHeatmapClick()
