/**
 * Module dependencies.
 */

import AppLoading from 'expo-app-loading';
import Logo from '../../assets/logo.svg';
import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';
import theme from '../../theme';
import { Text, useWindowDimensions } from 'react-native';
import {
	useFonts,
	Roboto_400Regular,
	Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { useContext, useRef, useState } from 'react';
import { IStackScreenProps } from '../library/StackScreenProps';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '../components/ButtonLoginReg';
import TextInput from '../components/TextInput';
import { useMutation, gql } from '@apollo/client';
import { AuthContext } from '../utils/AuthProvider';

interface LoginForm {
	email: string;
	password: string;
}

interface LoginInput {
	success: boolean;
	refreshToken: string;
	accessToken: string;
	message: string;
	member: any;
}

const LoginMutation = gql`
	mutation LoginMutation($input: memberLogin!) {
		login(input: $input) {
			member {
				firstName
				_id
				role
			}
			success
			refreshToken
			accessToken
			message
		}
	}
`;

/**
 * Container
 */

const Container = styled.View`
	flex: 1;
	background-color: ${theme.colors.main};
`;

const LoginText = styled.Text`
	color: ${theme.colors.bright};
	font-size: 22px;
	margin: 41px 0 0 28px;
`;

const ForgotPasswordText = styled.Text`
	color: ${theme.colors.blue};
	font-size: 14px;
	align-self: center;
`;

const LoginSubText = styled.Text`
	color: ${theme.colors.third};
	font-size: 14px;
	margin: 8px 0 0 28px;
`;

const LogoImage = styled(Logo)`
	width: 248px;
	height: 248px;
	align-self: center;
	margin: 70px 55px 0;
`;

const RegisterMessageContainer = styled.View`
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: center;
`;

const Login: React.FunctionComponent<IStackScreenProps> = props => {
	const { loginAuth } = useContext(AuthContext);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const { navigation, route, nameProp } = props;
	const passwordRef = useRef<any>(null);
	const [login, { loading }] = useMutation<
		{ login: LoginInput },
		{ input: LoginForm }
	>(LoginMutation);

	const initialValues: LoginForm = { email: '', password: '' };
	const LoginSchema = Yup.object().shape({
		email: Yup.string().email('Invalid Email').required('Required'),
		password: Yup.string().required('Required'),
	});
	const { handleChange, handleSubmit, handleBlur, values, errors, touched } =
		useFormik({
			initialValues: initialValues,
			validationSchema: LoginSchema,
			onSubmit: async values => {
				login({
					variables: {
						input: { email: values.email, password: values.password },
					},
					onCompleted: ({ login }) => {
						loginAuth(login);
					},
					onError: error => {
						console.log('Error: ', error);
					},
				});
			},
		});

	const windowHeight = useWindowDimensions().height;
	// const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [fontsLoaded] = useFonts({
		Roboto_400Regular,
		Roboto_700Bold,
	});

	if (!fontsLoaded) {
		return <AppLoading />;
	}

	return (
		<Container style={[{ minHeight: Math.round(windowHeight) }]}>
			<StatusBar style="light" />

			<LogoImage />

			<LoginText style={{ fontFamily: 'Roboto_700Bold' }}>{'Login'}</LoginText>

			<LoginSubText style={{ fontFamily: 'Roboto_400Regular' }}>
				{'Please sign in to continue'}
			</LoginSubText>

			<TextInput
				textContentType="emailAddress"
				icon={'user-alt'}
				onBlur={handleBlur('email')}
				error={errors.email}
				touched={touched.email}
				placeholder="Email"
				style={{ fontFamily: 'Roboto_400Regular' }}
				onChangeText={handleChange('email')}
				onSubmitEditing={() => passwordRef.current?.focus()}
				returnKeyType={'next'}
				returnKeyLabel={'next'}
				last={false}
			/>

			<TextInput
				ref={passwordRef}
				icon={'lock'}
				textContentType="password"
				onBlur={handleBlur('password')}
				error={errors.password}
				touched={touched.password}
				placeholder="Password"
				secureTextEntry={true}
				onChangeText={handleChange('password')}
				onSubmitEditing={() => handleSubmit()}
				returnKeyType={'go'}
				returnKeyLabel={'go'}
				last={true}
			/>

			<Button
				label={loading ? 'Loading' : 'Login'}
				onPress={handleSubmit}
			></Button>

			<ForgotPasswordText style={{ fontFamily: 'Roboto_400Regular' }}>
				{'Forgot Password!'}
			</ForgotPasswordText>
			<RegisterMessageContainer>
				<Text
					style={{
						color: theme.colors.third,
						fontFamily: 'Roboto_400Regular',
					}}
				>
					{"Don't have an account? "}
				</Text>
				<Text
					onPress={() => navigation.navigate('Register', { goBack: 'Login' })}
					style={{
						color: theme.colors.blue,
						fontFamily: 'Roboto_700Bold',
						fontSize: 16,
					}}
				>
					{'Sign Up'}
				</Text>
			</RegisterMessageContainer>
		</Container>
	);
};

export default Login;
