/**
 * External dependencies
 */
import { castArray, find } from 'lodash';
import { isEmpty } from '@nab/utils';
import type { EntityKind, ExperimentType as ET } from '@nab/types';

type ExperimentType = ET & {
	readonly _isDisabled: boolean;
	readonly _usesPresetAlternatives: boolean;
	readonly _hasPresetAlternatives: boolean;
};

export function isExperimentTypeDisabled(
	type: ExperimentType,
	postTypes: ReadonlyArray< EntityKind >
): boolean {
	if ( type._isDisabled ) {
		return true;
	} //end if

	if (
		isLimitedToCertainPostTypes( type ) &&
		! areSupportedPostTypesAvailable( type, postTypes )
	) {
		return true;
	} //end if

	return type._usesPresetAlternatives && ! type._hasPresetAlternatives;
} //end isExperimentTypeDisabled()

// =======
// HELPERS
// =======

function isLimitedToCertainPostTypes( experimentType: ExperimentType ) {
	return (
		! isEmpty( experimentType.supports.postTypes ) ||
		! isEmpty( experimentType.supports.postTypeExceptions )
	);
} //end isLimitedToCertainPostTypes()

function areSupportedPostTypesAvailable(
	experimentType: ExperimentType,
	postTypes: ReadonlyArray< EntityKind >
) {
	if ( experimentType.supports.postTypes ) {
		const postTypeNames = castArray( experimentType.supports.postTypes );
		return !! find( postTypes, ( postType ) =>
			postTypeNames.includes( postType.name )
		);
	} //end if

	if ( experimentType.supports.postTypeExceptions ) {
		const postTypeExceptions = castArray(
			experimentType.supports.postTypeExceptions
		);
		return !! find(
			postTypes,
			( postType ) => ! postTypeExceptions.includes( postType.name )
		);
	} //end if

	return false;
} //end areSupportedPostTypesAvailable()
