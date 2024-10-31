/**
 * Internal dependencies
 */
import type { Attributes } from '../store/types';

export type FieldSettingProps = {
	readonly name: string;
};

export type Setter< A extends Attributes > = ( attrs: Partial< A > ) => void;
