export function getClosest< T extends HTMLElement = HTMLElement >(
	node: HTMLElement,
	nodeType: string
): T | false {
	let currentNode: HTMLElement | null = node;
	do {
		if ( nodeType.toLowerCase() === currentNode.nodeName.toLowerCase() ) {
			return currentNode as T;
		} //end if
		currentNode = currentNode.parentElement;
	} while ( currentNode );

	return false;
} //end getClosest()
