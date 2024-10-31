/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	Button,
	Dashicon,
	Modal,
	SelectControl,
	TextControl,
} from '@safe-wordpress/components';
import { useInstanceId } from '@safe-wordpress/compose';
import { useEffect } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';
import { addQueryArgs } from '@safe-wordpress/url';

/**
 * External dependencies
 */
import { findIndex, noop } from 'lodash';
import { usePageAttribute } from '@nab/data';
import { getLetter } from '@nab/utils';
import type { State as NabState } from '@nab/data';
import type { Alternative, AlternativeId, ExperimentId } from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';

export type CssSelectorFinderProps = {
	readonly experimentId: ExperimentId;
	readonly initialUrl: string;
	readonly initialMode: State[ 'mode' ];
	readonly initialValue: string;
	readonly alternatives: ReadonlyArray< Alternative >;
	readonly onClose?: () => void;
	readonly onAccept?: ( mode: State[ 'mode' ], val: string ) => void;
};

type State = Exclude<
	NabState[ 'page' ][ 'css-selector/cssSelectorFinderState' ],
	undefined
>;

export const CssSelectorFinder = ( {
	initialUrl,
	initialMode,
	initialValue,
	experimentId,
	...props
}: CssSelectorFinderProps ): JSX.Element => {
	const [ state, setState ] = useCssFinderState( {
		alternative: 0,
		mode: initialMode,
		isExploring: false,
		value: initialValue,
		initialMode,
		initialValue,
	} );

	const instanceId = useInstanceId( CssSelectorFinder );
	const updateIFrame = useIFrameUpdater( instanceId, state );
	useIFrameUpdateEffect( updateIFrame, state );

	return (
		<Modal
			className="nab-css-selector-finder"
			title={
				(
					<Title
						state={ state }
						setState={ ( v ) => !! v && setState( v ) }
						{ ...props }
					/>
				 ) as unknown as string
			}
			onRequestClose={ noop }
			isDismissible={ false }
			style={ {
				width: '100%',
				height: '100%',
				padding: 0,
			} }
		>
			<iframe
				id={ `nab-css-selector-finder__iframe-${ instanceId }` }
				className="nab-css-selector-finder__iframe"
				title={ _x(
					'CSS Selector Finder',
					'text',
					'nelio-ab-testing'
				) }
				src={ addQueryArgs( state.currentUrl || initialUrl, {
					'nab-css-selector-finder': true,
					experiment: experimentId,
					alternative: state.alternative,
				} ) }
				onLoad={ updateIFrame }
			></iframe>
		</Modal>
	);
};

type TitleProps = Omit<
	CssSelectorFinderProps,
	'experimentId' | 'initialUrl' | 'initialValue' | 'initialMode'
> & {
	readonly state: State;
	readonly setState: ( s?: State ) => void;
};

const Title = ( {
	alternatives,
	state,
	setState,
	onClose = noop,
	onAccept = noop,
}: TitleProps ): JSX.Element => {
	const options = alternatives.map( ( { id }, i ) => ( {
		label: getLabel( i ),
		value: id,
	} ) );

	const { isExploring, mode, alternative, value } = state;
	const placeholder = ( (): string => {
		switch ( mode ) {
			case 'id':
				return _x( 'Type an element ID…', 'user', 'nelio-ab-testing' );
			case 'class':
				return _x( 'Type a class name…', 'user', 'nelio-ab-testing' );
			case 'css':
				return isExploring
					? _x( 'Click on the element…', 'user', 'nelio-ab-testing' )
					: _x( 'Type a CSS selector…', 'user', 'nelio-ab-testing' );
		} //end switch
	} )();

	const loadAlternative = ( id: AlternativeId ) => {
		const index = findIndex( options, { value: id } );
		setState( {
			...state,
			alternative: index,
			currentUrl: alternatives[ index ]?.links.preview,
		} );
	};

	const setValue = ( val: string ) =>
		setState( {
			...state,
			isExploring: false,
			value: val,
		} );

	const explore = () => setState( { ...state, isExploring: true } );

	const cleanState = () => setState( undefined );

	return (
		<div className="nab-css-selector-finder__header">
			<div className="nab-css-selector-finder__header-left">
				<SelectControl
					disabled={ isExploring }
					options={ options }
					value={ options[ alternative ]?.value }
					onChange={ loadAlternative }
				/>
			</div>

			<div className="nab-css-selector-finder__header-center">
				<TextControl
					className="nab-css-selector-finder__value"
					placeholder={ placeholder }
					value={ isExploring ? '' : value }
					onChange={ setValue }
					disabled={ isExploring }
				/>

				{ 'css' === mode && (
					<Button
						variant="secondary"
						className="nab-css-selector-finder__action"
						onClick={ explore }
						disabled={ isExploring }
						title={ _x(
							'Find Selector',
							'command',
							'nelio-ab-testing'
						) }
					>
						<Dashicon icon="search" />
					</Button>
				) }
			</div>

			<div className="nab-css-selector-finder__header-right">
				<Button
					variant="secondary"
					className="nab-css-selector-finder__action"
					onClick={ () => {
						onClose();
						cleanState();
					} }
				>
					{ _x( 'Cancel', 'command', 'nelio-ab-testing' ) }
				</Button>

				<Button
					variant="primary"
					className="nab-css-selector-finder__action"
					disabled={ isExploring }
					onClick={ () => {
						onAccept( mode, value );
						onClose();
						cleanState();
					} }
				>
					{ _x( 'OK', 'command', 'nelio-ab-testing' ) }
				</Button>
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useCssFinderState = ( initState: State ) => {
	const attrName = 'css-selector/cssSelectorFinderState';
	const [ state, setState ] = usePageAttribute( attrName, initState );

	useEffect( () => {
		if (
			initState.initialMode !== state.initialMode ||
			initState.initialValue !== state.initialValue
		) {
			setState( initState );
		} //end if
	}, [
		initState.initialMode,
		initState.initialValue,
		state.initialMode,
		state.initialValue,
	] );

	return [ state ?? initState, setState ] as const;
};

const useIFrameUpdater = ( instanceId: string | number, state: State ) => {
	const { isExploring, mode, value } = state;
	const update = () => {
		const iframe = document.getElementById(
			`nab-css-selector-finder__iframe-${ instanceId }`
		) as HTMLIFrameElement;
		if ( ! iframe?.contentWindow?.postMessage ) {
			return;
		} //end if

		if ( isExploring ) {
			iframe.contentWindow.postMessage( { type: 'explore' } );
		} else {
			const cssValue = ( () => {
				switch ( mode ) {
					case 'id':
						return `#${ value.replace( /\s/g, '' ) }`;
					case 'class':
						return `.${ value.replace( /\s/g, '' ) }`;
					case 'css':
						return value;
				} //end switch
			} )();
			iframe.contentWindow.postMessage( {
				type: 'highlight',
				value: cssValue,
			} );
		} //end if
	};

	return update;
};

const useIFrameUpdateEffect = ( update: () => void, state: State ): void => {
	const { mode, isExploring, value } = state;
	useEffect( update, [ mode, value, isExploring ] );
};

const getLabel = ( index: number ): string =>
	sprintf(
		/* translators: a letter, such as A, B, or C */
		_x( 'Variant %s', 'text', 'nelio-ab-testing' ),
		getLetter( index )
	);
