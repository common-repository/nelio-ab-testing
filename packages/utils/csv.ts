type ColumnAccessor< T extends Record< string, unknown > > = {
	readonly accessor: ( item: T ) => string | number | undefined;
	readonly name: string;
};

export const downloadAsCsv = < T extends Record< string, unknown > >(
	columns: Array< ColumnAccessor< T > >,
	data: Array< T >,
	filename: string
): void => {
	const csvData = makeCsvData( columns, data );
	const csvFile = new Blob( [ csvData ], { type: 'text/csv' } );
	const downloadLink = document.createElement( 'a' );

	downloadLink.style.display = 'none';
	downloadLink.download = filename;
	downloadLink.href = window.URL.createObjectURL( csvFile );
	document.body.appendChild( downloadLink );
	downloadLink.click();
	document.body.removeChild( downloadLink );
};

const makeCsvData = < T extends Record< string, unknown > >(
	columns: Array< ColumnAccessor< T > >,
	data: Array< T >
) => {
	return data.reduce(
		( csvString, rowItem ) => {
			return (
				csvString +
				columns
					.map( ( { accessor } ) =>
						escapeCsvCell( accessor( rowItem ) )
					)
					.join( ',' ) +
				'\r\n'
			);
		},
		columns.map( ( { name } ) => escapeCsvCell( name ) ).join( ',' ) +
			'\r\n'
	);
};

const escapeCsvCell = ( cell?: number | string ): string => {
	if ( cell === undefined ) {
		return '';
	} //end if
	const sc = cell.toString().trim();
	if ( sc === '' || sc === '""' ) {
		return sc;
	} //end if
	if (
		sc.includes( '"' ) ||
		sc.includes( ',' ) ||
		sc.includes( '\n' ) ||
		sc.includes( '\r' )
	) {
		return '"' + sc.replace( /"/g, '""' ) + '"';
	} //end if
	return sc;
};
