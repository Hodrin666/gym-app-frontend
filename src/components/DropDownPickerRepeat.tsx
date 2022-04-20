/**
 * Module dependencies.
 */

import React, { Dispatch, SetStateAction, useState } from 'react';
import theme from '../../theme';
import DropDownPicker from 'react-native-dropdown-picker';
import { FormikErrors } from 'formik/dist/types';
import { SessionFrom } from './Forms/createSessionForm';

/**
 * Interface IProps.
 */

interface IProps {
	setFieldValue: (
		field: string,
		value: any,
		shouldValidate?: boolean | undefined
	) => Promise<void> | Promise<FormikErrors<SessionFrom>>;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	setClose: Dispatch<SetStateAction<boolean>>[];
}

/**
 * Interface IItems.
 */

interface IItems {
	label: string;
	value: string;
}

/**
 * `DropDownPickerComponentRepeat` function component.
 */

const DropDownPickerComponentRepeat = (props: IProps): JSX.Element => {
	const { open, setOpen, setClose, setFieldValue } = props;
	const [valueRepeat, setValueRepeat] = useState(null);
	const [itemsRepeat, setItemsRepeat] = useState<IItems[]>([
		{ label: 'Does not Repeat', value: 'DNR' },
		{ label: 'Every day', value: 'DAILY' },
		{ label: 'Every week', value: 'WEEKLY' },
		{ label: 'Every month', value: 'MONTHLY' },
		{ label: 'Every year', value: 'YEARLY' },
	]);

	return (
		<DropDownPicker
			key={2}
			theme="DARK"
			listItemLabelStyle={{
				color: theme.colors.bright,
			}}
			style={{
				backgroundColor: theme.colors.main,
				borderRadius: 14,
				height: 48,
			}}
			textStyle={{
				color: theme.colors.bright,
			}}
			labelStyle={{
				backgroundColor: theme.colors.main,
			}}
			dropDownContainerStyle={{
				backgroundColor: theme.colors.main,
				borderRadius: 14,
			}}
			value={valueRepeat}
			items={itemsRepeat}
			open={open}
			setOpen={setOpen}
			setValue={setValueRepeat}
			setItems={setItemsRepeat}
			onOpen={() => {
				for (const element of setClose) {
					element(false);
				}
			}}
			zIndex={1000}
			onChangeValue={value => {
				setFieldValue('repeat', value);
			}}
		/>
	);
};

/**
 * Export `DropDownPickerComponentRepeat`.
 */

export default DropDownPickerComponentRepeat;
