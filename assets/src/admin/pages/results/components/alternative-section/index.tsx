/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { createInterpolateElement } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NAB_DATA } from '@nab/data';
import type {
	Alternative,
	GoalId,
	Results,
	ECommercePlugin,
	Experiment,
	ExperimentId,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { AlternativeContainer } from './alternative-container';
import { useAreUniqueResultsVisible } from '../hooks';
import './style.scss';

export const AlternativeSection = (): JSX.Element => {
	const {
		activeGoal,
		alternatives = [],
		areResultsUnique,
		isPublicView,
		experimentId,
		experimentStatus,
		ecommerce,
		results,
		winnerAlternative,
		totalPageViews,
	} = useAlternativesData();

	const alternativeId = alternatives[ 0 ]?.id;
	const data = alternativeId ? results?.[ alternativeId ] : undefined;

	const controlRevenue = areResultsUnique
		? data?.uniqueValues?.[ activeGoal ] || 0
		: data?.values?.[ activeGoal ] || 0;

	const controlConversions = areResultsUnique
		? data?.uniqueConversions?.[ activeGoal ] || 0
		: data?.conversions?.[ activeGoal ] || 0;

	const controlArpc = ! controlConversions
		? 0
		: controlRevenue / controlConversions;

	return (
		<div className="nab-alternative-section">
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
				{ alternatives.map( ( alternative, index ) => (
					<AlternativeContainer
						key={ alternative.id }
						index={ index }
						experimentId={ experimentId }
						alternative={ alternative }
						result={ results?.[ alternative.id ] }
						isWinner={ winnerAlternative === index }
						ecommerce={ ecommerce }
						controlRevenue={ controlRevenue }
						controlArpc={ controlArpc }
						goal={ activeGoal }
						experimentStatus={ experimentStatus }
						totalPageViews={ totalPageViews }
						areResultsUnique={ areResultsUnique }
						isPublicView={ isPublicView }
					/>
				) ) }
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useAlternativesData = () => {
	const [ areResultsUnique ] = useAreUniqueResultsVisible();

	return useSelect( ( select ): AlternativesData => {
		const {
			getExperimentAttribute,
			getResultsOfAlternatives,
			getWinnerAlternative,
			getPageAttribute,
			getPageViews,
			getECommercePlugin,
		} = select( NAB_DATA );

		const expId = getPageAttribute( 'editor/activeExperiment' );
		if ( ! expId ) {
			return NO_DATA;
		} //end if

		const isPublicView = getPageAttribute( 'editor/isPublicView' ) ?? false;

		const goals = getExperimentAttribute( expId, 'goals' );
		if ( ! goals?.length ) {
			return NO_DATA;
		} //end if

		const activeGoal =
			getPageAttribute( 'editor/activeGoal' ) ?? goals[ 0 ]?.id ?? '';

		return {
			experimentId: expId,
			experimentStatus:
				getExperimentAttribute( expId, 'status' ) ?? 'draft',
			alternatives: getExperimentAttribute( expId, 'alternatives' ) ?? [],
			areResultsUnique,
			isPublicView,
			results: getResultsOfAlternatives( expId ),
			activeGoal,
			ecommerce: getECommercePlugin( expId, activeGoal ),
			winnerAlternative: getWinnerAlternative( expId, activeGoal ),
			totalPageViews: getPageViews( expId ),
		};
	} );
};

// =====
// DATA
// =====

type AlternativesData = {
	readonly experimentId: ExperimentId;
	readonly experimentStatus: Experiment[ 'status' ];
	readonly alternatives: ReadonlyArray< Alternative >;
	readonly areResultsUnique: boolean;
	readonly isPublicView: boolean;
	readonly results?: Results[ 'alternatives' ];
	readonly activeGoal: GoalId;
	readonly ecommerce?: ECommercePlugin;
	readonly winnerAlternative?: number;
	readonly totalPageViews: number;
};

const NO_DATA: AlternativesData = {
	experimentId: 0,
	experimentStatus: 'draft' as Experiment[ 'status' ],
	alternatives: [],
	activeGoal: '',
	areResultsUnique: false,
	isPublicView: false,
	ecommerce: undefined,
	totalPageViews: 0,
};
