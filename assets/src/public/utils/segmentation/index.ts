/**
 * External dependencies
 */
import type { Dict, ExperimentId, SegmentationRule } from '@nab/types';

/**
 * Internal dependencies
 */
import { isValidSegmentationRule } from './segmentation-rules';
import { getCookie, removeCookie, setCookie } from '../cookies';
import { getExperimentsWithPageViews } from '../tracking';

import type { ExperimentSummary, HeatmapSummary, Settings } from '../../types';
import { getApiUrl } from '../helpers';

type SegmentationSettings = {
	readonly activeSegments: Partial<
		Record< ExperimentId, ReadonlyArray< number > >
	>;
	readonly geo: {
		readonly ipAddress: string;
		readonly location: string;
		readonly lastUpdate: string;
	};
};

export async function updateSegmentationSettings(
	settings: Settings
): Promise< void > {
	const allExperiments = settings.experiments;
	const allHeatmaps = settings.heatmaps;
	const relevantExperiments = allExperiments.filter(
		( e ) => e.active || 'site' === e.segmentEvaluation
	);

	if (
		isGeoDataNeeded( allExperiments, allHeatmaps ) &&
		isGeoDataOutdated()
	) {
		if ( isGeoDataNeededNow( relevantExperiments, allHeatmaps ) ) {
			await updateGeoData( settings );
		} else {
			setTimeout( () => void updateGeoData( settings ), 0 );
		} //end if
	} //end if

	updateActiveSegments( relevantExperiments );
} //end updateSegmentationSettings();

export function areSegmentsValid( settings: Settings ): boolean {
	const { experiments } = settings;
	const activeExperimentIds = experiments
		.filter( ( e ) => !! e.active )
		.map( ( e ) => e.id );

	if ( ! activeExperimentIds.length ) {
		return true;
	} //end if

	return settings.segmentMatching === 'all'
		? activeExperimentIds.every( doesExperimentHaveValidSegments )
		: activeExperimentIds.some( doesExperimentHaveValidSegments );
} //end areSegmentsValid()

export function doesExperimentHaveValidSegments( id: ExperimentId ): boolean {
	const activeSegments = getAllActiveSegments();
	return ! isEmptyArray( activeSegments[ id ] );
} //end doesExperimentHaveValidSegments()

const isHeatmapActive: Partial< Record< ExperimentId, boolean > > = {};
export function areHeatmapConditionsValid( heatmap: HeatmapSummary ): boolean {
	if ( undefined === isHeatmapActive[ heatmap.id ] ) {
		isHeatmapActive[ heatmap.id ] = heatmap.participation.every(
			isValidSegmentationRule
		);
	} //end if
	return !! isHeatmapActive[ heatmap.id ];
} //end if

export function getSegmentationGeoData(): Partial<
	SegmentationSettings[ 'geo' ]
> {
	const segmentationSettings = getSegmentationSettings();
	return segmentationSettings.geo || {};
} //end getSegmentationGeoData()

export function getAllActiveSegments(): Partial<
	Record< ExperimentId, ReadonlyArray< number > >
> {
	const segmentationSettings = getSegmentationSettings();
	const activeSegments = segmentationSettings.activeSegments || {};
	return activeSegments;
} //end getAllActiveSegments()

export function getActiveSegments(
	experiment: ExperimentSummary
): ReadonlyArray< number > {
	if ( isActiveSegmentImplicit( experiment ) ) {
		return [ 0 ];
	} //end if
	const activeSegments = getAllActiveSegments();
	return activeSegments[ experiment.id ] || [];
} //end getActiveSegments()

export function cleanOldSegments(
	experiments: ReadonlyArray< ExperimentId >
): void {
	const segmentationSettings = getSegmentationSettings();
	const activeSegments = segmentationSettings.activeSegments || {};

	const viewedExperimentIds = Object.keys( getExperimentsWithPageViews() )
		.map( ( id ) => Number.parseInt( id ) )
		.filter( ( id ) => ! isNaN( id ) && 0 < id );

	// Remove experiments that do not exist or didn't have views.
	const newActiveSegments = Object.keys( activeSegments )
		.map( ( experimentId ) => Number.parseInt( experimentId ) )
		.filter(
			( experimentId ): experimentId is ExperimentId =>
				! isNaN( experimentId ) && 0 < experimentId
		)
		.reduce(
			( result, experimentId ) => {
				if (
					experiments.includes( experimentId ) ||
					viewedExperimentIds.includes( experimentId )
				) {
					result[ experimentId ] =
						activeSegments[ experimentId ] ?? [];
				} //end if
				return result;
			},
			{} as Partial< Record< ExperimentId, ReadonlyArray< number > > >
		);

	setSegmentationSettings( {
		...segmentationSettings,
		activeSegments: newActiveSegments,
	} );
} //end cleanOldSegments()

// =======
// HELPERS
// =======

function getSegmentationSettings(): Partial< SegmentationSettings > {
	try {
		return JSON.parse(
			getCookie( 'nabSegmentation' ) || '{}'
		) as Partial< SegmentationSettings >;
	} catch ( _ ) {
		return {};
	} //end try
} //end getSegmentationSettings()

function setSegmentationSettings( settings: Partial< SegmentationSettings > ) {
	if (
		! settings.geo &&
		! Object.values( settings.activeSegments ?? [] ).length
	) {
		removeCookie( 'nabSegmentation' );
		return;
	} //end if
	setCookie( 'nabSegmentation', JSON.stringify( settings ), {
		expires: 120,
	} );
} //end setSegmentationSettings()

function isGeoDataOutdated() {
	const geoData = getSegmentationGeoData();
	if ( ! geoData.lastUpdate ) {
		return true;
	} //end if

	const lastUpdate = geoData.lastUpdate;
	const now = new Date().getTime();
	const lastUpdateDate = new Date( lastUpdate ).getTime();
	const diffTime = Math.abs( now - lastUpdateDate );
	const diffDays = Math.ceil( diffTime / ( 1000 * 60 * 60 * 24 ) );

	return isNaN( diffDays ) || diffDays > 7; // Update segmentation data every week.
} //end isGeoDataOutdated()

const isGeoDataNeeded = (
	exps: Settings[ 'experiments' ],
	heatmaps: Settings[ 'heatmaps' ]
) =>
	exps.some( ( e ) =>
		e.segments.some( ( s ) => s.segmentationRules.some( isGeoRule ) )
	) || heatmaps.some( ( h ) => h.participation.some( isGeoRule ) );

const isGeoRule = ( r: SegmentationRule ) =>
	r.type === 'nab/ip-address' || r.type === 'nab/location';

const isGeoDataNeededNow = (
	exps: Settings[ 'experiments' ],
	heatmaps: Settings[ 'heatmaps' ]
) =>
	isGeoDataNeeded(
		exps.filter( ( e ) => e.active ),
		heatmaps
	);

async function updateGeoData( settings: Settings ) {
	try {
		const url = getApiUrl( settings.api, '/ipc', {
			siteId: settings.site,
		} );
		const res = await window.fetch( url );
		const data: string = await res.text();
		const jsonData = JSON.parse( data ) as Dict;
		if ( ! hasGeoData( jsonData ) ) {
			return;
		} //end if

		setSegmentationSettings( {
			...getSegmentationSettings(),
			geo: {
				ipAddress: jsonData.ip,
				location: jsonData.location,
				lastUpdate: new Date().toISOString(),
			},
		} );
	} catch ( _ ) {}
} //end updateGeoData()

function updateActiveSegments( experiments: Settings[ 'experiments' ] ) {
	const segmentationSettings = getSegmentationSettings();
	const previousActiveSegments = segmentationSettings.activeSegments || {};

	const activeSegments = experiments.reduce(
		( r, e ) =>
			isActiveSegmentImplicit( e )
				? r
				: { ...r, [ e.id ]: calculateActiveSegments( e ) },
		{} as SegmentationSettings[ 'activeSegments' ]
	);

	setSegmentationSettings( {
		...segmentationSettings,
		activeSegments: {
			...activeSegments,
			...previousActiveSegments,
		},
	} );
} //end updateActiveSegments()

function calculateActiveSegments(
	experiment: ExperimentSummary
): ReadonlyArray< number > {
	const activeSegments = experiment.segments
		.map( ( { segmentationRules }, index ) =>
			segmentationRules.every( isValidSegmentationRule ) ? index + 1 : 0
		)
		.filter( ( segmentIndex ) => 0 < segmentIndex );

	return activeSegments.length ? [ 0, ...activeSegments ] : [];
} //end calculateActiveSegments()

const isEmptyArray = ( arr?: unknown ): arr is unknown[] =>
	!! arr && Array.isArray( arr ) && ! arr.length;

const hasGeoData = (
	x: Dict
): x is {
	readonly ip: string;
	readonly location: string;
} => !! x.ip && !! x.location;

const isActiveSegmentImplicit = ( e: ExperimentSummary ): boolean =>
	! e.segments.length;
