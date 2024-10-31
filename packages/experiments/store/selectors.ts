/**
 * External dependencies
 */
import type {
	Dict,
	ExperimentEditProps,
	ExperimentType,
	ExperimentTypeName,
	Maybe,
} from '@nab/types';

/**
 * Internal dependencies
 */
import type { State } from './types';

export function getExperimentTypes(
	state: State
): Record< ExperimentTypeName, ExperimentType > {
	return state.experimentTypes;
} //end getExperimentTypes()

export function getExperimentType(
	state: State,
	name: ExperimentTypeName
): Maybe< ExperimentType > {
	return state.experimentTypes[ name ];
} //end getExperimentType()

type GetExperimentSupport = typeof _getExperimentSupport & {
	CurriedSignature: < F extends keyof ExperimentType[ 'supports' ] >(
		nameOrType: ExperimentTypeName | ExperimentType,
		feature: F
	) => Maybe< ExperimentType[ 'supports' ][ F ] >;
};
export const getExperimentSupport =
	_getExperimentSupport as GetExperimentSupport;
function _getExperimentSupport< F extends keyof ExperimentType[ 'supports' ] >(
	state: State,
	nameOrType: ExperimentTypeName | ExperimentType,
	feature: F
): Maybe< ExperimentType[ 'supports' ][ F ] > {
	const experimentType = getNormalizedExperimentType( state, nameOrType );
	return experimentType?.supports[ feature ];
} //end _getExperimentSupport()

export function hasExperimentSupport(
	state: State,
	nameOrType: ExperimentTypeName | ExperimentType,
	feature: keyof ExperimentType[ 'supports' ]
): boolean {
	return !! getExperimentSupport( state, nameOrType, feature );
} //end hasExperimentSupport()

export function getExperimentView(
	state: State,
	nameOrType: ExperimentTypeName | ExperimentType,
	view: keyof ExperimentType[ 'views' ]
): Maybe< ( props: ExperimentEditProps< Dict > ) => JSX.Element > {
	const experimentType = getNormalizedExperimentType( state, nameOrType );
	if ( ! experimentType ) {
		return;
	} //end if

	return experimentType.views[ view ];
} //end getExperimentView()

export function getHelpString(
	state: State,
	nameOrType: ExperimentTypeName | ExperimentType,
	help: keyof ExperimentType[ 'help' ]
): string {
	const experimentType = getNormalizedExperimentType( state, nameOrType );
	return experimentType?.help[ help ] || '';
} //end getHelpString()

// =======
// HELPERS
// =======

const getNormalizedExperimentType = (
	state: State,
	nameOrType: ExperimentTypeName | ExperimentType
): Maybe< ExperimentType > =>
	'string' === typeof nameOrType
		? getExperimentType( state, nameOrType )
		: nameOrType;
