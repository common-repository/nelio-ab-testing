/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { useEffect } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { keyBy, values } from 'lodash';
import { store as NAB_DATA } from '@nab/data';
import { isInTheFuture } from '@nab/date';
import { store as NAB_EDITOR } from '@nab/editor';
import { store as NAB_SEGMENTS } from '@nab/segmentation-rules';
import { getLocalUrlError, isEmpty } from '@nab/utils';
import type { Experiment, Maybe, SegmentationRule } from '@nab/types';

export const StatusManager = (): null => {
	const attributes = useAttributes();
	const updateStatus = useStatusUpdater();
	const paused = attributes.status.includes( 'paused' );
	const getConditionError = useGetConditionError();

	useEffect( () => {
		const {
			homeUrl,
			mode,
			name,
			participationConditions,
			postId,
			postType,
			startDate,
			status,
			url,
		} = attributes;

		if ( 'running' === status ) {
			return;
		} //end if

		if ( isEmpty( name ) ) {
			updateStatus(
				paused ? 'paused_draft' : 'draft',
				_x(
					'Please name your Heatmap test',
					'user',
					'nelio-ab-testing'
				)
			);
			return;
		} //end if

		if ( 'post' === mode && ! postId ) {
			switch ( postType ) {
				case 'product':
					updateStatus(
						paused ? 'paused_draft' : 'draft',
						_x(
							'Please select the product to track',
							'user',
							'nelio-ab-testing'
						)
					);
					return;
				case 'post':
					updateStatus(
						paused ? 'paused_draft' : 'draft',
						_x(
							'Please select the post to track',
							'user',
							'nelio-ab-testing'
						)
					);
					return;
				case 'page':
					updateStatus(
						paused ? 'paused_draft' : 'draft',
						_x(
							'Please select the page to track',
							'user',
							'nelio-ab-testing'
						)
					);
					return;
				default:
					updateStatus(
						paused ? 'paused_draft' : 'draft',
						_x(
							'Please select a page to track',
							'user',
							'nelio-ab-testing'
						)
					);
					return;
			} //end switch
		} //end if

		if ( 'url' === mode && getLocalUrlError( url, homeUrl ) ) {
			updateStatus(
				paused ? 'paused_draft' : 'draft',
				getLocalUrlError( url, homeUrl ) || ''
			);
			return;
		} //end if

		const participationError = participationConditions.reduce(
			( error, condition ) =>
				error ? error : getConditionError( condition ),
			undefined as Maybe< string >
		);
		if ( participationError ) {
			updateStatus(
				paused ? 'paused_draft' : 'draft',
				participationError
			);
			return;
		} //end if

		if ( 'scheduled' === status && ! isInTheFuture( startDate ) ) {
			updateStatus( paused ? 'paused' : 'ready' );
			return;
		} //end if

		if ( 'scheduled' !== status ) {
			updateStatus( paused ? 'paused' : 'ready' );
		} //end if
	}, [ JSON.stringify( attributes ) ] );

	return null;
};

// =====
// HOOKS
// =====

const useAttributes = () =>
	useSelect( ( select ) => {
		const { getPluginSetting } = select( NAB_DATA );
		const { getExperimentAttribute, getHeatmapAttribute } =
			select( NAB_EDITOR );

		return {
			homeUrl: getPluginSetting( 'homeUrl' ),
			mode: getHeatmapAttribute( 'trackingMode' ) ?? 'post',
			name: getExperimentAttribute( 'name' ),
			participationConditions:
				getHeatmapAttribute( 'participationConditions' ) ?? [],
			postId: getHeatmapAttribute( 'trackedPostId' ) ?? 0,
			postType: getHeatmapAttribute( 'trackedPostType' ) ?? 'page',
			startDate: getExperimentAttribute( 'startDate' ),
			status: getExperimentAttribute( 'status' ),
			url: getHeatmapAttribute( 'trackedUrl' ) ?? '',
		};
	} );

const useStatusUpdater = () => {
	const { setDraftStatusRationale, setExperimentData } =
		useDispatch( NAB_EDITOR );

	return ( status: Experiment[ 'status' ], rationale?: string ) => {
		void setExperimentData( { status } );
		void setDraftStatusRationale( rationale ?? '' );
	};
};

const useGetConditionError = () => {
	const segmentationRuleTypes = useSelect( ( select ) =>
		keyBy( select( NAB_SEGMENTS ).getSegmentationRuleTypes() || [], 'name' )
	);
	return ( condition: SegmentationRule ): string => {
		const errors =
			segmentationRuleTypes[ condition.type ]?.validate?.(
				condition.attributes
			) ?? {};
		return values( errors )[ 0 ] ?? '';
	};
};
