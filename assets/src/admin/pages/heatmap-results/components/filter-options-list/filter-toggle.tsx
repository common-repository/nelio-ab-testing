/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useInstanceId } from '@safe-wordpress/compose';
import { BaseControl, Dashicon } from '@safe-wordpress/components';

export type FilterToggleProps = {
	readonly label: string | JSX.Element;
	readonly className: string;
	readonly heading?: string;
	readonly checked: boolean;
	readonly onChange: ( checked: boolean ) => void;
	readonly color: string;
	readonly disabled: boolean;
};

export const FilterToggle = ( {
	label,
	className,
	heading,
	checked,
	onChange,
	color,
	disabled,
}: FilterToggleProps ): JSX.Element => {
	const instanceId = useInstanceId( FilterToggle );
	const id = `inspector-checkbox-control-${ instanceId }`;

	const style = color
		? {
				borderColor: color,
				backgroundColor: color,
				opacity: checked ? 1 : 0.5,
		  }
		: {};

	return (
		<BaseControl label={ heading } id={ id } className={ className }>
			<span className="components-checkbox-control__input-container">
				<input
					id={ id }
					style={ style }
					className="components-checkbox-control__input"
					type="checkbox"
					value="1"
					onChange={ ( ev ) => onChange( !! ev.target.checked ) }
					checked={ checked }
					disabled={ disabled }
				/>
				{ checked ? (
					<Dashicon
						icon="yes"
						className="components-checkbox-control__checked"
						role="presentation"
					/>
				) : null }
			</span>
			<label
				className="components-checkbox-control__label"
				htmlFor={ id }
			>
				{ label }
			</label>
		</BaseControl>
	);
};
