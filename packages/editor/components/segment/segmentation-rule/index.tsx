/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dashicon, PanelBody } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NAB_SEGMENTS } from '@nab/segmentation-rules';
import { isEmpty } from '@nab/utils';
import type {
	Dict,
	SegmentationRuleTypeName,
	SegmentationRule as SR,
} from '@nab/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NAB_EDITOR } from '../../../store';

export type SegmentationRuleProps = {
	readonly readOnly?: boolean;
	readonly rule: SR;
	readonly setAttributes: ( attrs: Dict ) => void;
	readonly remove: () => void;
};

export const SegmentationRule = ( {
	readOnly,
	rule,
	setAttributes,
	remove,
}: SegmentationRuleProps ): JSX.Element => {
	const experimentId = useExperimentId();
	const ruleType = useSegmentationRuleType( rule.type );

	const View = ruleType?.view;
	const Edit = ruleType?.edit;
	const Icon = ruleType?.icon;
	const attributes = rule?.attributes || {};
	const validate = ruleType?.validate ?? ( () => ( {} ) );

	const errors = validate( attributes );
	const [ initialOpen ] = useState( ! isEmpty( errors ) );

	if ( readOnly ) {
		return (
			<div className="nab-segmentation-rule">
				<div className="nab-segmentation-rule__view">
					{ !! Icon ? (
						<Icon className="nab-segmentation-rule__icon" />
					) : (
						<Dashicon
							className="nab-segmentation-rule__icon nab-segmentation-rule__icon--invalid"
							icon="warning"
						/>
					) }
					<div className="nab-segmentation-rule__actual-view">
						{ !! View ? (
							<View
								attributes={ attributes }
								experimentId={ experimentId }
							/>
						) : (
							<span>
								{ _x(
									'Invalid segmentation rule.',
									'text',
									'nelio-ab-testing'
								) }
							</span>
						) }
					</div>
				</div>
			</div>
		);
	} //end if

	return (
		<PanelBody
			className="nab-segmentation-rule"
			initialOpen={ initialOpen }
			title={
				(
					<div className="nab-segmentation-rule__view">
						{ !! Icon ? (
							<Icon className="nab-segmentation-rule__icon" />
						) : (
							<Dashicon
								className="nab-segmentation-rule__icon nab-segmentation-rule__icon--invalid"
								icon="warning"
							/>
						) }
						<div className="nab-segmentation-rule__actual-view">
							{ !! View ? (
								<View
									attributes={ attributes }
									experimentId={ experimentId }
								/>
							) : (
								<span>
									{ _x(
										'Invalid segmentation rule.',
										'text',
										'nelio-ab-testing'
									) }
								</span>
							) }
						</div>
					</div>
				 ) as unknown as string
			}
		>
			<div className="nab-segmentation-rule__edit">
				{ !! Edit ? (
					<Edit
						attributes={ attributes }
						experimentId={ experimentId }
						setAttributes={ setAttributes }
						errors={ errors }
					/>
				) : (
					<span>
						{ _x(
							'This segmentation rule can’t be properly loaded. Please consider removing it.',
							'text',
							'nelio-ab-testing'
						) }
					</span>
				) }
			</div>

			<Button
				variant="link"
				isDestructive
				onClick={ remove }
				className="nab-segmentation-rule__delete-button"
			>
				{ _x( 'Delete', 'command', 'neli-ab-testing' ) }
			</Button>
		</PanelBody>
	);
};

// =====
// HOOKS
// =====

const useExperimentId = () =>
	useSelect( ( select ) => select( NAB_EDITOR ).getExperimentId() );

const useSegmentationRuleType = ( type: SegmentationRuleTypeName ) =>
	useSelect( ( select ) =>
		select( NAB_SEGMENTS ).getSegmentationRuleType( type )
	);
