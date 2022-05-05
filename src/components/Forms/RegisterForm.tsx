/**
 * Module dependencies.
 */

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
import { Formik } from 'formik';
import { useMutation, gql, useQuery, ApolloQueryResult } from '@apollo/client';
import TextArea from '../TextArea';
import TextInput from '../TextInput';
import Button from '../ButtonLoginReg';
import * as Yup from 'yup';
import {
	useFonts,
	Roboto_400Regular,
	Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';

/**
 * `IProps` Interface.
 */

export interface IProps {
	navigate: any;
}

/**
 * `IRegisterMemberInput` Interface.
 */

export interface IRegisterMemberInput {
	email: string;
	firstName: string;
	lastName: string;
	contact: string;
	password: string;
}

/**
 * `IRegisterMemberInputForm` Interface.
 */

export interface IRegisterMemberInputForm extends IRegisterMemberInput {
	repeatPassword: string;
}

/**
 * Export `InputMessage` interface.
 */

export interface InputMessage {
	success: boolean;
	message: string;
	member: any;
}

/**
 * `StyledErrorText` styled component.
 */

const StyledErrorText = styled.Text`
	color: ${theme.colors.error};
	margin-left: 60px;
`;

/**
 * `InputContainer` styled component.
 */

const InputContainer = styled.View`
	display: flex;
	padding: 12px 0;
`;

/**
 * `Container` styled component.
 */

const Container = styled.ScrollView`
	flex: 1;
	margin: 28px 0;
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
	font-family: Roboto_700Bold;
`;

const RegisterUser = gql`
	mutation RegisterUser($input: registerMemberInput!) {
		registerUser(input: $input) {
			success
			member {
				createdAt
				contact
				email
				firstName
				role
				password
				lastName
				_id
				deletedAt
			}
			message
		}
	}
`;

/**
 * `RegisterForm` function component.
 */

const RegisterForm = (props: IProps): JSX.Element => {
	const { navigate } = props;
	const lastNameRef = useRef<any>(null);
	const contactRef = useRef<any>(null);
	const emailRef = useRef<any>(null);
	const passwordRef = useRef<any>(null);
	const repeatPasswordRef = useRef<any>(null);

	const [registerUser, { loading }] = useMutation<
		{ registerUser: InputMessage },
		{ input: IRegisterMemberInput }
	>(RegisterUser);

	const initialValues: IRegisterMemberInputForm = {
		contact: '',
		email: '',
		firstName: '',
		lastName: '',
		password: '',
		repeatPassword: '',
	};

	const RegisterSchema = Yup.object().shape({
		firstName: Yup.string()
			.min(2, 'Too Short!')
			.max(30, 'Too Long!')
			.required('Required'),
		lastName: Yup.string()
			.min(2, 'Too Short!')
			.max(30, 'Too Long!')
			.required('Required'),
		contact: Yup.number()
			.typeError('Only numbers are accepted')
			.min(2, 'Too Short!')
			.max(9999999999, 'Too Long!')
			.required('Required'),
		email: Yup.string().email('Invalid email').required('Required'),
		password: Yup.string().required('Required'),
		repeatPassword: Yup.string()
			.oneOf([Yup.ref('password'), null], 'Passwords must match')
			.required('Required'),
	});

	const [fontsLoaded] = useFonts({
		Roboto_400Regular,
		Roboto_700Bold,
	});

	if (!fontsLoaded) {
		return <AppLoading />;
	}

	return (
		<Container>
			<Formik
				initialValues={initialValues}
				validationSchema={RegisterSchema}
				onSubmit={async values => {
					console.log('Values', values);

					registerUser({
						variables: {
							input: {
								contact: values.contact,
								email: values.email,
								firstName: values.firstName,
								lastName: values.lastName,
								password: values.password,
							},
						},
						onCompleted: async ({ registerUser }) => {
							console.log('registerUser:', registerUser.message);
							if (registerUser.success) {
								Alert.alert(
									'Member: redirecting to login',
									'Member created successful!',
									[{ text: 'OK' }]
								);
							} else if (
								registerUser.message === 'Email is already being used'
							) {
								Alert.alert(
									'Member: redirecting to login',
									'Email already in use!',
									[{ text: 'OK' }]
								);
							}
							navigate.navigate('Login');
						},
						onError: error => {
							console.log('Error: ', error);
						},
					});
				}}
			>
				{({
					handleChange,
					handleSubmit,
					values,
					errors,
					touched,
					handleBlur,
				}) => (
					<>
						<InputContainer>
							<TextInput
								icon={'user-alt'}
								value={values.firstName}
								onBlur={handleBlur('firstName')}
								error={errors.firstName}
								touched={touched.firstName}
								placeholder="First Name"
								onChangeText={handleChange('firstName')}
								onSubmitEditing={() => lastNameRef.current?.focus()}
								returnKeyType={'next'}
								returnKeyLabel={'next'}
								last={true}
							/>
							{errors.firstName && touched.firstName ? (
								<StyledErrorText>{errors.firstName}</StyledErrorText>
							) : (
								<StyledErrorText>{''}</StyledErrorText>
							)}
						</InputContainer>

						<InputContainer>
							<TextInput
								ref={lastNameRef}
								icon={'user-alt'}
								value={values.lastName}
								onBlur={handleBlur('lastName')}
								error={errors.lastName}
								touched={touched.lastName}
								placeholder="Last Name"
								onChangeText={handleChange('lastName')}
								onSubmitEditing={() => contactRef.current?.focus()}
								returnKeyType={'next'}
								returnKeyLabel={'next'}
								last={true}
							/>
							{errors.lastName && touched.lastName ? (
								<StyledErrorText>{errors.lastName}</StyledErrorText>
							) : (
								<StyledErrorText>{''}</StyledErrorText>
							)}
						</InputContainer>

						<InputContainer>
							<TextInput
								ref={contactRef}
								icon={'phone-alt'}
								value={values.contact.toString()}
								placeholder="Contact"
								onBlur={handleBlur('contact')}
								keyboardType={'numeric'}
								error={errors.contact}
								touched={touched.contact}
								onChangeText={handleChange('contact')}
								onSubmitEditing={() => emailRef.current?.focus()}
								returnKeyType={'go'}
								returnKeyLabel={'go'}
								last={true}
							/>
							{errors.contact && touched.contact ? (
								<StyledErrorText>{errors.contact}</StyledErrorText>
							) : (
								<StyledErrorText>{''}</StyledErrorText>
							)}
						</InputContainer>

						<InputContainer>
							<TextInput
								ref={emailRef}
								icon={'user-alt'}
								value={values.email}
								placeholder="Email"
								onBlur={handleBlur('email')}
								error={errors.email}
								touched={touched.email}
								onChangeText={handleChange('email')}
								onSubmitEditing={() => passwordRef.current?.focus()}
								returnKeyType={'next'}
								returnKeyLabel={'next'}
								last={true}
							/>
							{errors.email && touched.email ? (
								<StyledErrorText>{errors.email}</StyledErrorText>
							) : (
								<StyledErrorText>{''}</StyledErrorText>
							)}
						</InputContainer>

						<InputContainer>
							<TextInput
								ref={passwordRef}
								icon={'lock'}
								value={values.password}
								placeholder="Password"
								onBlur={handleBlur('password')}
								error={errors.password}
								touched={touched.password}
								onChangeText={handleChange('password')}
								onSubmitEditing={() => repeatPasswordRef.current?.focus()}
								secureTextEntry={true}
								returnKeyType={'next'}
								returnKeyLabel={'next'}
								last={true}
							/>
							{errors.password && touched.password ? (
								<StyledErrorText>{errors.password}</StyledErrorText>
							) : (
								<StyledErrorText>{''}</StyledErrorText>
							)}
						</InputContainer>

						<InputContainer>
							<TextInput
								ref={repeatPasswordRef}
								icon={'lock'}
								value={values.repeatPassword}
								placeholder="Repeat Password"
								onBlur={handleBlur('repeatPassword')}
								error={errors.repeatPassword}
								touched={touched.repeatPassword}
								secureTextEntry={true}
								onChangeText={handleChange('repeatPassword')}
								onSubmitEditing={() => handleSubmit()}
								returnKeyType={'go'}
								returnKeyLabel={'go'}
								last={true}
							/>
							{errors.repeatPassword && touched.repeatPassword ? (
								<StyledErrorText>{errors.repeatPassword}</StyledErrorText>
							) : (
								<StyledErrorText>{''}</StyledErrorText>
							)}
						</InputContainer>

						<SubmitButton onPress={() => handleSubmit()}>
							<SubmitButtonLabel>
								{loading ? 'Loading' : 'Register'}
							</SubmitButtonLabel>
						</SubmitButton>
					</>
				)}
			</Formik>
		</Container>
	);
};

export default RegisterForm;
