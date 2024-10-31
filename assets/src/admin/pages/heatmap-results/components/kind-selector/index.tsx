/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { PanelBody, PanelRow, ToggleControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';
import { addQueryArgs } from '@safe-wordpress/url';
import type { HeatmapMode } from '@nab/types';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { store as NAB_DATA, usePageAttribute } from '@nab/data';

/**
 * Internal dependencies
 */
import { Opacity } from '../opacity';
import { HeatmapIntensity } from '../heatmap-intensity';
import { ScrollmapLegend } from '../scrollmap-legend';
import { FilterSection } from '../filter-section';
import { useActiveMode, useIsLocked } from '../hooks';
import './style.scss';
import { ClipboardButton } from '@nab/components';

export const KindSelector = (): JSX.Element => {
	const [ activeMode, setActiveMode ] = useActiveMode();
	const isLocked = useIsLocked();
	const homeUrl = useHomeUrl();
	const [ isPublicView ] = usePageAttribute( 'editor/isPublicView', false );
	const [ isReadOnlyActive, setReadOnly ] = usePageAttribute(
		'editor/isReadOnlyActive',
		false
	);
	const [ experimentId ] = usePageAttribute( 'editor/activeExperiment', 0 );
	const [ experimentType ] = usePageAttribute(
		'editor/activeExperimentType',
		''
	);
	const { setPublicResultStatus } = useDispatch( NAB_DATA );

	const publicResultUrl = addQueryArgs( homeUrl, {
		'nab-result': true,
		experiment: experimentId,
		preview: '',
	} );

	return (
		<TabPanel
			className={ classnames( 'nab-heatmap-kind-selector', {
				'nab-heatmap-kind-selector--locked': isLocked,
			} ) }
			activeClass="nab-heatmap-kind-selector__tab--active"
			orientation="horizontal"
			tabs={ TABS }
			activeTab={ activeMode }
			onSelect={ setActiveMode }
		>
			{ ( tab: Tab ) => (
				<PanelBody
					className="nab-heatmap-settings"
					title={ _x( 'Settings', 'text', 'nelio-ab-testing' ) }
				>
					<Opacity />
					{ 'heatmap' === tab.name && <HeatmapIntensity /> }
					<FilterSection kind={ tab.name } />
					{ 'scrollmap' === tab.name && <ScrollmapLegend /> }
					{ 'nab/heatmap' === experimentType && ! isPublicView && (
						<PanelRow className="nab-heatmap-settings__public-selector">
							<ToggleControl
								label={ _x(
									'Public results',
									'text',
									'nelio-ab-testing'
								) }
								disabled={ isLocked }
								checked={ isReadOnlyActive }
								onChange={ ( checked ) => {
									void setPublicResultStatus( checked );
									setReadOnly( checked );
								} }
							/>
							{ !! isReadOnlyActive && (
								<div className="nab-heatmap-settings__public-result">
									<div className="nab-heatmap-settings__public-result-url">
										<input
											className="nab-heatmap-settings__public-result-url-input"
											type="text"
											value={ publicResultUrl }
											readOnly
										/>
										<ClipboardButton
											text={ publicResultUrl }
										/>
									</div>
									<p className="nab-heatmap-settings__public-result-description">
										{ _x(
											'Copy and share this URL.',
											'user',
											'nelio-ab-testing'
										) }
									</p>
								</div>
							) }
						</PanelRow>
					) }
				</PanelBody>
			) }
		</TabPanel>
	);
};

// ============
// HELPER VIEWS
// ============

type TabPanelProps = {
	readonly className: string;
	readonly activeClass: string;
	readonly orientation: 'horizontal';
	readonly onSelect: ( tab: HeatmapMode ) => void;
	readonly children: ( tab: Tab ) => JSX.Element;
	readonly activeTab: HeatmapMode;
	readonly tabs: typeof TABS;
};

// NOTICE. This is a workaround until “TabPanel” can be controlled/uncontrolled.
const TabPanel = ( {
	className,
	activeClass,
	orientation,
	onSelect,
	children,
	activeTab,
	tabs,
}: TabPanelProps ) => (
	<div className={ className }>
		<div
			role="tablist"
			aria-orientation={ orientation }
			className="components-tab-panel__tabs"
		>
			{ tabs.map( ( tab ) => (
				<button
					key={ tab.name }
					type="button"
					role="tab"
					tabIndex={ tab.name === activeTab ? -1 : undefined }
					aria-selected="false"
					id={ `tab-panel-1-${ tab.name }` }
					aria-controls={ `tab-panel-1-${ tab.name }-view` }
					className={ classnames( {
						'components-button components-tab-panel__tabs-item':
							true,
						[ tab.className ]: true,
						[ activeClass ]: tab.name === activeTab,
					} ) }
					onClick={ () => onSelect( tab.name ) }
				>
					{ tab.title }
				</button>
			) ) }
		</div>
		<div
			aria-labelledby={ `tab-panel-1-${ activeTab || tabs[ 0 ].name }` }
			role="tabpanel"
			id={ `tab-panel-1-${ activeTab || tabs[ 0 ].name }-view` }
			className="components-tab-panel__tab-content"
		>
			{ children(
				tabs.find( ( t ) => t.name === activeTab ) || tabs[ 0 ]
			) }
		</div>
	</div>
);

// =====
// HOOKS
// =====

const useHomeUrl = () =>
	useSelect( ( select ) => select( NAB_DATA ).getPluginSetting( 'homeUrl' ) );

// ====
// DATA
// ====

type Tab = {
	readonly name: HeatmapMode;
	readonly title: string;
	readonly className: string;
};

const TABS: Readonly< [ Tab, Tab, Tab ] > = [
	{
		name: 'heatmap',
		title: _x( 'Heatmap', 'text', 'nelio-ab-testing' ),
		className: 'nab-heatmap-kind-selector__tab',
	},
	{
		name: 'scrollmap',
		title: _x( 'Scrollmap', 'text', 'nelio-ab-testing' ),
		className: 'nab-heatmap-kind-selector__tab',
	},
	{
		name: 'confetti',
		title: _x( 'Confetti', 'text', 'nelio-ab-testing' ),
		className: 'nab-heatmap-kind-selector__tab',
	},
];
