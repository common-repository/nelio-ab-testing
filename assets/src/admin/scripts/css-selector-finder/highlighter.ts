/**
 * External dependencies
 */
import cssPath from './css-path';

let highlighters: ReadonlyArray< HTMLElement > = [];
const hoveredElementHighlighter = document.createElement( 'div' );
hoveredElementHighlighter.className = 'nab-highlight';
document.body.appendChild( hoveredElementHighlighter );

export function getCssSelector( element: HTMLElement ): string {
	let selector = cssPath( element );
	selector = selector.replace( /:nth-child\([0-9]+\)/g, '' );
	selector = selector.replace( />/g, '' );
	selector = selector.replace( / +/g, ' ' );
	selector = selector.replace( /\.nab[-0-9a-z]*/g, '' );
	return selector;
} //end getCssSelector()

export function highlightCssSelector(
	selector: string,
	shouldNavigate?: boolean
): void {
	clearHighlighters();
	hideHoveredElementHighlighter();

	try {
		const elements = Array.from(
			document.querySelectorAll< HTMLElement >( selector )
		);
		highlighters = elements.map( ( element ) => {
			const highlighter = document.createElement( 'div' );
			highlighter.className = 'nab-highlight';
			document.body.appendChild( highlighter );
			positionHighlightElement( highlighter, element );
			return highlighter;
		} );
		if ( shouldNavigate ) {
			elements[ 0 ]?.scrollIntoView( { behavior: 'smooth' } );
		} //end if
	} catch ( _ ) {}
} //end highlightCssSelector()

export function highlightHoveredElement( ev: Event ): void {
	clearHighlighters();
	positionHighlightElement(
		hoveredElementHighlighter,
		ev.target as HTMLElement | null
	);
} //end highlightHoveredElement()

// =======
// HELPERS
// =======

function positionHighlightElement(
	highlight: HTMLElement,
	element: HTMLElement | null
) {
	if ( ! highlight.style || ! element ) {
		return;
	} //end if

	const viewportOffset = element.getBoundingClientRect();
	highlight.style.display = 'block';
	highlight.style.top = `${
		Math.floor( viewportOffset.top ) - 1 + window.scrollY
	}px`;
	highlight.style.left = `${
		Math.floor( viewportOffset.left ) - 1 + window.scrollX
	}px`;
	highlight.style.width = `${ viewportOffset.width }px`;
	highlight.style.height = `${ viewportOffset.height }px`;
} //end positionHighlightElement()

function clearHighlighters() {
	if ( 0 === highlighters.length ) {
		return;
	} //end if

	highlighters.forEach(
		( highlighter ) =>
			highlighter.parentElement &&
			highlighter.parentElement.removeChild( highlighter )
	);
	highlighters = [];
} //end clearHighlighters()

function hideHoveredElementHighlighter() {
	hoveredElementHighlighter.style.display = 'none';
	hoveredElementHighlighter.style.top = '50%';
	hoveredElementHighlighter.style.left = '50%';
	hoveredElementHighlighter.style.width = '0';
	hoveredElementHighlighter.style.height = '0';
} //end hideHoveredElementHighlighter()
