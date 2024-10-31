/**
 * External dependencies
 */
import type {
	AlternativeId,
	ECommercePlugin,
	EntityId,
	EntityInstance,
	EntityKind,
	EntityKindName,
	Experiment,
	ExperimentId,
	ExperimentTypeName,
	FastSpringProduct,
	GoalId,
	Maybe,
	MediaId,
	Menu,
	MenuId,
	OrderStatus,
	PluginSettings,
	Quota,
	Results,
	SegmentId,
	Template,
	TemplateContextGroup,
	TemplateContextGroupName,
	Theme,
	ThemeId,
	Url,
} from '@nab/types';

export type State = {
	readonly entities: {
		readonly config: ReadonlyArray< EntityKind >;
		readonly data: Record<
			EntityKindName,
			Partial< Record< EntityId, EntityInstance > >
		>;
	};

	readonly experiments: Partial< Record< ExperimentId, Experiment > >;

	readonly fastspring: {
		readonly currency: string;
		readonly products: ReadonlyArray< FastSpringProduct >;
		readonly subscriptionId: string;
	};

	readonly media: Partial< Record< MediaId, Url > >;

	readonly page: PageAttributes;

	readonly results: Partial< Record< ExperimentId, Results > >;

	readonly settings: {
		readonly today: string;
		readonly menus: Partial< Record< MenuId, Menu > >;
		readonly nelio: PluginSettings;
		readonly plugins: ReadonlyArray< string >;
		readonly templateContexts: Record<
			TemplateContextGroupName,
			TemplateContextGroup
		>;
		readonly templates: Record< EntityKindName, ReadonlyArray< Template > >;
		readonly themes: Partial< Record< ThemeId, Theme > >;
		readonly ecommerce: Record< ECommercePlugin, ECommerceSettings >;
	};

	readonly siteQuota: Maybe< Quota >;
};

export type ECommerceSettings = {
	readonly currency: string;
	readonly currencyPosition: 'before' | 'after';
	readonly currencySymbol: string;
	readonly decimalSeparator: string;
	readonly numberOfDecimals: number;
	readonly orderStatuses: ReadonlyArray< OrderStatus >;
	readonly thousandsSeparator: string;
};

// ============
// HELPER TYPES
// ============

type PageAttributes = {
	readonly isLocked: boolean;
	readonly sidebarDimensions: {
		readonly top: number;
		readonly height: string;
		readonly applyFix: boolean;
	};

	readonly 'account/usesFullViewAgency'?: boolean;

	readonly 'css-preview/areControlsVisible'?: boolean;
	readonly 'css-preview/activeResolution'?: 'desktop' | 'tablet' | 'mobile';
	readonly 'css-selector/cssSelectorFinderState'?: SelectorFinderState;
	readonly 'css-selector/openedCssSelectorFinderId'?: number | string;

	readonly 'editor/activeExperiment'?: ExperimentId;
	readonly 'editor/activeExperimentType'?: ExperimentTypeName;
	readonly 'editor/activeGoal'?: GoalId;
	readonly 'editor/activeSegment'?: SegmentId;
	readonly 'editor/alternativeBeingApplied'?: AlternativeId | false;
	readonly 'editor/alternativeInPreviewDialog'?: AlternativeId | false;
	readonly 'editor/isExperimentBeingPaused'?: boolean;
	readonly 'editor/isExperimentBeingStopped'?: boolean;
	readonly 'editor/isPublicView'?: boolean;
	readonly 'editor/isReadOnlyActive'?: boolean;
	readonly 'editor/shouldShowUniqueResults'?: boolean;

	readonly 'javascript-preview/areControlsVisible'?: boolean;
	readonly 'javascript-preview/activeResolution'?:
		| 'desktop'
		| 'tablet'
		| 'mobile';
	readonly 'javascript-preview/isLoading'?: boolean;

	readonly 'menus/isConfirmationDialogForMenuDuplicationVisible'?: boolean;
	readonly 'menus/isDuplicatingMenu'?: boolean;

	readonly 'welcome/isPluginBeingInitialized'?: boolean;
	readonly 'welcome/isPolicyAccepted'?: boolean;

	readonly 'widgets/isConfirmationDialogForWidgetDuplicationVisible'?: boolean;
	readonly 'widgets/isDuplicatingWidgets'?: boolean;
};

type SelectorFinderState = {
	readonly alternative: number;
	readonly currentUrl?: string;
	readonly initialMode: 'id' | 'class' | 'css';
	readonly initialValue: string;
	readonly mode: 'id' | 'class' | 'css';
	readonly value: string;
	readonly isExploring: boolean;
};
