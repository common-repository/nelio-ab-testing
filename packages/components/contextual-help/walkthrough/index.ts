/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import createIntroJs from 'intro.js';
import { usePluginSetting } from '@nab/data';
import { getValue, isMultiArray, setValue } from '@nab/utils';
import type { IntroJs, Step as IntroJsStep } from 'intro.js';

/**
 * Internal dependencies
 */
import './style.scss';
import type { TutorialStep } from '../types';

declare module 'intro.js' {
	// eslint-disable-next-line no-shadow, @typescript-eslint/no-shadow, @typescript-eslint/no-namespace
	interface IntroJs {
		readonly onstart: ( fn: () => void ) => void;
		readonly _options: {
			readonly steps: ReadonlyArray< IntroJsStep >;
		};
	}
}

export function useWalkthroughEffect(
	screen: string,
	steps: ReadonlyArray< TutorialStep >
): false | ( () => void ) {
	const isAutoRunEnabled = usePluginSetting( 'areAutoTutorialsEnabled' );

	const [ isRunning, setRunning ] = useState(
		isAutoRunEnabled && !! steps.length && shouldRunOnStartup( screen )
	);

	useEffect( () => {
		if ( ! isRunning ) {
			return;
		} //end if
		setValue( `is-guide-${ screen }-disabled`, true );
		const walkthrough = createIntroJs().setOptions( {
			buttonClass: 'button button-secondary nab-walkthrough-button',
			disableInteraction: true,
			exitOnOverlayClick: false,
			overlayOpacity: 0.8,
			tooltipClass: 'nab-walkthrough-tooltip',
			steps: [
				...steps,
				{
					title: _x( 'Enjoy!', 'text', 'nelio-ab-testing' ),
					intro: _x(
						'That’s all! If you have any further questions or you want to view this guide again, use the “Help” icon in the bottom right corner of your screen.',
						'user',
						'nelio-ab-testing'
					),
					element: () =>
						document.querySelector(
							'.nab-contextual-help__toggle'
						),
				} as TutorialStep,
			]
				.filter( ( s: TutorialStep ) => ! s?.active || s.active() )
				.map( tutorialStepToIntroStep ),
		} );

		walkthrough.onstart( () => updateNavigationButtons( walkthrough ) );

		walkthrough.onafterchange( () =>
			updateNavigationButtons( walkthrough )
		);

		walkthrough.onexit( () => setRunning( false ) );

		walkthrough.start();
	}, [ isRunning ] );

	return !! steps.length && ( () => setRunning( true ) );
} //end useWalkthroughEffect()

// =======
// HELPERS
// =======

function tutorialStepToIntroStep( s: TutorialStep ): IntroJsStep {
	const element = s.element?.();
	return {
		intro: s.intro,
		title: s.title,
		element: element || undefined,
	};
} //end ()

function shouldRunOnStartup( screen: string ): boolean {
	return ! getValue( `is-guide-${ screen }-disabled`, false );
} //end shouldRunOnStartup()

function updateNavigationButtons( introjs: IntroJs ): void {
	const { prev, next, skip } = getNavigationButtons( introjs );
	if ( ! prev || ! next || ! skip ) {
		return;
	} //end if

	prev.textContent = _x( 'Prev', 'command', 'nelio-ab-testing' );
	prev.style.display = isFirstStep( introjs ) ? 'none' : 'block';
	skip.style.display = isFirstStep( introjs ) ? 'block' : 'none';

	if ( isLastStep( introjs ) ) {
		next.classList.add( 'button-primary' );
		next.classList.remove( 'button-secondary' );
		next.textContent = _x( 'Close', 'command', 'nelio-ab-testing' );
	} else if ( isFirstStep( introjs ) ) {
		next.classList.add( 'button-primary' );
		next.textContent = _x( 'Start', 'command', 'nelio-ab-testing' );
	} else {
		next.classList.remove( 'button-primary' );
		next.classList.add( 'button-secondary' );
		next.textContent = _x( 'Next', 'command', 'nelio-ab-testing' );
	} //end if
} //end updateNavigationButtons()

type NavigationButtons = {
	readonly prev?: HTMLElement;
	readonly next?: HTMLElement;
	readonly skip?: HTMLElement;
};

function getNavigationButtons( introjs: IntroJs ): NavigationButtons {
	const buttons: ReadonlyArray< HTMLElement > = Array.from(
		document.querySelectorAll( '.nab-walkthrough-button' )
	);

	if ( ! isMultiArray( buttons ) ) {
		return {};
	} //end if

	const prev = buttons[ 0 ];
	const next = buttons[ 1 ];
	const skip = getSkipButton( introjs, prev );

	return { prev, next, skip };
} //end getNavigationButtons()

function getSkipButton( introjs: IntroJs, prev: HTMLElement ): HTMLElement {
	const existing = document.querySelector< HTMLElement >(
		'.nab-walkthrough-skip'
	);
	if ( existing ) {
		return existing;
	} //end if

	const skip = document.createElement( 'a' );
	skip.setAttribute( 'role', 'button' );
	skip.setAttribute( 'tabindex', '0' );
	skip.className = 'button button-secondary nab-walkthrough-skip';
	skip.textContent = _x( 'Skip', 'command', 'nelio-ab-testing' );
	skip.style.float = 'left';
	skip.addEventListener( 'click', () => introjs.exit() );
	// phpcs:ignore
	prev.parentNode?.insertBefore( skip, prev );
	return skip;
} //end getSkipButton()

function isFirstStep( introjs: IntroJs ): boolean {
	return ! introjs.currentStep();
} //end isFirstStep()

function isLastStep( introjs: IntroJs ): boolean {
	return introjs.currentStep() === introjs._options.steps.length - 1;
} //end isLastStep()
