/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import {
	createInterpolateElement,
	useEffect,
	useState,
} from '@safe-wordpress/element';
import { Button, Dashicon, ExternalLink } from '@safe-wordpress/components';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { difference } from 'lodash';
import { AnimatedList } from '@nab/components';
import { addFreeTracker, createAlternative } from '@nab/utils';
import type { AlternativeId } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { AlternativeContainer } from './alternative-container';
import { AlternativePreviewer } from '../alternative-previewer';
import {
	useCanAddAlternatives,
	useIsExperimentPaused,
	useSubscription,
} from '../hooks';
import { store as NAB_EDITOR } from '../../store';

export const AlternativeSection = (): JSX.Element => {
	const [ control, ...alternativeIds ] = useAlternativeIds();
	const addAlternative = useAddAlternative();
	const isExperimentPaused = useIsExperimentPaused();
	const subscription = useSubscription();
	const isTestedElementInvalid = useIsTestedElementInvalid();
	const isReplacingAlternatives = useIsReplacingAlternatives();
	const canAddAlternatives = useCanAddAlternatives();

	return (
		<div className="nab-edit-experiment__alternative-section">
			<h2>
				{ createInterpolateElement(
					sprintf(
						/* translators: dashicon */
						_x(
							'%s Control Version and Variants',
							'text',
							'nelio-ab-testing'
						),
						'<icon></icon>'
					),
					{
						icon: (
							<Dashicon
								className="nab-alternative-section__title-icon"
								icon="randomize"
							/>
						),
					}
				) }
			</h2>

			<div className="nab-alternative-list">
				{ !! control && (
					<AlternativeContainer
						key="control"
						index={ 0 }
						alternativeId="control"
						disabled={ isTestedElementInvalid }
					/>
				) }

				<AnimatedList
					disableAnimations={ isReplacingAlternatives }
					exit={ 500 }
				>
					{ alternativeIds.map( ( alternativeId, index ) => (
						<AlternativeContainer
							key={ alternativeId }
							index={ index + 1 }
							alternativeId={ alternativeId }
							disabled={ isTestedElementInvalid }
						/>
					) ) }
				</AnimatedList>
			</div>

			<div className="nab-edit-experiment-alternative-section__new-variant-container">
				{ canAddAlternatives && (
					<Button
						variant="secondary"
						key="new-variant"
						disabled={ isTestedElementInvalid }
						onClick={ () => addAlternative() }
					>
						{ _x( 'New Variant', 'command', 'nelio-ab-testing' ) }
					</Button>
				) }
				{ ! isExperimentPaused && ! subscription && (
					<ExternalLink
						className="components-button is-secondary"
						href={ addFreeTracker(
							_x(
								'https://neliosoftware.com/testing/pricing/',
								'text',
								'nelio-ab-testing'
							)
						) }
					>
						{ _x(
							'Subscribe to Add More Variants',
							'user',
							'nelio-ab-testing'
						) }
					</ExternalLink>
				) }
			</div>
			<AlternativePreviewer />
		</div>
	);
};

// =====
// HOOKS
// =====

const useAlternativeIds = () =>
	useSelect( ( select ) => select( NAB_EDITOR ).getAlternativeIds() );

const useAddAlternative = () => {
	const { addAlternatives } = useDispatch( NAB_EDITOR );
	return () => addAlternatives( createAlternative() );
};

const useIsTestedElementInvalid = () =>
	useSelect( ( select ) => select( NAB_EDITOR ).isTestedElementInvalid() );

const useIsReplacingAlternatives = () => {
	const [ prevAltIds, setPrevAltIds ] = useState<
		ReadonlyArray< AlternativeId >
	>( [] );
	const prevStr = prevAltIds.join( ';' );

	const altIds = useAlternativeIds();
	const currStr = altIds.join( ';' );

	// Keep track of the previous alt IDs.
	useEffect( () => {
		if ( prevStr !== currStr ) {
			setPrevAltIds( altIds );
		} //end if
	}, [ prevStr, currStr ] );

	// Disable animations if several changes at once.
	if ( prevStr === currStr ) {
		return false;
	} //end if

	// This works under the assumption that, usually, there’s only one change
	// at a time (i.e. adding or removing a single alternative).
	const severalChanges = ( x: string, y: string ) => {
		const xs = x.split( ';' );
		const ys = y.split( ';' );
		const d1 = difference( xs, ys );
		const d2 = difference( ys, xs );
		return !! d1.length && !! d2.length;
	};

	return severalChanges( prevStr, currStr );
};
