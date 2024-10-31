/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PanelBody, Button } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';
import { keys, values } from 'lodash';

/**
 * External dependencies
 */
import { store as NAB_DATA } from '@nab/data';
import { downloadAsCsv } from '@nab/utils';
import type { Day, Experiment, ExperimentId, Maybe, Results } from '@nab/types';
/**
 * Internal dependencies
 */
import './style.scss';

export const Export = (): JSX.Element | null => {
	const exp = useActiveExperiment();
	const results = useExperimentResults( exp?.id );
	const handleDownload = useDownloadHandle( exp, results );

	if ( ! exp ) {
		return null;
	} //end if

	return (
		<PanelBody
			initialOpen={ false }
			className="nab-export"
			title={ _x( 'Export', 'text', 'nelio-ab-testing' ) }
		>
			<p>
				{ _x(
					'Export the raw data of the test:',
					'user',
					'nelio-ab-testing'
				) }
			</p>

			<Button
				className="nab-export__button"
				variant="secondary"
				onClick={ handleDownload }
			>
				{ _x( 'Download CSV', 'command', 'nelio-ab-testing' ) }
			</Button>
		</PanelBody>
	);
};

// =====
// HOOKS
// =====

const useExperimentResults = ( id: Maybe< ExperimentId > ) =>
	useSelect( ( select ) => select( NAB_DATA ).getExperimentResults( id ) );

const useActiveExperiment = () =>
	useSelect( ( select ) => {
		const activeExperimentId = select( NAB_DATA ).getPageAttribute(
			'editor/activeExperiment'
		);
		return select( NAB_DATA ).getExperiment( activeExperimentId );
	} );

const useDownloadHandle =
	( test: Maybe< Experiment >, results: Maybe< Results > ) => () => {
		const data: Record<
			Day,
			Record< string, string | number | undefined >
		> = {};

		let altIndex = 0;
		for ( const alt of test?.alternatives ?? [] ) {
			const altResult = results?.alternatives[ alt.id ];
			for ( const day of altResult?.timeline ?? [] ) {
				const {
					date,
					visits,
					uniqueVisits,
					conversions,
					uniqueConversions,
				} = day;
				data[ date ] = {
					...( data[ date ] ?? {} ),
					date,
					[ `alt-${ altIndex }-visits` ]: visits,
					[ `alt-${ altIndex }-unique-visits` ]: uniqueVisits,
					...( test?.goals ?? [] ).reduce(
						( acc, goal, i ) => ( {
							...acc,
							[ `alt-${ altIndex }-conversions-goal-${ i }` ]:
								conversions[ goal.id ],
							[ `alt-${ altIndex }-unique-conversions-goal-${ i }` ]:
								uniqueConversions[ goal.id ],
							[ `alt-${ altIndex }-value-goal-${ i }` ]:
								day.values[ goal.id ],
							[ `alt-${ altIndex }-unique-value-goal-${ i }` ]:
								day.uniqueValues[ goal.id ],
						} ),
						{}
					),
				};
			} //end for
			altIndex++;
		} //end for

		let segmentIndex = 0;
		altIndex = 0;
		for ( const segment of test?.segments ?? [] ) {
			const segmentResult = results?.segments[ segment.id ];
			for ( const alt of test?.alternatives ?? [] ) {
				const altResult = segmentResult?.alternatives[ alt.id ];
				for ( const day of altResult?.timeline ?? [] ) {
					const {
						date,
						visits,
						uniqueVisits,
						conversions,
						uniqueConversions,
					} = day;
					data[ date ] = {
						...( data[ date ] ?? {} ),
						date,
						[ `segment-${ segmentIndex }-alt-${ altIndex }-visits` ]:
							visits,
						[ `segment-${ segmentIndex }-alt-${ altIndex }-unique-visits` ]:
							uniqueVisits,
						...( test?.goals ?? [] ).reduce(
							( acc, goal, i ) => ( {
								...acc,
								[ `segment-${ segmentIndex }-alt-${ altIndex }-conversions-goal-${ i }` ]:
									conversions[ goal.id ],
								[ `segment-${ segmentIndex }-alt-${ altIndex }-unique-conversions-goal-${ i }` ]:
									uniqueConversions[ goal.id ],
								[ `segment-${ segmentIndex }-alt-${ altIndex }-value-goal-${ i }` ]:
									day.values[ goal.id ],
								[ `segment-${ segmentIndex }-alt-${ altIndex }-unique-value-goal-${ i }` ]:
									day.uniqueValues[ goal.id ],
							} ),
							{}
						),
					};
				} //end for
				altIndex++;
			} //end for
			segmentIndex++;
		} //end for

		const columns = keys( values( data )[ 0 ] ?? {} ).map( ( key ) => ( {
			accessor: ( item: Record< string, string | number | undefined > ) =>
				item[ key ],
			name: key,
		} ) );

		downloadAsCsv(
			columns,
			values( data ),
			sprintf(
				/* translators: a unique identifier */
				_x( 'test-%s.csv', 'text', 'nelio-ab-testing' ),
				test?.id ?? 0
			)
		);
	};
