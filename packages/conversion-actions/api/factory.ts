/**
 * WordPress dependencies
 */
import { select } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { v4 as uuid } from 'uuid';
import type {
	ConversionAction,
	ConversionActionTypeName,
	Dict,
	Maybe,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { store as NAB_ACTIONS } from '../store';

/**
 * Creates a new conversion action of the given type using the given attributes.
 *
 * @param {string} typeName   the type of the new conversion action.
 * @param {Object} attributes the attributes of the new conversion action.
 *
 * @return {Object} an instance of the given conversion action.
 */
export function createConversionAction(
	typeName: ConversionActionTypeName,
	attributes?: Dict
): Maybe< ConversionAction > {
	const { getConversionActionType } = select( NAB_ACTIONS );
	const conversionActionType = getConversionActionType( typeName );

	if ( ! conversionActionType ) {
		return undefined;
	} //end if

	return {
		id: uuid(),
		type: typeName,
		attributes: {
			...conversionActionType.attributes,
			...( attributes || {} ),
		},
		scope: conversionActionType.scope,
	};
} //end createConversionAction()
