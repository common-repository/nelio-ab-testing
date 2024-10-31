/**
 * External dependencies
 */
import type { EntityId, EntityKindName } from '@nab/types';

export type Attributes = {
	readonly formType: EntityKindName;
	readonly formId: EntityId;
	readonly formName?: string;
};
