/**
 * Module dependencies.
 */

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import theme from '../../theme';
import DropDownPicker from 'react-native-dropdown-picker';
import { FormikErrors } from 'formik/dist/types';
import { SessionFrom } from './Forms/sessionForm';

/**
 * Interface IProps.
 */

interface IProps<T> {
	queryData: any;
	setFieldValue: (
		field: string,
		value: any,
		shouldValidate?: boolean | undefined
	) => Promise<void> | Promise<FormikErrors<SessionFrom>>;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	setClose: Dispatch<SetStateAction<boolean>>[];
	onChange?: (e: T | React.ChangeEvent<any>) => void;
}

/**
 * `DropDownPickerComponentStudent` function component.
 */

const DropDownPickerComponentStudent = (props: IProps<any>): JSX.Element => {
	const { open, setOpen, setClose, setFieldValue, queryData } = props;
	const [valueStudent, setValueStudent] = useState([]);
	const [itemsStudent, setItemsStudent] = useState([{}]);

	useEffect(() => {
		let elements = [];
		for (const element of queryData.allUsers) {
			elements.push({
				label: `${element.firstName} ${element.lastName}`,
				value: `${element._id}`,
			});
		}
		setItemsStudent(elements);
	}, []);

	return (
		<DropDownPicker
			key={1}
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
				maxHeight: 96,
			}}
			open={open}
			setOpen={setOpen}
			items={itemsStudent}
			value={valueStudent}
			onOpen={() => {
				for (const element of setClose) {
					element(false);
				}
			}}
			setValue={setValueStudent}
			setItems={setItemsStudent}
			zIndex={3000}
			multiple={true}
			onChangeValue={value => {
				setFieldValue('members', value);
			}}
		/>
	);
};

/**
 * Export `DropDownPickerComponentStudent`.
 */

export default DropDownPickerComponentStudent;
