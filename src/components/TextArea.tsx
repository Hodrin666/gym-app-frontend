/**
 * Module dependencies.
 */

import AppLoading from 'expo-app-loading';
import React, { forwardRef, useState } from 'react';
import { TextInput as RNTextInput, TextInputProps } from 'react-native';
import theme from '../../theme';
import styled from 'styled-components/native';
import {
	useFonts,
	Roboto_400Regular,
	Roboto_700Bold,
} from '@expo-google-fonts/roboto';

type Ref = RNTextInput;

/**
 * `Description` styled component
 */

const Description = styled.TextInput`
	border: 1px solid;
	min-height: 48px;
	background-color: ${theme.colors.main};
	margin: 28px 20px 0;
	border-radius: ${theme.borderRadius};
	color: ${theme.colors.bright};
	padding-left: 8px;
`;

/**
 * `TextArea` forward ref component.
 */

const TextArea = forwardRef<Ref, any>(
	(
		{
			icon,
			error,
			touched,
			last,
			...otherProps
		}: {
			icon: string;
			error: string | undefined;
			touched: boolean | undefined;
			last: boolean;
			otherProps: TextInputProps;
		},
		ref
	) => {
		const [height, setHeight] = useState<number>(0);

		const validationColor = !touched
			? theme.colors.black
			: error
			? theme.colors.error
			: theme.colors.black;

		const [fontsLoaded] = useFonts({
			Roboto_400Regular,
		});

		if (!fontsLoaded) {
			return <AppLoading />;
		} else {
			return (
				<Description
					placeholder={'WOD Description'}
					placeholderTextColor={theme.colors.bright}
					multiline={true}
					onContentSizeChange={event =>
						setHeight(event.nativeEvent.contentSize.height)
					}
					style={{
						height: Math.max(35, height),
						borderColor: validationColor,
						fontFamily: 'Roboto_400Regular',
					}}
					ref={ref}
					{...otherProps}
				/>
			);
		}
	}
);

/**
 * Export `TextArea`.
 */

export default TextArea;
