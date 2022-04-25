/**
 * Module dependencies.
 */

import AppLoading from 'expo-app-loading';
import { ifProp } from 'styled-tools';
import styled from 'styled-components/native';
import theme from '../../../theme';
import {
	Alert,
	Text,
	useWindowDimensions,
	View,
	TextInput as TI,
} from 'react-native';
import React, { useContext, useRef, useState } from 'react';
import { useFormik, Formik } from 'formik';
import { useMutation, gql, useQuery, ApolloQueryResult } from '@apollo/client';
import TextArea from '../TextArea';
import { isEqual } from 'lodash';
import TextInput from '../TextInput';
import Button from '../ButtonLoginReg';
import { AuthContext } from '../../utils/AuthProvider';

/**
 * `IUpdateSessionForm` Interface.
 */

export interface IUpdateProfile {
	email: string;
	firstName: string;
	lastName: string;
	contact: string;
}

/**
 * Export `IMutationEdit` interface.
 */

export interface IMutationEdit extends IUpdateProfile {
	_id: string;
}
/**
 * `IProps` IProps.
 */

interface IProps {
	userData: IUpdateProfile;
}

/**
 * Export `InputMessage` interface.
 */

export interface InputMessage {
	success: boolean;
	message: string;
}

/**
 * `Container` styled component.
 */

const Container = styled.ScrollView`
	flex: 1;
	margin: 28px 20px 0;
	min-height: 48px;
	padding-top: 28px;
`;

/**
 * `SubmitButton` styled component.
 */

const SubmitButton = styled.TouchableOpacity`
	flex: 1;
	margin: 80px 80px 0;
	min-height: 58px;
	background-color: ${theme.colors.blue};
	border-radius: ${theme.borderRadius};
	display: flex;
	align-items: center;
	justify-content: center;
`;

/**
 * `SubmitButton` styled component.
 */

const SubmitButtonLabel = styled.Text`
	font-size: 22px;
`;

const UpdateUser = gql`
	mutation UpdateUser($input: memberUpdateInput) {
		updateUser(input: $input) {
			message
			success
		}
	}
`;

/**
 * `UpdateSessionForm` function component.
 */

const UpdateSessionForm = (props: IProps): JSX.Element => {
	const { userAuth } = useContext(AuthContext);
	const { userData } = props;
	const lastNameRef = useRef<any>(null);
	const contactRef = useRef<any>(null);

	const [editGymClassById] = useMutation<
		{ updateUser: InputMessage },
		{ input: IMutationEdit }
	>(UpdateUser);

	const initialValues: IUpdateProfile = {
		contact: userData.contact,
		email: userData.email,
		firstName: userData.firstName,
		lastName: userData.lastName,
	};

	return (
		<Container>
			<Formik
				initialValues={initialValues}
				onSubmit={async values => {
					if (!isEqual(values, initialValues)) {
						editGymClassById({
							variables: {
								input: {
									_id: userAuth?.member._id || '',
									contact: values.contact,
									email: values.email,
									firstName: values.firstName,
									lastName: values.lastName,
								},
							},
							onCompleted: async ({ updateUser }) => {
								if (updateUser.success) {
									Alert.alert('Profile', 'Updated successfully!', [
										{ text: 'OK' },
									]);
								}
							},
							onError: error => {
								console.log('Error: ', error);
							},
						});
					}
				}}
			>
				{({ handleChange, handleSubmit, values, errors }) => (
					<>
						<TextInput
							ref={lastNameRef}
							icon={'user-alt'}
							value={values.firstName}
							placeholder="Last Name"
							onChangeText={handleChange('firstName')}
							onSubmitEditing={() => lastNameRef.current?.focus()}
							returnKeyType={'next'}
							returnKeyLabel={'next'}
							last={false}
						/>

						<TextInput
							ref={lastNameRef}
							icon={'user-alt'}
							value={values.lastName}
							placeholder="Last Name"
							onChangeText={handleChange('lastName')}
							onSubmitEditing={() => contactRef.current?.focus()}
							returnKeyType={'next'}
							returnKeyLabel={'next'}
							last={false}
						/>

						<TextInput
							ref={contactRef}
							icon={'phone-alt'}
							value={values.contact.toString()}
							placeholder="Contact"
							onChangeText={handleChange('contact')}
							returnKeyType={'go'}
							returnKeyLabel={'go'}
							last={false}
						/>

						<SubmitButton onPress={() => handleSubmit()}>
							<SubmitButtonLabel>{'Submit'}</SubmitButtonLabel>
						</SubmitButton>
					</>
				)}
			</Formik>
		</Container>
	);
};

export default UpdateSessionForm;
