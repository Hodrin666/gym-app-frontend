/**
 * Module dependencies.
 */

import { IStackScreenProps } from '../library/StackScreenProps';
import { useQuery, gql } from '@apollo/client';
import React, { useContext } from 'react';
import { AuthContext } from '../utils/AuthProvider';
import MainNavbar from '../components/MainNavbar';
import styled from 'styled-components/native';
import {
	useFonts,
	Roboto_400Regular,
	Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { StatusBar } from 'react-native';
import theme from '../../theme';
import HeaderNav from '../components/HeaderNav';
import AppLoading from 'expo-app-loading';
import SafeAreaView from 'react-native-safe-area-view';

const GetDailyClass = gql`
	query GetDailyClass {
		getDailyClass {
			description
		}
	}
`;

const HomeContainer = styled(SafeAreaView)`
	background-color: ${theme.colors.main};
	flex: 1;
`;

const WodContainer = styled.SafeAreaView`
	background-color: ${theme.colors.main};
	flex: 1;
	padding: 40px 28px;
`;

const WodWrapper = styled.SafeAreaView`
	background-color: ${theme.colors.secondary};
	height: 300px;
	display: flex;
	border: 1px solid black;
	border-radius: ${theme.borderRadius};
	overflow: hidden;
	padding-bottom: 24px;
`;

const WodTitleWrapper = styled.SafeAreaView`
	background-color: ${theme.colors.blue};
	height: 40px;
	display: flex;
	justify-content: center;
	padding-left: 16px;
`;

const WodTitle = styled.Text`
	font-size: 22px;
`;

const WodDescription = styled.Text`
	font-size: 16px;
	color: ${theme.colors.bright};
`;

const WodDescritpionWrapper = styled.ScrollView`
	padding: 20px 28px;
`;

const HomeScreen: React.FunctionComponent<IStackScreenProps> = props => {
	const { userAuth } = useContext(AuthContext);
	const { nameProp, navigation, route } = props;

	const { data, loading } = useQuery(GetDailyClass, {
		fetchPolicy: 'network-only',
	});

	const [fontsLoaded] = useFonts({
		Roboto_400Regular,
		Roboto_700Bold,
	});

	if (loading) {
		return <AppLoading />;
	} else if (!fontsLoaded) {
		return <AppLoading />;
	} else {
		console.log('data');
		return (
			<HomeContainer>
				<StatusBar backgroundColor={theme.colors.main} />
				<HeaderNav navigation={navigation} />
				<WodContainer>
					<WodWrapper>
						<WodTitleWrapper>
							<WodTitle style={{ fontFamily: 'Roboto_700Bold' }}>
								{'WOD:'}
							</WodTitle>
						</WodTitleWrapper>

						<WodDescritpionWrapper>
							<WodDescription style={{ fontFamily: 'Roboto_400Regular' }}>
								{data.getDailyClass.description}
							</WodDescription>
						</WodDescritpionWrapper>
					</WodWrapper>
				</WodContainer>
				<MainNavbar navigation={navigation} />
			</HomeContainer>
		);
	}
};

export default HomeScreen;
