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

const HomeScreen: React.FunctionComponent<IStackScreenProps> = props => {
	const { userAuth } = useContext(AuthContext);
	const { nameProp, navigation, route } = props;

	return (
		<>
			<MainNavbar navigation={navigation} />
		</>
	);
};

export default HomeScreen;
