/**
 * External dependencies
 */
import type { Uuid } from 'uuid';

/**
 * Internal dependencies
 */
import type { ExperimentId } from './experiments';

export type TrackEvent =
	| VisitEvent
	| ConversionEvent
	| UniqueVisitEvent
	| UniqueConversionEvent
	| ClickEvent
	| ScrollEvent;

export type VisitEvent = {
	readonly kind: 'visit';
	readonly type: 'regular' | 'global' | 'woocommerce';
	readonly experiment: ExperimentId;
	readonly alternative: number;
	readonly segments: ReadonlyArray< number >;
};

export type UniqueVisitEvent = Omit< VisitEvent, 'kind' > & {
	readonly kind: 'uvisit';
	readonly id: Uuid;
};

export type ConversionEvent = {
	readonly kind: 'conversion';
	readonly experiment: ExperimentId;
	readonly alternative: number;
	readonly goal: number;
	readonly segments: ReadonlyArray< number >;
};

export type UniqueConversionEvent = Omit< ConversionEvent, 'kind' > & {
	readonly kind: 'uconversion';
	readonly id: string;
};

export type ClickEvent = {
	readonly kind: 'click';
	readonly experiment: ExperimentId;
	readonly alternative: number;
	readonly timeToClick: number;
	readonly windowWidth: number;
	readonly xpath: string;
	readonly x: number;
	readonly y: number;
};

export type ScrollEvent = {
	readonly kind: 'scroll';
	readonly experiment: ExperimentId;
	readonly alternative: number;
	readonly documentHeight: number;
	readonly firstFold: number;
	readonly maxScroll: number;
	readonly sweetSpot: number;
	readonly windowWidth: number;
};

export type PageViewThrottleSettings = {
	readonly global: number;
	readonly woocommerce: number;
};
