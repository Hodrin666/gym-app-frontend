/**
 * Module dependencies.
 */

import AppLoading from 'expo-app-loading';
import { AntDesign, Foundation, Ionicons } from '@expo/vector-icons';
import { ifProp } from 'styled-tools';
import { StatusBar } from 'expo-status-bar';
import styled, { css } from 'styled-components/native';
import theme from '../../theme';
import { Text, useWindowDimensions } from 'react-native';
import {
	useFonts,
	Roboto_400Regular,
	Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import React, { useEffect } from 'react';
import { IStackScreenProps } from '../library/StackScreenProps';

/**
 * `Container` styled component.
 */

const Container = styled.View`
	flex: 1;
	background-color: ${theme.colors.main};
	padding: 0 28px;
`;

/**
 * `ArrowBack` styled component.
 */

const ArrowBack = styled(AntDesign)`
	color: ${theme.colors.bright};
	margin-top: 70px;
`;

/**
 * `FormContainer` styled component.
 */

const FormContainer = styled.View`
	margin-top: 40px;
`;

/**
 * `FormTitle` styled component.
 */

const FormTitle = styled.Text`
	color: ${theme.colors.bright};
	font-size: 22px;
`;

/**
 * `FormSubTitle` styled component.
 */

const FormSubTitle = styled.Text`
	color: ${theme.colors.third};
	margin-bottom: 40px;
	font-size: 14px;
`;

/**
 * `InputContainer` styled component.
 */

const InputContainer = styled.View<{ first?: boolean }>`
	margin-top: ${ifProp({ first: true }, '0', '26px')};
	min-height: 48px;
	flex: 1;
	flex-direction: row;
	align-items: center;
	background-color: ${theme.colors.secondary};
	border-radius: ${theme.borderRadius};
`;

/**
 * `Input` styled component.
 */

const Input = styled.TextInput.attrs({
	autoCapitalize: 'none',
	placeholderTextColor: theme.colors.bright,
})`
	flex: 1;
	height: 48px;
	background-color: ${theme.colors.secondary};
	border-radius: ${theme.borderRadius};
	color: ${theme.colors.bright};
`;

const InputEmailIcon = styled(Ionicons)`
	padding: 10px;
`;

const InputContactIcon = styled(Foundation)`
	padding: 10px;
`;

const InputNameIcon = styled(AntDesign)`
	padding: 10px;
`;

const RegisterButton = styled.TouchableOpacity`
	align-self: center;
	min-height: 63px;
	width: 248px;
	flex: 1;
	margin-top: 50px;
	margin-bottom: 8px;
	background-color: ${theme.colors.blue};
	color: ${theme.colors.third};
	border-radius: ${theme.borderRadius};
	align-items: center;
	justify-content: center;
`;

const RegisterButtonText = styled.Text`
	color: ${theme.colors.secondary};
	font-size: 22px;
`;

const form = [
	{
		name: 'mail-outline',
		iconType: InputEmailIcon,
		placeHolder: 'Email',
		contentType: 'emailAddress',
		secureTextEntry: false,
	},
	{
		name: 'user',
		iconType: InputNameIcon,
		placeHolder: 'First Name',
		contentType: 'name',
		secureTextEntry: false,
	},
	{
		name: 'user',
		iconType: InputNameIcon,
		placeHolder: 'Last Name',
		contentType: 'name',
		secureTextEntry: false,
	},
	{
		name: 'telephone',
		iconType: InputContactIcon,
		placeHolder: 'Telephone',
		contentType: 'telephoneNumber',
		secureTextEntry: false,
	},
	{
		name: 'md-lock-closed-outline',
		iconType: InputEmailIcon,
		placeHolder: 'Password',
		contentType: 'password',
		secureTextEntry: true,
	},
	{
		name: 'md-lock-closed-outline',
		iconType: InputEmailIcon,
		placeHolder: 'Verify Password',
		contentType: 'password',
		secureTextEntry: true,
	},
];

const Register: React.FunctionComponent<IStackScreenProps> = props => {
	const windowHeight = useWindowDimensions().height;
	const [fontsLoaded] = useFonts({
		Roboto_400Regular,
		Roboto_700Bold,
	});

	const { navigation, route, nameProp } = props;
	const routeBack = route?.params?.goBack;

	if (!fontsLoaded) {
		return <AppLoading />;
	}

	return (
		<Container style={[{ minHeight: Math.round(windowHeight) }]}>
			<StatusBar style="light" />

			<ArrowBack
				name={'arrowleft'}
				onPress={() => navigation.navigate(routeBack)}
				size={25}
			/>

			<FormContainer>
				<FormTitle style={{ fontFamily: 'Roboto_700Bold' }}>
					{'Create Account'}
				</FormTitle>
				<FormSubTitle style={{ fontFamily: 'Roboto_400Regular' }}>
					{'Please fill the form below'}
				</FormSubTitle>

				{form.map((value, key) => (
					<InputContainer first={key === 0 ? true : false}>
						<value.iconType
							name={value.name}
							size={24}
							color={theme.colors.bright}
						/>
						<Input
							textContentType={value.contentType}
							placeholder={value.placeHolder}
							secureTextEntry={value.secureTextEntry}
							style={{ fontFamily: 'Roboto_400Regular' }}
						></Input>
					</InputContainer>
				))}

				<RegisterButton>
					<RegisterButtonText style={{ fontFamily: 'Roboto_700Bold' }}>
						{'Register'}
					</RegisterButtonText>
				</RegisterButton>
			</FormContainer>
		</Container>
	);
};

export default Register;
