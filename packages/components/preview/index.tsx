/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useEffect, useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import axios from 'axios';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';
import { LoadingAnimation } from '../loading-animation';

export type PreviewProps = {
	readonly className?: string;
	readonly url: string;
	readonly caption?: string;
};

export const Preview = ( {
	className,
	url,
	caption,
}: PreviewProps ): JSX.Element => {
	const [ status, setStatus ] = useUrlStatus( url );

	const isBusy = 'loading' === status || 'checking' === status;
	const isError = 'error' === status;
	const hasIFrame = 'loading' === status || 'ready' === status;

	return (
		<figure className={ classnames( [ 'nab-preview', className ] ) }>
			{ isBusy && (
				<div className="nab-preview__textual-feedback">
					{
						<LoadingAnimation
							text={ _x(
								'Loading…',
								'text',
								'neliko-ab-testing'
							) }
						/>
					}
				</div>
			) }

			{ isError && (
				<div className="nab-preview__textual-feedback">
					{ _x( 'No Preview', 'text', 'nelio-ab-testing' ) }
				</div>
			) }

			{ hasIFrame && (
				<iframe
					className={ `nab-preview__image--${ status }` }
					src={ url }
					title={ caption }
					scrolling="no"
					onLoad={ () => setStatus( 'ready' ) }
				></iframe>
			) }

			{ !! caption && (
				<figcaption className="nab-preview__caption screen-reader-text">
					{ _x( 'Test screenshot.', 'text', 'nelio-ab-testing' ) }
				</figcaption>
			) }
		</figure>
	);
};

// =====
// HOOKS
// =====

type Url = string;
type UrlStatus = 'checking' | 'loading' | 'error' | 'ready';

const useUrlStatus = ( url: Url ) => {
	const [ statuses, setStatuses ] = useState< Record< Url, UrlStatus > >(
		{}
	);

	const status = statuses[ url ] || 'checking';
	const setStatus = ( s: UrlStatus ) =>
		setStatuses( { ...statuses, [ url ]: s } );

	useEffect( () => {
		if ( ! url ) {
			setStatus( 'error' );
			return;
		} //end if
		setStatus( 'checking' );
		axios
			.get( url )
			.then( () => setStatus( 'loading' ) )
			.catch( () => setStatus( 'error' ) );
	}, [ url ] );

	return [ status, setStatus ] as const;
};
