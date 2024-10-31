/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	Button,
	DateTimePicker as DateTimePickerDropdown,
	Dropdown,
} from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';
import { useInstanceId } from '@safe-wordpress/compose';

/**
 * External dependencies
 */
import { formatDateToUtc, formatI18nDatetime, getSettings } from '@nab/date';

/**
 * Internal dependencies
 */
import './style.scss';

export type DateTimePickerProps = {
	readonly className?: string;
	readonly date: string;
	readonly onChange: ( val: string | false ) => void;
	readonly noDateLabel?: string;
	readonly hasNowLink?: boolean;
	readonly readonly?: boolean;
};

export const DateTimePicker = ( {
	className = '',
	date,
	onChange,
	noDateLabel,
	hasNowLink = true,
}: DateTimePickerProps ): JSX.Element => {
	const instanceId = useInstanceId( DateTimePicker );

	const settings = getSettings();
	const is12HourTime = /a(?!\\)/i.test(
		settings.formats.time
			.toLowerCase() // Test only the lower case a
			.replace( /\\\\/g, '' ) // Replace "//" with empty strings
			.split( '' )
			.reverse()
			.join( '' ) // Reverse the string and test for "a" not followed by a slash
	);

	return (
		<Dropdown
			placement="bottom"
			contentClassName={ `nab-date-time-picker ${ className }` }
			renderToggle={ ( { onToggle, isOpen } ) => (
				<>
					<label
						className={ `nab-date-time-picker__label screen-reader-text` }
						htmlFor={ `nab-date-time-picker__toggle-${ instanceId }` }
					>
						{ _x( 'Click to change', 'user', 'nelio-ab-testing' ) }
					</label>
					<Button
						id={ `nab-date-time-picker__toggle-${ instanceId }` }
						type="button"
						className={ `nab-date-time-picker__toggle` }
						onClick={ onToggle }
						aria-expanded={ isOpen }
						aria-live="polite"
						variant="link"
					>
						{ date ? formatI18nDatetime( date ) : noDateLabel }
					</Button>
				</>
			) }
			renderContent={ () => (
				<>
					<DateTimePickerDropdown
						currentDate={ date }
						onChange={ ( value ) =>
							onChange( value ? formatDateToUtc( value ) : false )
						}
						is12Hour={ is12HourTime }
					/>
					{ !! hasNowLink && (
						<Button
							variant="link"
							className="nab-date-time-picker__clear-date"
							onClick={ () => onChange( false ) }
						>
							{ _x( 'Now', 'text', 'nelio-ab-testing' ) }
						</Button>
					) }
				</>
			) }
		/>
	);
};
