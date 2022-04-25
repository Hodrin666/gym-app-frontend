/**
 * Module dependencies.
 */

import { Text, View } from 'react-native';
import { IStackScreenProps } from '../library/StackScreenProps';
import { useQuery, gql } from '@apollo/client';
import { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../utils/AuthProvider';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MainNavbar from '../components/MainNavbar';
import DropDownPicker from 'react-native-dropdown-picker';
import styled from 'styled-components';
import { SafeAreaContext, SafeAreaView } from 'react-native-safe-area-context';
import theme from '../../theme';
import HeaderNav from '../components/HeaderNav';

const AllUsers = gql`
	query allUsers($first: Int) {
		allUsers(first: $first) {
			_id
			firstName
			lastName
			contact
			email
			password
		}
	}
`;

const HomeContainer = styled(SafeAreaView)`
	background-color: ${theme.colors.main};
	flex: 1;
`;

const HomeScreen: React.FunctionComponent<IStackScreenProps> = props => {
	const { userAuth } = useContext(AuthContext);
	const { nameProp, navigation, route } = props;

	return (
		<HomeContainer>
			<HeaderNav navigation={navigation} />
			<MainNavbar navigation={navigation} />
		</HomeContainer>
	);
};

export default HomeScreen;
