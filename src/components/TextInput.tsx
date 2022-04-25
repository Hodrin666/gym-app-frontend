import React, { forwardRef } from 'react';
import { TextInput as RNTextInput, TextInputProps } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import theme from '../../theme';
import styled from 'styled-components/native';
import { ifProp } from 'styled-tools';

type Ref = RNTextInput;

/**
 * `InputContainer` styled component.
 */

const InputContainer = styled.View<{ last?: boolean }>`
	margin: ${ifProp({ last: true }, '0 28px', '20px 28px')};
	max-height: 48px;
	flex: 1;
	flex-direction: row;
	align-items: center;
	background-color: ${theme.colors.secondary};
	border-radius: ${theme.borderRadius};
`;

/**
 * `Icon` styled component.
 */

const Icon = styled(FontAwesome5)`
	padding: 10px;
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
	border-radius: ${theme.borderRadius};
`;

/**
 * `TextInput` forward ref component.
 */

const TextInput = forwardRef<Ref, any>(
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
		const validationColor = !touched
			? theme.colors.bright
			: error
			? theme.colors.error
			: theme.colors.bright;

		return (
			<>
				<InputContainer last={last}>
					<Icon name={icon} size={24} color={validationColor} />

					<Input
						placeholderTextColor="rgba(34, 62, 75, 0.7)"
						style={{ fontFamily: 'Roboto_400Regular' }}
						ref={ref}
						{...otherProps}
					/>
				</InputContainer>
			</>
		);
	}
);

/**
 * Export `TextInput`.
 */

export default TextInput;
