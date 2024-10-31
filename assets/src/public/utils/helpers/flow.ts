// TODO. Define generic type and not only string.
export function flow(
	...fns: ( ( input: string ) => string )[]
): ( input: string ) => string {
	return ( input: string ) => fns.reduce( ( r, f ) => f( r ), input );
} //end flow()
