/**
 * Module dependencies.
 */

import { StackNavigationProp } from '@react-navigation/stack';
import { Text, View } from 'react-native';
import React, { useContext } from 'react';
import { AuthContext } from '../utils/AuthProvider';
import styled from 'styled-components/native';
import theme from '../../theme';
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

/**
 * IProps interface.
 */

interface IProps {
	navigation: StackNavigationProp<any>;
}

/**
 * MainNavbarContainer styled component.
 */

const MainNavbarContainer = styled(View)`
	min-height: 75px;
	width: 100%;
	background-color: ${theme.colors.main};
	margin-top: auto;
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	flex-direction: row;
`;

/**
 * Divider styled component.
 */

const Divider = styled.View`
	width: 100%;
	height: 2px;
	background-color: ${theme.colors.bright};
	position: absolute;
	top: 0;
	left: 0;
`;

/**
 * Icon styled component.
 */

const Icon = styled(FontAwesome5)`
	color: ${theme.colors.bright};
`;

/**
 * IconContainer styled component.
 */

const IconContainer = styled(TouchableOpacity)`
	color: black;
	height: 40px;
	width: 40px;
`;

/**
 * `MainNavbar` function component.
 */

const MainNavbar: React.FunctionComponent<IProps> = props => {
	const { userAuth } = useContext(AuthContext);
	const { navigation } = props;

	return (
		<MainNavbarContainer>
			<Divider />
			<Icon name={'calendar-alt'} size={40} />
			<Icon name={'dumbbell'} size={40} />
			<IconContainer onPress={() => navigation.navigate('TeacherCalendar')}>
				<Icon name={'calendar-plus'} size={40} />
			</IconContainer>
		</MainNavbarContainer>
	);
};

/**
 * Export MainNavbar.
 */

export default MainNavbar;
