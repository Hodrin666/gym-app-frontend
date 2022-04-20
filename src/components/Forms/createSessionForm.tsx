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
import * as Yup from 'yup';
import { useMutation, gql, useQuery, ApolloQueryResult } from '@apollo/client';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RRule } from 'rrule';
import TextArea from '../TextArea';
import DropDownPickerComponentTeacher from '../DropDownPickerTeacher';
import DropDownPickerComponentStudent from '../DropDownPickerStudent';
import DropDownPickerComponentRepeat from '../DropDownPickerRepeat';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AllClasses } from '../../screens/addGymClass';

/**
 * `AndroidMode` type.
 */

type AndroidMode = 'date' | 'time';

/**
 * `SessionFrom` Interface.
 */

export interface SessionFrom {
	_teacherID: string;
	date: string;
	time: string;
	members?: string[];
	repeat?: string;
	description: string;
}

/**
 * `IProps` IProps.
 */

interface IProps {
	setModalOpen: Dispatch<SetStateAction<boolean>>;
	refetch: (
		variables?:
			| Partial<{
					first: React.Dispatch<React.SetStateAction<number>>;
			  }>
			| undefined
	) => Promise<ApolloQueryResult<any>>;
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

const CreateGymClass = gql`
	mutation CreateGymClass($input: classInput!) {
		createGymClass(input: $input) {
			success
			message
			class {
				_id
				members
				_teacherID
				date
				time
				description
				createdAt
				deletedAt
			}
		}
	}
`;

/**
 * `CreateSessionForm` function component.
 */

const CreateSessionForm = (props: IProps): JSX.Element => {
	const { setModalOpen, refetch } = props;
	const { loading: queryLoading, data: queryData, error } = useQuery(AllUsers);
	const [openTeacher, setOpenTeacher] = useState(false);
	const [openStudent, setOpenSudent] = useState(false);
	const [openRepeat, setOpenRepeat] = useState(false);
	const [dateText, setDateText] = useState('01/01/2001');
	const [hourText, setHourText] = useState('01:55');
	const windowHeight = useWindowDimensions().height;

	const [date, setDate] = useState(new Date(1598051730000));
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

	const initialValues: SessionFrom = {
		_teacherID: '',
		date: '',
		time: '',
		members: [],
		repeat: '',
		description: '',
	};

	const validationSchema = Yup.object().shape({
		_teacherID: Yup.string().required('Required'),
		date: Yup.string().required('Required'),
		time: Yup.string().required('Required'),
		repeat: Yup.string().required('Required'),
	});

	const [createGymClass, { loading: mutationLoading, data: mutationData }] =
		useMutation<{ createGymClass: InputMessage }, { input: SessionFrom }>(
			CreateGymClass
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
		validationSchema,
		onSubmit: async values => {
			const getCurrentYear = new Date().getFullYear();
			const day = parseInt(values.date.split('/')[1]);
			const month = parseInt(values.date.split('/')[0]) - 1;
			const year = parseInt(`20${values.date.split('/')[2]}`);
			const hour = parseInt(values.time.split(':')[0]);
			const minutes = parseInt(values.time.split(':')[1]);
			const date = new Date(Date.UTC(year, month, day, hour, minutes));

			let dates;
			if (values.repeat === 'DNR') {
				createGymClass({
					variables: {
						input: {
							_teacherID: values._teacherID,
							members: values.members,
							date: values.date,
							time: values.time,
							description: values.description,
						},
					},
					onCompleted: async ({ createGymClass }) => {
						if (createGymClass.success) {
							Alert.alert('Class', 'Inserted!', [{ text: 'OK' }]);
							await refetch();
						}
					},
					onError: error => {
						console.log('Error: ', error);
					},
				});
			} else if (values.repeat === 'DAILY') {
				const rule = new RRule({
					freq: RRule.DAILY,
					dtstart: date,
					until: new Date(Date.UTC(getCurrentYear, 12)),
				});

				dates = rule.all();
			} else if (values.repeat === 'WEEKLY') {
				const rule = new RRule({
					freq: RRule.WEEKLY,
					dtstart: date,
					until: new Date(Date.UTC(getCurrentYear, 12)),
				});

				dates = rule.all();
			} else if (values.repeat === 'MONTHLY') {
				const rule = new RRule({
					freq: RRule.MONTHLY,
					dtstart: date,
					until: new Date(Date.UTC(getCurrentYear, 12)),
				});

				dates = rule.all();
			} else if (values.repeat === 'YEARLY') {
				const rule = new RRule({
					freq: RRule.YEARLY,
					dtstart: date,
					until: new Date(Date.UTC(getCurrentYear, 12)),
				});

				dates = rule.all();
			} else {
				console.log('Date not received');
			}
			setModalOpen(false);
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
						setClose={[setOpenSudent, setOpenRepeat]}
						open={openTeacher}
						setOpen={setOpenTeacher}
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
						setClose={[setOpenTeacher, setOpenRepeat]}
						open={openStudent}
						setOpen={setOpenSudent}
					/>
				</DropDownContainer>

				<DropDownContainer>
					<DropDownPickerComponentRepeat
						setFieldValue={setFieldValue}
						setClose={[setOpenTeacher, setOpenTeacher]}
						open={openRepeat}
						setOpen={setOpenRepeat}
					/>
				</DropDownContainer>

				<TextArea onChangeText={handleChange('description')} />

				<CreateSessionButton onPress={() => handleSubmit()}>
					<CreateSessionText>
						{mutationLoading ? 'Loading ' : 'Create Session'}
					</CreateSessionText>
				</CreateSessionButton>

				<CancelSessionButton onPress={() => setModalOpen(false)}>
					<CancelSessionText>{'Cancel session'}</CancelSessionText>
				</CancelSessionButton>
			</View>
		);
	}
};

export default CreateSessionForm;