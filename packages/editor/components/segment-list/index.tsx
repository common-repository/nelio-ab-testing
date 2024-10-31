/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dashicon } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { trim } from 'lodash';
import { usePluginSetting } from '@nab/data';
import { createSegment } from '@nab/utils';

/**
 * Internal dependencies
 */
import './style.scss';
import { useExperimentAttribute } from '../hooks';
import { store as NAB_EDITOR } from '../../store';

export const SegmentList = (): JSX.Element => {
	const activeSegmentId = useActiveSegmentId();
	const segments = useSegments();
	const isExperimentPaused = useIsExperimentPaused();
	const isSubscribed = !! usePluginSetting( 'subscription' );
	const { setActiveSegment, addSegments } = useDispatch( NAB_EDITOR );

	return (
		<ul className="nab-segment-list">
			{ segments.map( ( segment, index ) => (
				<li
					key={ segment.id }
					className={ classnames( 'nab-segment-list__item', {
						'nab-segment-list__item--is-active':
							segment.id === activeSegmentId,
					} ) }
				>
					<Button
						disabled={ segment.id === activeSegmentId }
						onClick={ () => setActiveSegment( segment.id ) }
					>
						{ trim( segment.attributes.name ) ||
							getDefaulSegmentNameForIndex( index ) }
					</Button>
				</li>
			) ) }

			{ ! isExperimentPaused && isSubscribed && (
				<li
					className="nab-segment-list__add-new-segment"
					key="add-new-segment"
				>
					<Button
						className="nab-segment-list__add-new-segment-button"
						variant="link"
						onClick={ () => {
							const segment = createSegment();
							void addSegments( segment );
							void setActiveSegment( segment.id );
						} }
					>
						<Dashicon icon="plus" />
						<span>
							{ _x(
								'New',
								'command (segment)',
								'nelio-ab-testing'
							) }
						</span>
					</Button>
				</li>
			) }
		</ul>
	);
};

// =====
// HOOKS
// =====

const useActiveSegmentId = () =>
	useSelect( ( select ) => select( NAB_EDITOR ).getActiveSegment()?.id );

const useSegments = () =>
	useSelect( ( select ) => select( NAB_EDITOR ).getSegments() || [] );

const useIsExperimentPaused = () => {
	const [ status ] = useExperimentAttribute( 'status' );
	return status.includes( 'paused' );
};

// =======
// HELPERS
// =======

const getDefaulSegmentNameForIndex = ( index: number ) =>
	sprintf(
		/* translators: a number */
		_x( 'Segment %d', 'text', 'nelio-ab-testing' ),
		index + 1
	);
