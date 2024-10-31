/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, resolveSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { find, values } from 'lodash';
import type {
	EntityKind,
	EntityKindName,
	EntityId,
	EntityInstance,
} from '@nab/types';

/**
 * Internal dependencies
 */
import { store as NAB_DATA } from '../../../store';

export async function getKindEntities(): Promise< void > {
	try {
		const response = await apiFetch< Record< EntityKindName, EntityKind > >(
			{ path: '/nab/v1/types' }
		);
		await dispatch( NAB_DATA ).receiveKindEntitiesQuery(
			values( response )
		);
	} catch ( e ) {
		// eslint-disable-next-line
		console.warn( e );
	} //end try
} //end getKindEntities()

export async function getEntityRecord(
	kind?: EntityKindName,
	key?: EntityId
): Promise< void > {
	if ( ! kind || ! key ) {
		return;
	} //end if

	try {
		const entities = await resolveSelect( NAB_DATA ).getKindEntities();
		const entity = find( entities, { name: kind } );
		if ( ! entity ) {
			// eslint-disable-next-line
			console.warn( `Entity ${ kind } not found in`, entities );
			return;
		} //end if

		const record = await apiFetch< EntityInstance >( {
			path: `/nab/v1/post/?id=${ key }&type=${ kind }`,
		} );
		await dispatch( NAB_DATA ).receiveEntityRecords( kind, record );
	} catch ( e ) {
		// eslint-disable-next-line
		console.warn( e );
	} //end try
} //end getEntityRecord()
