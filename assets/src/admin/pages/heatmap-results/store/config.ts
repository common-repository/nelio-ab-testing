import { State as DataState } from './data/config';
import { State as UIState } from './ui/config';
import { State as MiscState } from './misc/config';

export type State = {
	readonly data: DataState;
	readonly ui: UIState;
	readonly misc: MiscState;
};
