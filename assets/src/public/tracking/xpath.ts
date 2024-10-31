const Node = window.Node;
const XPathResult = window.XPathResult;

type Step = {
	readonly value: string;
	readonly optimized: boolean;
};

// Code from Chromium project.
// https://github.com/chromium/chromium/blob/master/third_party/blink/renderer/devtools/front_end/elements/DOMPath.js

export function getElementByXPath( xpath: string ): Node | null {
	return document.evaluate(
		xpath,
		document,
		null,
		XPathResult.FIRST_ORDERED_NODE_TYPE,
		null
	).singleNodeValue;
} //end getElementByXPath()

export function xPath( node: Node, optimized: boolean ): string {
	if ( node.nodeType === Node.DOCUMENT_NODE ) {
		return '/';
	} //end if

	const steps: Step[] = [];

	let contextNode: Node | null = node;
	while ( contextNode ) {
		const step = _xPathValue( contextNode, optimized );
		if ( ! step ) {
			break; // Error - bail out early.
		} //end if

		steps.push( step );
		if ( step.optimized ) {
			break;
		} //end if

		contextNode = contextNode.parentNode;
	} //end while

	steps.reverse();
	const path = steps.map( ( s ) => s.value ).join( '/' );
	return steps[ 0 ]?.optimized ? path : `/${ path }`;
} //end xPath()

function _xPathValue( node: Node, optimized: boolean ): Step | null {
	const ownIndex = _xPathIndex( node );
	if ( ownIndex === -1 ) {
		return null; // Error.
	} //end if

	let ownValue = '';
	switch ( node.nodeType ) {
		case Node.ELEMENT_NODE:
			if ( ! isHTMLElement( node ) ) {
				break;
			} //end if
			if ( optimized && node.getAttribute( 'id' ) ) {
				return {
					value: `//*[@id="${ node.getAttribute( 'id' ) || '' }"]`,
					optimized: true,
				};
			} //end if
			ownValue = node.localName;
			break;

		case Node.ATTRIBUTE_NODE:
			ownValue = `@${ node.nodeName }`;
			break;

		case Node.TEXT_NODE:
		case Node.CDATA_SECTION_NODE:
			ownValue = 'text()';
			break;

		case Node.PROCESSING_INSTRUCTION_NODE:
			ownValue = 'processing-instruction()';
			break;

		case Node.COMMENT_NODE:
			ownValue = 'comment()';
			break;

		case Node.DOCUMENT_NODE:
			ownValue = '';
			break;

		default:
			ownValue = '';
			break;
	} //end switch

	if ( ownIndex > 0 ) {
		ownValue += `[${ ownIndex }]`;
	} //end if

	return {
		value: ownValue,
		optimized: node.nodeType === Node.DOCUMENT_NODE,
	};
}

function _xPathIndex( node: Node ): number {
	// Returns -1 in case of error,
	//          0 if no siblings matching the same expression,
	//          <XPath index among the same expression-matching sibling nodes> otherwise.
	function areNodesSimilar( left: Node, right: Node ): boolean {
		if ( left === right ) {
			return true;
		} //end if

		if ( isHTMLElement( left ) && isHTMLElement( right ) ) {
			return left.localName === right.localName;
		} //end if

		if ( left.nodeType === right.nodeType ) {
			return true;
		} //end if

		// XPath treats CDATA as text nodes.
		const leftType =
			left.nodeType === Node.CDATA_SECTION_NODE
				? Node.TEXT_NODE
				: left.nodeType;
		const rightType =
			right.nodeType === Node.CDATA_SECTION_NODE
				? Node.TEXT_NODE
				: right.nodeType;
		return leftType === rightType;
	} //end areNodesSimilar()

	const siblings = node.parentNode ? node.parentNode.children : null;
	if ( ! siblings ) {
		return 0; // Root node - no siblings.
	} //end if

	let hasSameNamedElements;
	for ( let i = 0; i < siblings.length; ++i ) {
		const sibling = siblings[ i ];
		if ( ! sibling ) {
			continue;
		} //end if
		if ( areNodesSimilar( node, sibling ) && sibling !== node ) {
			hasSameNamedElements = true;
			break;
		} //end if
	} //end for

	if ( ! hasSameNamedElements ) {
		return 0;
	} //end if

	let ownIndex = 1; // XPath indices start with 1.
	for ( let i = 0; i < siblings.length; ++i ) {
		const sibling = siblings[ i ];
		if ( ! sibling ) {
			continue;
		} //end if
		if ( areNodesSimilar( node, sibling ) ) {
			if ( sibling === node ) {
				return ownIndex;
			} //end if
			++ownIndex;
		} //end if
	} //end for
	return -1; // An error occurred: |node| not found in parent's children.
} //end _xPathIndex()

const isHTMLElement = ( n: Node ): n is HTMLElement =>
	Node.ELEMENT_NODE === n.nodeType;
