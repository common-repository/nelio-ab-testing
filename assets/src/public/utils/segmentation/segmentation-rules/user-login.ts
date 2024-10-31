/**
 * Internal dependencies
 */
import { getCookie } from '../../cookies';
import type { Attributes } from '../../../../../../packages/segmentation-rule-library/rules/user-login/types';

export const type = 'nab/user-login';

export function validate( attributes: Attributes ): boolean {
	const { condition } = attributes;
	const isUserLoggedIn = !! getCookie( 'nabIsUserLoggedIn' );

	switch ( condition ) {
		case 'is-logged-in':
			return isUserLoggedIn;

		case 'is-not-logged-in':
			return ! isUserLoggedIn;
	} //end switch
} //end validate()
