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
import { Formik } from 'formik';
import RegisterForm from '../components/Forms/RegisterForm';
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
	padding: 28px 0;
	justify-content: center;
`;

/**
 * `ArrowBack` styled component.
 */

const ArrowBack = styled(AntDesign)`
	color: ${theme.colors.bright};
	margin-top: 70px;
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

const Register: React.FunctionComponent<IStackScreenProps> = props => {
	const windowHeight = useWindowDimensions().height;
	const [fontsLoaded] = useFonts({
		Roboto_400Regular,
		Roboto_700Bold,
	});

	const { navigation, route, nameProp } = props;

	if (!fontsLoaded) {
		return <AppLoading />;
	}

	return (
		<Container style={[{ minHeight: Math.round(windowHeight) }]}>
			<StatusBar style="light" />

			<RegisterForm navigate={navigation} />
		</Container>
	);
};

export default Register;
