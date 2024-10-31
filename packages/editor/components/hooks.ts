/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NAB_DATA, usePluginSetting } from '@nab/data';
import { store as NAB_EXPERIMENTS } from '@nab/experiments';
import type { ExperimentType, Maybe, SubscriptionPlan } from '@nab/types';

/**
 * Internal dependencies
 */
import { store as NAB_EDITOR } from '../store';
import type { ExperimentAttributes } from '../store/types';

export function useExperimentAttribute< K extends keyof ExperimentAttributes >(
	attr: K
): Readonly<
	[ ExperimentAttributes[ K ], ( v: ExperimentAttributes[ K ] ) => void ]
> {
	const value = useSelect( ( select ) =>
		select( NAB_EDITOR ).getExperimentAttribute( attr )
	);

	const { setExperimentData } = useDispatch( NAB_EDITOR );
	const setValue = ( v: ExperimentAttributes[ K ] ): void =>
		void setExperimentData( { [ attr ]: v } );

	return [ value, setValue ] as const;
} //end useExperimentAttribute()

export function useExperimentType(): Maybe< ExperimentType > {
	const typeName = useExperimentAttribute( 'type' )[ 0 ];
	return useSelect( ( select ) =>
		select( NAB_EXPERIMENTS ).getExperimentType( typeName )
	);
} //end useExperimentType()

export const useIsSubscribedTo = ( plan: SubscriptionPlan ): boolean =>
	useSelect( ( select ) => select( NAB_DATA ).isSubscribedTo( plan ) );

export const useCanAddAlternatives = (): boolean => {
	const subscription = useSubscription();
	const maxAlternatives = Math.min(
		8,
		usePluginSetting( 'maxCombinations' )
	);
	const numOfAlternatives = useSelect(
		( select ) => select( NAB_EDITOR ).getAlternativeIds().length
	);
	const isExperimentPaused = useIsExperimentPaused();
	return (
		! isExperimentPaused &&
		!! subscription &&
		numOfAlternatives < maxAlternatives
	);
};

export const useIsExperimentPaused = (): boolean => {
	const [ status ] = useExperimentAttribute( 'status' );
	return status.includes( 'paused' );
};

export const useSubscription = (): SubscriptionPlan | false =>
	useSelect( ( select ) =>
		select( NAB_DATA ).getPluginSetting( 'subscription' )
	);
