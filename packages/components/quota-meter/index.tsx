/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { store as NAB_DATA } from '@nab/data';
import { numberFormat } from '@nab/i18n';
import type { Maybe, Quota } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';

export type QuotaMeterProps = {
	readonly disabled?: boolean;
	readonly subscriptionQuota?: Quota;
};

export const QuotaMeter = ( {
	disabled,
	subscriptionQuota,
}: QuotaMeterProps ): JSX.Element => {
	const { quota, status } = useQuota( subscriptionQuota );
	const title = useTitle( quota );

	const isLoading = ! quota;
	const isBarDisabled = disabled || isLoading;

	const { availableQuota = 0, percentage = 100 } = quota ?? {};

	return (
		<div className="nab-quota-meter">
			<p className="nab-quota-meter__title">
				{ title }

				<AmountLabel mode={ status } quota={ availableQuota } />
			</p>

			<Bar disabled={ isBarDisabled } percentage={ percentage } />
		</div>
	);
};

// ============
// HELPER VIEWS
// ============

const AmountLabel = ( {
	mode,
	quota,
}: {
	readonly mode: 'ready' | 'loading' | 'error';
	readonly quota: number;
} ) => {
	if ( 'loading' === mode ) {
		return (
			<span className="nab-quota-meter__amount">
				{ _x( 'Loading…', 'text', 'nelio-ab-testing' ) }
			</span>
		);
	} //end if

	if ( 'error' === mode ) {
		return (
			<span className="nab-quota-meter__amount">
				{ _x( 'Unable to retrieve quota', 'text', 'nelio-ab-testing' ) }
			</span>
		);
	} //end if

	return (
		<span className="nab-quota-meter__amount">
			{ quota > 0
				? sprintf(
						/* translators: quota number */
						_x(
							'%s available page views',
							'text',
							'nelio-ab-testing'
						),
						numberFormat( quota )
				  )
				: _x(
						'There are no more available page views',
						'text',
						'nelio-ab-testing'
				  ) }
		</span>
	);
};

const Bar = ( {
	disabled,
	percentage,
}: {
	readonly disabled: boolean;
	readonly percentage: number;
} ) => {
	const size = percentage.toFixed( 0 );

	if ( 100 === percentage ) {
		return (
			<div className="nab-quota-meter__bar-container">
				<span
					className={ classnames(
						'nab-quota-meter__bar',
						`nab-quota-meter__bar--width-${ size }`,
						{ 'nab-quota-meter__bar--disabled': disabled }
					) }
				></span>
			</div>
		);
	} //end if

	return (
		<div className="nab-quota-meter__bar-container">
			<TransitionGroup>
				<CSSTransition
					classNames="nab-quota-meter--animation"
					appear={ true }
					enter={ false }
					exit={ false }
					timeout={ 2500 }
				>
					<span
						className={ classnames(
							'nab-quota-meter__bar',
							`nab-quota-meter__bar--width-${ size }`,
							{ 'nab-quota-meter__bar--disabled': disabled }
						) }
					></span>
				</CSSTransition>
			</TransitionGroup>
		</div>
	);
};

// =====
// HOOKS
// =====

const useTitle = ( quota: Maybe< Quota > ) =>
	useSelect( ( select ): string => {
		select( NAB_DATA );

		if ( ! quota ) {
			return _x( 'Quota', 'text', 'nelio-ab-testing' );
		} //end if

		if ( 'site' === quota.mode ) {
			return _x( 'Site Quota', 'text', 'nelio-ab-testing' );
		} //end if

		const { isSubscribedTo } = select( NAB_DATA );
		if ( isSubscribedTo( 'basic', 'or-above' ) ) {
			return _x( 'Subscription Quota', 'text', 'nelio-ab-testing' );
		} //end if

		return _x( 'Quota', 'text', 'nelio-ab-testing' );
	} );

const useQuota = ( subscriptionQuota: Maybe< Quota > ) =>
	useSelect(
		(
			select
		): { quota: Maybe< Quota >; status: 'ready' | 'loading' | 'error' } => {
			select( NAB_DATA );
			if ( subscriptionQuota ) {
				return { quota: subscriptionQuota, status: 'ready' };
			} //end if

			/* eslint-disable @wordpress/no-unused-vars-before-return */
			const quota = select( NAB_DATA ).getQuota();
			const isLoading =
				! select( NAB_DATA ).hasFinishedResolution( 'getQuota' );
			const isError =
				select( NAB_DATA ).hasResolutionFailed( 'getQuota' );
			/* eslint-enable @wordpress/no-unused-vars-before-return */

			if ( isLoading ) {
				return { quota: undefined, status: 'loading' };
			} //end if

			if ( isError || ! quota ) {
				return { quota: undefined, status: 'error' };
			} //end if

			return { quota, status: 'ready' };
		}
	);
