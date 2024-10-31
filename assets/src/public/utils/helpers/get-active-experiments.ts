/**
 * Internal dependencies
 */
import type { ActiveExperiment, Experiment, Session } from '../../types';

export const getActiveExperiments = (
	session: Session
): ReadonlyArray< ActiveExperiment > =>
	session.experiments.filter( isActiveExperiment );

const isActiveExperiment = ( e: Experiment ): e is ActiveExperiment => e.active;
