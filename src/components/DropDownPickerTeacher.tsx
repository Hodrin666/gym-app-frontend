/**
 * Module dependencies.
 */

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import theme from '../../theme';
import DropDownPicker, { ListModeType } from 'react-native-dropdown-picker';
import { FormikErrors } from 'formik/dist/types';
import { SessionFrom } from './Forms/createSessionForm';
import { isEqual, isNil, isNull } from 'lodash';

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
	listMode?: ListModeType;
	onChange?: (e: T | React.ChangeEvent<any>) => void;
	initialValue?: string;
}

/**
 * Interface IItems.
 */

interface IItems {
	label: string;
	value: string;
}

/**
 * DropDownPickerComponentTeacher function element.
 */

const DropDownPickerComponentTeacher = (props: IProps<any>): JSX.Element => {
	const {
		listMode,
		open,
		setOpen,
		setClose,
		setFieldValue,
		queryData,
		initialValue,
	} = props;

	const [valueTeacher, setValueTeacher] = useState(
		isNil(initialValue) ? null : initialValue
	);
	const [itemsTeacher, setItemsTeacher] = useState<IItems[]>([]);

	useEffect(() => {
		let elements = [];
		for (const element of queryData.allTeachers) {
			elements.push({
				label: `${element.firstName} ${element.lastName}`,
				value: element._id,
			});
		}
		setItemsTeacher(elements);
	}, []);

	return (
		<DropDownPicker
			key={0}
			listMode={listMode}
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
				maxHeight: !listMode ? 400 : 96,
			}}
			open={open}
			setOpen={setOpen}
			items={itemsTeacher}
			value={valueTeacher}
			onOpen={() => {
				for (const element of setClose) {
					element(false);
				}
			}}
			setValue={setValueTeacher}
			setItems={setItemsTeacher}
			zIndex={3000}
			onChangeValue={value => {
				setFieldValue('_teacherID', value);
			}}
		/>
	);
};

/**
 * Export `DropDownPickerComponentTeacher`.
 */

export default DropDownPickerComponentTeacher;
