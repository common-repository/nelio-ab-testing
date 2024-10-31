const LOG_REGEX = /\bnabjslog\b/;
export function log( ...args: unknown[] ): void {
	if (
		LOG_REGEX.test( window.location.search ) ||
		LOG_REGEX.test( document.cookie )
	) {
		// eslint-disable-next-line no-console
		console.log( '[NAB]', ...args );
	} //end if
} //end log()

export function logIf( condition: boolean, ...args: unknown[] ): void {
	if ( ! condition ) {
		return;
	} //end if
	log( ...args );
} //end logIf()

const logs: string[] = [];
export function logOnce( text: string ): void {
	if ( logs.includes( text ) ) {
		return;
	} //end if
	logs.push( text );
	log( text );
} //end logOnce()
