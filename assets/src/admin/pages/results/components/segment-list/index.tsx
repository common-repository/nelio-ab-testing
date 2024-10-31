/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { trim } from 'lodash';
import { usePageAttribute } from '@nab/data';

/**
 * Internal dependencies
 */
import './style.scss';
import { useExperimentAttribute } from '../hooks';

export const SegmentList = (): JSX.Element => {
	const segments = useExperimentAttribute( 'segments' ) || [];
	const [ activeSegmentId, setActiveSegmentId ] = usePageAttribute(
		'editor/activeSegment',
		'default'
	);

	return (
		<ul className="nab-segment-list">
			{ segments.length > 1 && (
				<li
					key="default"
					className={ classnames( 'nab-segment-list__item', {
						'nab-segment-list__item--is-active':
							'default' === activeSegmentId,
					} ) }
				>
					<Button
						disabled={ 'default' === activeSegmentId }
						onClick={ () => setActiveSegmentId( 'default' ) }
					>
						{ _x( 'Default Segment', 'text', 'nelio-ab-testing' ) }
					</Button>
				</li>
			) }

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
						onClick={ () => setActiveSegmentId( segment.id ) }
					>
						{ trim( segment.attributes.name ) ||
							stringify( index ) }
					</Button>
				</li>
			) ) }
		</ul>
	);
};

// =======
// HELPERS
// =======

const stringify = ( index: number ) =>
	sprintf(
		/* translators: a number */
		_x( 'Segment %d', 'text', 'nelio-ab-testing' ),
		index + 1
	);
