/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Spinner } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { Site as SiteInstance } from '@nab/types';

/**
 * Internal dependencies
 */
import { Site } from '../site';
import './style.scss';
import { store as NAB_ACCOUNT } from '../../store';

export const Sites = (): JSX.Element | null => {
	const isVisible = useIsVisible();
	const isLoading = useIsLoading();
	const sites = useSites();
	const sitesAllowed = useSitesAllowed();

	if ( ! isVisible ) {
		return null;
	} //end if

	const sitesConnected = sites.length;
	const displayQuotaLimit =
		sites.length > 1 || sites.some( ( s ) => 0 <= s.maxMonthlyQuota );

	return (
		<div className="nab-account-container__box nab-sites">
			<h3 className="nab-sites__title">
				{ _x( 'Sites', 'text', 'nelio-ab-testing' ) }
				{ isLoading && <Spinner /> }
				<span className="nab-sites__availability">
					{ `${ sitesConnected } / ${ sitesAllowed }` }
				</span>
			</h3>

			<ul className="nab-sites__list">
				{ ! isLoading &&
					sites.map( ( site ) => (
						<Site
							key={ site.id }
							displayQuotaLimit={ displayQuotaLimit }
							{ ...site }
						/>
					) ) }
			</ul>
		</div>
	);
};

// =====
// HOOKS
// =====

const useIsLoading = () =>
	useSelect(
		( select ) =>
			! select( NAB_ACCOUNT ).hasFinishedResolution( 'getSites', [
				select( NAB_ACCOUNT ).getSubscriptionId(),
			] )
	);

const useIsVisible = () =>
	useSelect( ( select ) => {
		const { getMode, isAgency, isAgencyFullViewEnabled } =
			select( NAB_ACCOUNT );
		const isSubscribed = getMode() === 'regular';
		const isAgencySummary = isAgency() && ! isAgencyFullViewEnabled();
		return isSubscribed && ! isAgencySummary;
	} );

const useSites = (): ReadonlyArray< SiteInstance > =>
	useSelect(
		( select ) =>
			select( NAB_ACCOUNT ).getSites(
				select( NAB_ACCOUNT ).getSubscriptionId()
			) || []
	);

const useSitesAllowed = () =>
	useSelect( ( select ) =>
		'enterprise' === select( NAB_ACCOUNT ).getPlan()
			? '∞'
			: select( NAB_ACCOUNT ).getSitesAllowed()
	);
