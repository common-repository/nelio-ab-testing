/**
 * WordPress dependencies
 */
import {
	select as doSelect,
	useDispatch,
	useSelect,
} from '@safe-wordpress/data';
import { useEffect, useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { isEqual, find, keyBy, map } from 'lodash';
import { store as NAB_ACTIONS } from '@nab/conversion-actions';
import { isInTheFuture } from '@nab/date';
import { store as NAB_SEGMENTS } from '@nab/segmentation-rules';
import type { Alternative, Experiment, Goal, Segment } from '@nab/types';

/**
 * Internal dependencies
 */
import { shouldExperimentBeDraft } from './utils';
import { useExperimentAttribute, useExperimentType } from '../hooks';
import { store as NAB_EDITOR } from '../../store';

export const StatusManager = (): null => {
	useStatusUpdateEffect();
	useInvalidControlEffect();
	return null;
};

// =====
// HOOKS
// =====

const useStatusUpdateEffect = () => {
	const rationale = useDraftRationale();
	const startDate = useExperimentAttribute( 'startDate' )[ 0 ] || '';
	const [ status, setStatus ] = useExperimentAttribute( 'status' );

	const { setDraftStatusRationale } = useDispatch( NAB_EDITOR );
	const setStatusAndRationale = (
		newStatus: Experiment[ 'status' ],
		newRationale?: string
	): void => {
		if ( status.includes( 'paused' ) ) {
			newStatus = 'draft' === newStatus ? 'paused_draft' : 'paused';
		} //end if
		setStatus( newStatus );
		void setDraftStatusRationale( newRationale ?? '' );
	};

	useEffect( () => {
		if ( 'running' === status || 'trash' === status ) {
			return;
		} //end if

		if ( rationale ) {
			setStatusAndRationale( 'draft', rationale );
			return;
		} //end if

		if ( 'ready' === status ) {
			return;
		} //end if

		if ( 'scheduled' === status && ! isInTheFuture( startDate ) ) {
			setStatusAndRationale( 'ready' );
		} //end if

		if ( 'scheduled' !== status ) {
			setStatusAndRationale( 'ready' );
		} //end if
	}, [ rationale, startDate, status ] );
};

const useInvalidControlEffect = () => {
	const [ status ] = useExperimentAttribute( 'status' );
	const alternatives = useAlternatives();
	const type = useExperimentType();
	const control = find( alternatives, { id: 'control' } );
	const wasInvalid = useSelect( ( select ) =>
		select( NAB_EDITOR ).isTestedElementInvalid()
	);

	const { setTestedElementAsInvalid } = useDispatch( NAB_EDITOR );

	useEffect( () => {
		if ( 'running' === status ) {
			return;
		} //end if

		const isInvalid =
			!! control &&
			!! type &&
			!! type.checks.getControlError( control.attributes, doSelect );
		if ( ! isEqual( wasInvalid, isInvalid ) ) {
			void setTestedElementAsInvalid( isInvalid );
		} //end if
	}, [ control, doSelect, type, wasInvalid ] );
};

const useDraftRationale = () => {
	const [ rationale, setRationale ] = useState( '' );

	const name = useExperimentAttribute( 'name' )[ 0 ] || '';
	const type = useExperimentType();

	const alternatives = useAlternatives();
	const goals = useGoals();
	const segments = useSegments();

	const conversionActionTypes = useConversionActionTypes();
	const segmentationRuleTypes = useSegmentationRuleTypes();

	useEffect( () => {
		if ( ! type ) {
			setRationale( _x( 'Type not found', 'text', 'nelio-ab-testing' ) );
			return;
		} //end if
		const control = find( alternatives, { id: 'control' } ) as Alternative;
		const newRationale = shouldExperimentBeDraft(
			{ name, control, alternatives, goals, segments, type },
			conversionActionTypes,
			segmentationRuleTypes
		);
		setRationale( newRationale || '' );
	}, [
		name,
		type,
		JSON.stringify( alternatives ),
		JSON.stringify( goals ),
		JSON.stringify( segments ),
	] );

	return rationale;
};

const useAlternatives = (): ReadonlyArray< Alternative > =>
	useSelect( ( select ) => select( NAB_EDITOR ).getAlternatives() );

const useGoals = (): ReadonlyArray< Goal > =>
	useSelect( ( select ) => {
		const { getGoals, getConversionActions } = select( NAB_EDITOR );
		return map( getGoals(), ( goal ) => ( {
			...goal,
			conversionActions: getConversionActions( goal.id ),
		} ) );
	} );

const useSegments = (): ReadonlyArray< Segment > =>
	useSelect( ( select ) => {
		const { getSegments, getSegmentationRules } = select( NAB_EDITOR );
		return map( getSegments(), ( segment ) => ( {
			...segment,
			segmentationRules: getSegmentationRules( segment.id ),
		} ) );
	} );

const useConversionActionTypes = () =>
	useSelect( ( select ) =>
		keyBy( select( NAB_ACTIONS ).getConversionActionTypes() || [], 'name' )
	);

const useSegmentationRuleTypes = () =>
	useSelect( ( select ) =>
		keyBy( select( NAB_SEGMENTS ).getSegmentationRuleTypes() || [], 'name' )
	);
