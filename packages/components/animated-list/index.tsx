/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useState } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { flattenDeep, union, without } from 'lodash';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

export type AnimatedListProps = {
	readonly className?: string;
	readonly disableAnimations?: boolean;
	readonly enter?: number;
	readonly exit?: number;
	readonly children: ReadonlyArray< JSX.Element >;
};

export const AnimatedList = ( {
	className,
	disableAnimations,
	enter = 0,
	exit = 0,
	children,
}: AnimatedListProps ): JSX.Element => {
	const [ enteringItems, setEnteringItems ] = useStringList();
	const [ exitingItems, setExitingItems ] = useStringList();

	if ( disableAnimations ) {
		return (
			<div className={ classnames( className, 'nab-animated-list' ) }>
				{ children.map( ( child ) => (
					<div key={ child.key } className="nab-animated-list__item">
						{ child }
					</div>
				) ) }
			</div>
		);
	} //end if

	const addEnteringItem = ( item: string ) =>
		setEnteringItems( union( enteringItems, [ item ] ) );
	const removeEnteringItem = ( item: string ) =>
		setEnteringItems( without( enteringItems, item ) );

	const addExitingItem = ( item: string ) =>
		setExitingItems( union( exitingItems, [ item ] ) );
	const removeExitingItem = ( item: string ) =>
		setExitingItems( without( exitingItems, item ) );

	const flattenedChildren = flattenDeep( children );
	return (
		<div
			className={ classnames( [
				className,
				'nab-animated-list',
				{
					'nab-animated-list--has-item-entering':
						!! enteringItems.length,
				},
				{
					'nab-animated-list--has-item-exiting':
						!! exitingItems.length,
				},
			] ) }
		>
			<TransitionGroup>
				{ flattenedChildren.map( ( child ) => (
					<CSSTransition
						key={ child.key }
						classNames="nab-animated-list__item--has-animation"
						appear={ false }
						enter={ !! enter }
						exit={ !! exit }
						timeout={ { enter, exit } }
						onEnter={ () => addEnteringItem( str( child.key ) ) }
						onEntered={ () =>
							removeEnteringItem( str( child.key ) )
						}
						onExit={ () => addExitingItem( str( child.key ) ) }
						onExited={ () => removeExitingItem( str( child.key ) ) }
					>
						<div className="nab-animated-list__item">{ child }</div>
					</CSSTransition>
				) ) }
			</TransitionGroup>
		</div>
	);
};

// =======
// HELPERS
// =======

const str = ( a: unknown ): string => ( typeof a === 'string' ? a : '' );

// =====
// HOOKS
// =====

const useStringList = () => useState< ReadonlyArray< string > >( [] );
