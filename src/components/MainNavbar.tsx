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
 * `MainNavbar` function component.
 */

const MainNavbar: React.FunctionComponent<IProps> = props => {
	const { userAuth } = useContext(AuthContext);
	const { navigation } = props;

	return (
		<MainNavbarContainer>
			<Divider />

			<TouchableOpacity onPress={() => navigation.navigate('MemberCalendar')}>
				<Icon name={'calendar-alt'} size={40} />
			</TouchableOpacity>

			<TouchableOpacity onPress={() => navigation.navigate('Home')}>
				<Icon name={'dumbbell'} size={40} />
			</TouchableOpacity>

			{userAuth?.member.role !== 'member' && (
				<TouchableOpacity
					onPress={() => navigation.navigate('TeacherCalendar')}
				>
					<Icon name={'calendar-plus'} size={40} />
				</TouchableOpacity>
			)}
		</MainNavbarContainer>
	);
};

/**
 * Export MainNavbar.
 */

export default MainNavbar;
