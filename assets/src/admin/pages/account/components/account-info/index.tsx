/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dashicon } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { createInterpolateElement, useState } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NAB_DATA } from '@nab/data';
import { formatI18nDate } from '@nab/date';

/**
 * Internal dependencies
 */
import './style.scss';
import { LicensePopover } from '../license-popover';
import { RemoveLicenseAction } from '../actions';
import { store as NAB_ACCOUNT } from '../../store';

export const AccountInfo = (): JSX.Element | null => {
	const isVisible = useIsVisible();
	const fullname = useFullName();
	const email = useEmail();
	const startDate = useStartDate();
	const license = useLicense();
	const photo = usePhoto();
	const [ isPopoverVisible, setPopoverVisible ] = useState( false );

	if ( ! isVisible ) {
		return null;
	} //end if

	return (
		<div className="nab-account-container__box nab-info">
			<h3 className="nab-info__title">
				{ _x(
					'Account Information',
					'title (account)',
					'nelio-ab-testing'
				) }
			</h3>

			<div className="nab-info__container">
				<div className="nab-info__profile">
					<div className="nab-info__picture nab-first-letter-a">
						<div
							className="nab-info__actual-picture"
							style={ {
								backgroundImage: `url(${ photo })`,
							} }
						></div>
					</div>
				</div>

				<div className="nab-info__details">
					<p className="nab-info__name">{ fullname }</p>
					<p className="nab-info__email">
						<Dashicon icon="email" className="nab-info__icon" />
						{ email }
					</p>
					<p className="nab-info__creation-date">
						<Dashicon icon="calendar" className="nab-info__icon" />
						{ createInterpolateElement(
							sprintf(
								/* translators: date */
								_x(
									'Member since %s.',
									'text',
									'nelio-ab-testing'
								),
								`<date>${ formatI18nDate( startDate ) }</date>`
							),
							{
								date: <strong />,
							}
						) }
					</p>
					<div className="nab-info__license">
						<Dashicon
							icon="admin-network"
							className="nab-info__icon"
						/>
						<code
							title={ _x(
								'License Key',
								'text',
								'nelio-ab-testing'
							) }
						>
							{ license }
						</code>
						<div className="nab-info__change-license">
							<Button
								variant="link"
								onClick={ () => setPopoverVisible( true ) }
							>
								{ _x(
									'Change',
									'command',
									'nelio-ab-testing'
								) }
							</Button>
							<LicensePopover
								isOpen={ isPopoverVisible }
								placement="bottom"
								onClick={ () => setPopoverVisible( false ) }
								onFocusOutside={ () =>
									setPopoverVisible( false )
								}
							/>
						</div>
						<div className="nab-info__remove-license">
							<RemoveLicenseAction
								variant="link"
								isDestructive
								label={ _x(
									'Remove',
									'command',
									'nelio-ab-testing'
								) }
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useIsVisible = () =>
	useSelect( ( select ) => {
		const { getMode, isAgency, isAgencyFullViewEnabled } =
			select( NAB_ACCOUNT );
		const isSubscribed = getMode() === 'regular';
		const isAgencySummary = isAgency() && ! isAgencyFullViewEnabled();
		return isSubscribed && ! isAgencySummary;
	} );

const useFullName = () =>
	useSelect( ( select ) => select( NAB_ACCOUNT ).getFullname() );

const useEmail = () =>
	useSelect( ( select ) => select( NAB_ACCOUNT ).getEmail() );

const useStartDate = () =>
	useSelect(
		( select ) =>
			select( NAB_ACCOUNT ).getStartDate() ||
			select( NAB_DATA ).getToday()
	);

const useLicense = () =>
	useSelect( ( select ) => select( NAB_ACCOUNT ).getLicense() );

const usePhoto = () =>
	useSelect( ( select ) => select( NAB_ACCOUNT ).getPhoto() );
