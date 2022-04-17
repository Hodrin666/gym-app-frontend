/**
 * Module dependencies.
 */

import AppLoading from 'expo-app-loading';
import React from 'react';
import styled from 'styled-components/native';
import theme from '../../theme';
import {
	useFonts,
	Roboto_400Regular,
	Roboto_700Bold,
} from '@expo-google-fonts/roboto';

/**
 * `LoginButton` styled components.
 */

const LoginButton = styled.TouchableOpacity`
	align-self: center;
	max-height: 63px;
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

/**
 * `LoginButtonText` styled components.
 */

const LoginButtonText = styled.Text`
	color: ${theme.colors.secondary};
	font-size: 22px;
`;

/**
 * `Button` function component.
 */

function Button({ label, onPress }: { label: string; onPress: any }) {
	const [fontsLoaded] = useFonts({
		Roboto_400Regular,
		Roboto_700Bold,
	});

	if (!fontsLoaded) {
		return <AppLoading />;
	}

	return (
		<LoginButton activeOpacity={0.7} onPress={onPress}>
			<LoginButtonText
				style={{ fontFamily: 'Roboto_700Bold', textTransform: 'uppercase' }}
			>
				{label}
			</LoginButtonText>
		</LoginButton>
	);
}

/**
 * Export Button
 */

export default Button;
