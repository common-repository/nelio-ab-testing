/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { select } from '@safe-wordpress/data';
import { sprintf, _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim } from 'lodash';
import { moneyFormat, numberFormat, compactInteger } from '@nab/i18n';
import { store as NAB_DATA } from '@nab/data';
import { getLetter, isEmpty } from '@nab/utils';
import type { ECommercePlugin } from '@nab/types';

export function getAlternativeName( index: number, name = '' ): string {
	name = trim( name );
	if ( ! isEmpty( name ) ) {
		return name;
	} //end if

	if ( 0 === index ) {
		return _x( 'Control Version', 'text', 'nelio-ab-testing' );
	} //end if

	return sprintf(
		/* translators: a letter, such as A, B, or C */
		_x( 'Variant %s', 'text', 'nelio-ab-testing' ),
		getLetter( index )
	);
} //end getAlternativeName()

export function getNumberLabel( value?: number ): JSX.Element {
	if ( 0 === value ) {
		return <>0</>;
	} //end if

	if ( ! value ) {
		return <>–</>;
	} //end if

	return <>{ numberFormat( value ) }</>;
} //end getNumberLabel()

export function getMoneyLabel(
	value?: number,
	ecommerce: ECommercePlugin = 'woocommerce'
): string {
	const { getECommerceSetting: read } = select( NAB_DATA );
	const currency = read( ecommerce, 'currencySymbol' );
	const currencyPosition = read( ecommerce, 'currencyPosition' );

	if ( 0 === value ) {
		return currencyPosition === 'before'
			? `${ currency }0`
			: `0${ currency }`;
	} //end if

	if ( ! value ) {
		return '–';
	} //end if

	const opts = {
		numberOfDecimals: read( ecommerce, 'numberOfDecimals' ),
		decimalSeparator: read( ecommerce, 'decimalSeparator' ),
		thousandsSeparator: read( ecommerce, 'thousandsSeparator' ),
	};
	const money =
		value < 100_000
			? moneyFormat( value, opts )
			: compactInteger( Math.floor( value ) );
	return currencyPosition === 'before'
		? `${ currency }${ money }`
		: `${ money }${ currency }`;
} //end getMoneyLabel()

export function getPercentageLabel( num: number ): JSX.Element {
	if ( ! num ) {
		return <>–</>;
	} //end if

	return <>{ numberFormat( num ) }%</>;
} //end getPercentageLabel()

export function getImprovementLabel( num: number ): JSX.Element {
	if ( ! num ) {
		return <></>;
	} //end if

	return (
		<>
			{ num < 0 ? '↓' : '↑' }
			{ numberFormat( Math.abs( num ) ) }%
		</>
	);
} //end getImprovementLabel()
