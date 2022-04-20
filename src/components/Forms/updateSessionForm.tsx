/**
 * Module dependencies.
 */

import AppLoading from 'expo-app-loading';
import { ifProp } from 'styled-tools';
import styled from 'styled-components/native';
import theme from '../../../theme';
import { Alert, useWindowDimensions, View } from 'react-native';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useFormik } from 'formik';
import { useMutation, gql, useQuery, ApolloQueryResult } from '@apollo/client';
import DateTimePicker from '@react-native-community/datetimepicker';
import TextArea from '../TextArea';
import DropDownPickerComponentTeacher from '../DropDownPickerTeacher';
import DropDownPickerComponentStudent from '../DropDownPickerStudent';
import { ICard } from '../../screens/addGymClass';
import { isEqual } from 'lodash';

/**
 * `AndroidMode` type.
 */

type AndroidMode = 'date' | 'time';

/**
 * `IUpdateSessionForm` Interface.
 */

export interface IUpdateSessionForm {
	_teacherID: string;
	date: string;
	time: string;
	members?: string[];
	repeat?: string;
	description: string;
}

interface IMutationEdit extends IUpdateSessionForm {
	_id: string;
}
/**
 * `IProps` IProps.
 */

interface IProps {
	setModalOpen: Dispatch<SetStateAction<boolean>>[];
	refetch: (
		variables?:
			| Partial<{
					first: React.Dispatch<React.SetStateAction<number>>;
			  }>
			| undefined
	) => Promise<ApolloQueryResult<any>>;
	item: ICard;
	setCardData: React.Dispatch<React.SetStateAction<ICard | undefined>>;
}

/**
 * Interface `InputMessage`.
 */

interface InputMessage {
	success: boolean;
	message: string;
	class: {
		_id: string;
		members?: string[];
		teacher: string;
	};
}

/**
 * `DropDownContainer` styled component.
 */

const DropDownContainer = styled.View`
	margin: 28px 20px 0;
	min-height: 48px;
`;

/**
 * `InputContainer` styled component.
 */

const InputContainer = styled.TouchableOpacity<{ last?: boolean }>`
	margin: ${ifProp({ last: true }, '0 20px', '28px 20px')};
	background-color: ${theme.colors.main};
	min-height: 48px;
	border-radius: ${theme.borderRadius};
	border: 1px solid black;
	display: flex;
	justify-content: center;
	padding-left: 8px;
`;

/**
 * `StyledText` styled component.
 */

const StyledText = styled.Text`
	color: ${theme.colors.bright};
`;

/**
 * `CreateSessionButton` styled component.
 */

const CreateSessionButton = styled.TouchableOpacity`
	align-self: center;
	min-height: 63px;
	max-height: 63px;
	width: 248px;
	flex: 1;
	margin-top: 50px;
	margin-bottom: 8px;
	background-color: ${theme.colors.blue};
	color: ${theme.colors.third};
	border-radius: ${theme.borderRadius};
	border: 1px solid black;
	align-items: center;
	justify-content: center;
`;

/**
 * `CreateSessionText` styled component.
 */

const CreateSessionText = styled.Text`
	color: ${theme.colors.secondary};
	font-size: 22px;
`;

const CancelSessionButton = styled.TouchableOpacity`
	align-self: center;
	min-height: 63px;
	max-height: 63px;
	width: 200px;
	flex: 1;
	margin-top: 50px;
	margin-bottom: 8px;
	background-color: ${theme.colors.main};
	color: ${theme.colors.bright};
	border-radius: ${theme.borderRadius};
	border: 1px solid black;
	align-items: center;
	justify-content: center;
`;
/**
 * `CancelSessionText` styled component.
 */

const CancelSessionText = styled.Text`
	color: ${theme.colors.bright};
	font-size: 22px;
`;

const AllUsers = gql`
	query AllUsers {
		allUsers {
			firstName
			lastName
			_id
		}
		allTeachers {
			firstName
			lastName
			_id
		}
	}
`;

const EditGymClassById = gql`
	mutation EditGymClassById($input: editClassInput!) {
		editGymClassById(input: $input) {
			success
			message
			class {
				date
				description
				time
				members
				teacher {
					firstName
					lastName
				}
			}
		}
	}
`;

/**
 * `UpdateSessionForm` function component.
 */

const UpdateSessionForm = (props: IProps): JSX.Element => {
	const { setModalOpen, refetch, setCardData, item } = props;
	const { loading: queryLoading, data: queryData, error } = useQuery(AllUsers);
	const [openTeacher, setOpenTeacher] = useState(false);
	const [openStudent, setOpenSudent] = useState(false);
	const [dateText, setDateText] = useState(item.date);
	const [hourText, setHourText] = useState(item.time);
	const windowHeight = useWindowDimensions().height;

	const [date, setDate] = useState(new Date(1598051730000));
	const [time, setTime] = useState(new Date(1598051730000));
	const [mode, setMode] = useState<AndroidMode | undefined>('date');
	const [show, setShow] = useState(false);

	const showMode = (currentMode: AndroidMode) => {
		setShow(true);
		setMode(currentMode);
	};

	const showDatepicker = () => {
		showMode('date');
	};

	const showTimepicker = () => {
		showMode('time');
	};

	const initialValues: IUpdateSessionForm = {
		_teacherID: item._teacherID,
		date: item.date,
		time: item.time,
		members: item.members,
		description: item.description,
	};

	const [editGymClassById, { loading: mutationLoading, data: mutationData }] =
		useMutation<{ editGymClassById: InputMessage }, { input: IMutationEdit }>(
			EditGymClassById
		);

	const {
		handleChange,
		handleSubmit,
		setFieldValue,
		handleBlur,
		values,
		errors,
		touched,
	} = useFormik({
		initialValues,
		onSubmit: async values => {
			if (!isEqual(values, initialValues)) {
				console.log('Dispara');
				editGymClassById({
					variables: {
						input: {
							_id: item._id,
							_teacherID: values._teacherID,
							members: values.members,
							date: values.date,
							time: values.time,
							description: values.description,
						},
					},
					onCompleted: async ({ editGymClassById }) => {
						if (editGymClassById.success) {
							Alert.alert('Class', 'Updated successfully!', [{ text: 'OK' }]);
						}
					},
					onError: error => {
						console.log('Error: ', error);
					},
				});
			}

			await refetch();

			for (const element of setModalOpen) {
				element(false);
			}
		},
	});

	const onChange = (event: any, selectedDate?: Date) => {
		if (!selectedDate) return date;
		const currentDate = selectedDate;

		if (mode === 'date') {
			setShow(false);
			setDate(currentDate);
			setDateText(currentDate.toLocaleDateString());
			setFieldValue('date', currentDate.toLocaleDateString());
		} else {
			const timeFormated = `${currentDate.toLocaleTimeString().split(':')[0]}:${
				currentDate.toLocaleTimeString().split(':')[1]
			}`;
			setShow(false);
			setDate(currentDate);
			setHourText(timeFormated);
			setFieldValue('time', timeFormated);
		}
	};

	if (error) {
		console.log('gg', error);
	}

	if (queryLoading) {
		return <AppLoading />;
	} else {
		return (
			<View>
				<DropDownContainer>
					<DropDownPickerComponentTeacher
						queryData={queryData}
						setFieldValue={setFieldValue}
						setClose={[setOpenSudent]}
						open={openTeacher}
						setOpen={setOpenTeacher}
						initialValue={initialValues._teacherID}
					/>
				</DropDownContainer>

				<InputContainer onPress={showDatepicker}>
					<StyledText> {dateText} </StyledText>
				</InputContainer>

				<InputContainer last={true} onPress={showTimepicker}>
					<StyledText> {hourText} </StyledText>
				</InputContainer>

				{show && (
					<DateTimePicker
						testID="dateTimePicker"
						value={date}
						minimumDate={new Date()}
						mode={mode}
						is24Hour={true}
						onChange={onChange}
					/>
				)}

				<DropDownContainer>
					<DropDownPickerComponentStudent
						queryData={queryData}
						setFieldValue={setFieldValue}
						setClose={[setOpenTeacher]}
						open={openStudent}
						setOpen={setOpenSudent}
						initialValue={initialValues.members}
					/>
				</DropDownContainer>

				<TextArea
					onChangeText={handleChange('description')}
					initialValue={initialValues.description}
				/>

				<CreateSessionButton
					onPress={() => {
						handleSubmit();
						setCardData(undefined);
					}}
				>
					<CreateSessionText>
						{mutationLoading ? 'Loading ' : 'Create Session'}
					</CreateSessionText>
				</CreateSessionButton>

				<CancelSessionButton
					onPress={() => {
						setCardData(undefined);
						for (const element of setModalOpen) {
							element(false);
						}
					}}
				>
					<CancelSessionText>{'Cancel session'}</CancelSessionText>
				</CancelSessionButton>
			</View>
		);
	}
};

export default UpdateSessionForm;
